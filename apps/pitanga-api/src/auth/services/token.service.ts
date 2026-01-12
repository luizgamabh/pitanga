import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes, createHash } from 'crypto';
import {
  ITokenPayload,
  IRefreshTokenPayload,
  ITokenPair,
  AUTH_CONSTANTS,
} from '@pitanga/auth-types';
import { Role } from '@prisma/client';
import { PrismaService } from '../../database';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async generateTokenPair(
    userId: string,
    email: string,
    role: Role,
    deviceInfo?: { userAgent?: string; ipAddress?: string },
  ): Promise<ITokenPair> {
    const accessToken = await this.generateAccessToken(userId, email, role);
    const refreshToken = await this.generateRefreshToken(userId, deviceInfo);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresAt: new Date(
        Date.now() + AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY_MS,
      ),
      refreshTokenExpiresAt: new Date(
        Date.now() + AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY_MS,
      ),
    };
  }

  private async generateAccessToken(
    userId: string,
    email: string,
    role: Role,
  ): Promise<string> {
    const payload: ITokenPayload = {
      sub: userId,
      email,
      role,
      type: 'access',
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY,
    });
  }

  private async generateRefreshToken(
    userId: string,
    deviceInfo?: { userAgent?: string; ipAddress?: string },
  ): Promise<string> {
    const tokenValue = randomBytes(32).toString('hex');
    const hashedToken = this.hashToken(tokenValue);

    const expiresAt = new Date(
      Date.now() + AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY_MS,
    );

    await this.prisma.refreshToken.create({
      data: {
        token: hashedToken,
        userId,
        expiresAt,
        userAgent: deviceInfo?.userAgent,
        ipAddress: deviceInfo?.ipAddress,
      },
    });

    // Encode refresh token with user info for validation
    const payload: IRefreshTokenPayload = {
      sub: userId,
      token: tokenValue,
      type: 'refresh',
    };

    return this.jwtService.signAsync(payload, {
      expiresIn: `${AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY_DAYS}d`,
    });
  }

  async refreshTokens(
    refreshToken: string,
    deviceInfo?: { userAgent?: string; ipAddress?: string },
  ): Promise<ITokenPair | null> {
    try {
      const payload = await this.jwtService.verifyAsync<IRefreshTokenPayload>(
        refreshToken,
      );

      if (payload.type !== 'refresh') {
        return null;
      }

      const hashedToken = this.hashToken(payload.token);

      const storedToken = await this.prisma.refreshToken.findUnique({
        where: { token: hashedToken },
        include: { user: true },
      });

      if (
        !storedToken ||
        storedToken.revokedAt ||
        storedToken.expiresAt < new Date()
      ) {
        return null;
      }

      // Revoke the old token
      await this.prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revokedAt: new Date() },
      });

      // Generate new token pair
      return this.generateTokenPair(
        storedToken.user.id,
        storedToken.user.email,
        storedToken.user.role,
        deviceInfo,
      );
    } catch {
      return null;
    }
  }

  async revokeRefreshToken(refreshToken: string): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync<IRefreshTokenPayload>(
        refreshToken,
      );

      const hashedToken = this.hashToken(payload.token);

      await this.prisma.refreshToken.updateMany({
        where: { token: hashedToken, revokedAt: null },
        data: { revokedAt: new Date() },
      });

      return true;
    } catch {
      return false;
    }
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  generateVerificationToken(): string {
    return randomBytes(32).toString('hex');
  }

  generateResetToken(): string {
    return randomBytes(32).toString('hex');
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async verifyAccessToken(token: string): Promise<ITokenPayload | null> {
    try {
      const payload = await this.jwtService.verifyAsync<ITokenPayload>(token);
      if (payload.type !== 'access') {
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  }
}
