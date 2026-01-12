import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { VerificationService } from './verification.service';
import { TwoFactorService } from './two-factor.service';
import {
  RegisterDto,
  LoginDto,
  IAuthResponse,
  ILoginResponse,
  IUserProfile,
  ITokenPair,
} from '@pitanga/auth-types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly verificationService: VerificationService,
    private readonly twoFactorService: TwoFactorService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    dto: RegisterDto,
    deviceInfo?: { userAgent?: string; ipAddress?: string },
  ): Promise<IAuthResponse> {
    // Validate password
    const passwordValidation = this.passwordService.validate(dto.password);
    if (!passwordValidation.valid) {
      throw new BadRequestException(passwordValidation.errors.join(', '));
    }

    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Hash password and create user
    const hashedPassword = await this.passwordService.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        name: dto.name,
        password: hashedPassword,
      },
    });

    // Send verification email
    await this.verificationService.sendVerificationEmail(user.id);

    // Generate tokens
    const tokens = await this.tokenService.generateTokenPair(
      user.id,
      user.email,
      user.role,
      deviceInfo,
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      ...tokens,
    };
  }

  async login(
    dto: LoginDto,
    deviceInfo?: { userAgent?: string; ipAddress?: string },
  ): Promise<ILoginResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await this.passwordService.compare(
      dto.password,
      user.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new ForbiddenException('Email not verified');
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Generate temporary token for 2FA verification
      const twoFactorToken = await this.jwtService.signAsync(
        { sub: user.id, type: '2fa_pending' },
        { expiresIn: '5m' },
      );

      return {
        requiresTwoFactor: true,
        twoFactorToken,
      };
    }

    // Generate tokens
    const tokens = await this.tokenService.generateTokenPair(
      user.id,
      user.email,
      user.role,
      deviceInfo,
    );

    return {
      requiresTwoFactor: false,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
      },
      ...tokens,
    };
  }

  async verifyTwoFactorLogin(
    twoFactorToken: string,
    code: string,
    deviceInfo?: { userAgent?: string; ipAddress?: string },
  ): Promise<IAuthResponse> {
    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        type: string;
      }>(twoFactorToken);

      if (payload.type !== '2fa_pending') {
        throw new UnauthorizedException('Invalid token');
      }

      const isValid = await this.twoFactorService.verify(payload.sub, code);

      if (!isValid) {
        throw new UnauthorizedException('Invalid 2FA code');
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const tokens = await this.tokenService.generateTokenPair(
        user.id,
        user.email,
        user.role,
        deviceInfo,
      );

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          emailVerified: user.emailVerified,
        },
        ...tokens,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired 2FA token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    await this.tokenService.revokeRefreshToken(refreshToken);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.tokenService.revokeAllUserTokens(userId);
  }

  async refreshTokens(
    refreshToken: string,
    deviceInfo?: { userAgent?: string; ipAddress?: string },
  ): Promise<ITokenPair> {
    const tokens = await this.tokenService.refreshTokens(
      refreshToken,
      deviceInfo,
    );

    if (!tokens) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return tokens;
  }

  async getProfile(userId: string): Promise<IUserProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        oauthAccounts: {
          select: { provider: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified,
      emailVerifiedAt: user.emailVerifiedAt,
      twoFactorEnabled: user.twoFactorEnabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      linkedProviders: user.oauthAccounts.map((acc) => acc.provider),
    };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      throw new BadRequestException('Cannot change password for OAuth-only account');
    }

    const passwordValid = await this.passwordService.compare(
      currentPassword,
      user.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const validation = this.passwordService.validate(newPassword);
    if (!validation.valid) {
      throw new BadRequestException(validation.errors.join(', '));
    }

    const hashedPassword = await this.passwordService.hash(newPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Revoke all refresh tokens except current session
    await this.tokenService.revokeAllUserTokens(userId);

    return true;
  }

  async setPassword(userId: string, password: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.password) {
      throw new BadRequestException('Password already set. Use change password instead.');
    }

    const validation = this.passwordService.validate(password);
    if (!validation.valid) {
      throw new BadRequestException(validation.errors.join(', '));
    }

    const hashedPassword = await this.passwordService.hash(password);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return true;
  }
}
