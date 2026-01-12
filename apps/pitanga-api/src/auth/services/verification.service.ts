import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database';
import { TokenService } from './token.service';
import { EmailService } from './email.service';
import { AUTH_CONSTANTS } from '@pitanga/auth-types';

@Injectable()
export class VerificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
  ) {}

  async createVerificationToken(userId: string): Promise<string> {
    const token = this.tokenService.generateVerificationToken();
    const hashedToken = this.tokenService.hashToken(token);

    const expiresAt = new Date(
      Date.now() + AUTH_CONSTANTS.VERIFICATION_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
    );

    // Invalidate any existing verification tokens
    await this.prisma.verificationToken.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });

    await this.prisma.verificationToken.create({
      data: {
        token: hashedToken,
        userId,
        expiresAt,
      },
    });

    return token;
  }

  async sendVerificationEmail(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email already verified');
    }

    const token = await this.createVerificationToken(userId);
    return this.emailService.sendVerificationEmail(user.email, user.name, token);
  }

  async verifyEmail(token: string): Promise<{ success: boolean; userId: string }> {
    const hashedToken = this.tokenService.hashToken(token);

    const verificationToken = await this.prisma.verificationToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!verificationToken) {
      throw new BadRequestException('Invalid verification token');
    }

    if (verificationToken.usedAt) {
      throw new BadRequestException('Token already used');
    }

    if (verificationToken.expiresAt < new Date()) {
      throw new BadRequestException('Token expired');
    }

    // Mark token as used and verify email
    await this.prisma.$transaction([
      this.prisma.verificationToken.update({
        where: { id: verificationToken.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: verificationToken.userId },
        data: {
          emailVerified: true,
          emailVerifiedAt: new Date(),
        },
      }),
    ]);

    // Send welcome email
    await this.emailService.sendWelcomeEmail(
      verificationToken.user.email,
      verificationToken.user.name,
    );

    return {
      success: true,
      userId: verificationToken.userId,
    };
  }
}
