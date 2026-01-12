import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database';
import { TokenService } from './token.service';
import { EmailService } from './email.service';
import { PasswordService } from './password.service';
import { AUTH_CONSTANTS } from '@pitanga/auth-types';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly emailService: EmailService,
    private readonly passwordService: PasswordService,
  ) {}

  async requestPasswordReset(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Always return true to prevent email enumeration
    if (!user || !user.password) {
      return true;
    }

    const token = this.tokenService.generateResetToken();
    const hashedToken = this.tokenService.hashToken(token);

    const expiresAt = new Date(
      Date.now() + AUTH_CONSTANTS.RESET_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000,
    );

    // Invalidate any existing reset tokens
    await this.prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    await this.prisma.passwordResetToken.create({
      data: {
        token: hashedToken,
        userId: user.id,
        expiresAt,
      },
    });

    await this.emailService.sendPasswordResetEmail(user.email, user.name, token);

    return true;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const validation = this.passwordService.validate(newPassword);
    if (!validation.valid) {
      throw new BadRequestException(validation.errors.join(', '));
    }

    const hashedToken = this.tokenService.hashToken(token);

    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
      include: { user: true },
    });

    if (!resetToken) {
      throw new BadRequestException('Invalid reset token');
    }

    if (resetToken.usedAt) {
      throw new BadRequestException('Token already used');
    }

    if (resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Token expired');
    }

    const hashedPassword = await this.passwordService.hash(newPassword);

    // Mark token as used and update password
    await this.prisma.$transaction([
      this.prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.user.update({
        where: { id: resetToken.userId },
        data: { password: hashedPassword },
      }),
    ]);

    // Revoke all refresh tokens for security
    await this.tokenService.revokeAllUserTokens(resetToken.userId);

    return true;
  }
}
