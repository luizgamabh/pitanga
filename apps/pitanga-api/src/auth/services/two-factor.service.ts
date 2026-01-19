import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateSecret, verify, generateURI, VerifyOptions } from 'otplib';
import * as QRCode from 'qrcode';
import { PrismaService } from '../../database';
import { ITwoFactorSetup, AUTH_CONSTANTS } from '@pitanga/auth-types';

@Injectable()
export class TwoFactorService {
  private readonly appName: string;
  private readonly verifyOptions: Partial<VerifyOptions>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.appName =
      this.configService.get<string>('TWO_FACTOR_APP_NAME') || 'Pitanga';

    // Configure verification options with window tolerance
    this.verifyOptions = {
      window: AUTH_CONSTANTS.TOTP_WINDOW,
    };
  }

  async generateSetup(userId: string): Promise<ITwoFactorSetup> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.twoFactorEnabled) {
      throw new BadRequestException('2FA already enabled');
    }

    const secret = generateSecret();
    const otpauthUrl = generateURI({
      type: 'totp',
      secret,
      label: user.email,
      issuer: this.appName,
    });
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    return {
      secret,
      qrCode,
      otpauthUrl,
    };
  }

  async enable(userId: string, secret: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.twoFactorEnabled) {
      throw new BadRequestException('2FA already enabled');
    }

    const result = await verify({
      secret,
      token: code,
      ...this.verifyOptions,
    });

    if (!result.valid) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
      },
    });

    return true;
  }

  async disable(
    userId: string,
    code: string,
    password: string,
    passwordService: { compare: (p: string, h: string) => Promise<boolean> },
  ): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      throw new BadRequestException('2FA not enabled');
    }

    // Verify password
    if (!user.password) {
      throw new BadRequestException('Cannot disable 2FA for OAuth-only account');
    }

    const passwordValid = await passwordService.compare(password, user.password);
    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    // Verify TOTP code
    const result = await verify({
      secret: user.twoFactorSecret,
      token: code,
      ...this.verifyOptions,
    });

    if (!result.valid) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    return true;
  }

  async verify(userId: string, code: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return false;
    }

    const result = await verify({
      secret: user.twoFactorSecret,
      token: code,
      ...this.verifyOptions,
    });

    return result.valid;
  }

  async isEnabled(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorEnabled: true },
    });

    return user?.twoFactorEnabled ?? false;
  }
}
