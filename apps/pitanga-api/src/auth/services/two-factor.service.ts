import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import { PrismaService } from '../../database';
import { ITwoFactorSetup, AUTH_CONSTANTS } from '@pitanga/auth-types';

@Injectable()
export class TwoFactorService {
  private readonly appName: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.appName =
      this.configService.get<string>('TWO_FACTOR_APP_NAME') || 'Pitanga';

    // Configure authenticator
    authenticator.options = {
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

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(user.email, this.appName, secret);
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

    const isValid = authenticator.verify({ token: code, secret });

    if (!isValid) {
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
    const isValid = authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
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

    return authenticator.verify({
      token: code,
      secret: user.twoFactorSecret,
    });
  }

  async isEnabled(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorEnabled: true },
    });

    return user?.twoFactorEnabled ?? false;
  }
}
