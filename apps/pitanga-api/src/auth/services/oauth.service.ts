import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database';
import { TokenService } from './token.service';
import { OAuthProvider } from '@prisma/client';
import { IOAuthProfile, ITokenPair } from '@pitanga/auth-types';

@Injectable()
export class OAuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async handleOAuthLogin(
    profile: IOAuthProfile,
    provider: OAuthProvider,
    deviceInfo?: { userAgent?: string; ipAddress?: string },
  ): Promise<{ user: { id: string; email: string; name: string | null }; tokens: ITokenPair; isNewUser: boolean }> {
    // Check if OAuth account exists
    const existingOAuthAccount = await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_providerUserId: {
          provider,
          providerUserId: profile.id,
        },
      },
      include: { user: true },
    });

    if (existingOAuthAccount) {
      // Update tokens if provided
      await this.prisma.oAuthAccount.update({
        where: { id: existingOAuthAccount.id },
        data: {
          accessToken: profile.accessToken,
          refreshToken: profile.refreshToken,
          expiresAt: profile.expiresAt,
        },
      });

      const tokens = await this.tokenService.generateTokenPair(
        existingOAuthAccount.user.id,
        existingOAuthAccount.user.email,
        existingOAuthAccount.user.role,
        deviceInfo,
      );

      return {
        user: {
          id: existingOAuthAccount.user.id,
          email: existingOAuthAccount.user.email,
          name: existingOAuthAccount.user.name,
        },
        tokens,
        isNewUser: false,
      };
    }

    // Check if user exists with same email
    const existingUser = await this.prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (existingUser) {
      // Link OAuth account to existing user
      await this.prisma.oAuthAccount.create({
        data: {
          provider,
          providerUserId: profile.id,
          accessToken: profile.accessToken,
          refreshToken: profile.refreshToken,
          expiresAt: profile.expiresAt,
          userId: existingUser.id,
        },
      });

      // Verify email if not already verified
      if (!existingUser.emailVerified) {
        await this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            emailVerified: true,
            emailVerifiedAt: new Date(),
          },
        });
      }

      const tokens = await this.tokenService.generateTokenPair(
        existingUser.id,
        existingUser.email,
        existingUser.role,
        deviceInfo,
      );

      return {
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
        },
        tokens,
        isNewUser: false,
      };
    }

    // Create new user with OAuth account
    const newUser = await this.prisma.user.create({
      data: {
        email: profile.email,
        name: profile.name,
        emailVerified: true,
        emailVerifiedAt: new Date(),
        oauthAccounts: {
          create: {
            provider,
            providerUserId: profile.id,
            accessToken: profile.accessToken,
            refreshToken: profile.refreshToken,
            expiresAt: profile.expiresAt,
          },
        },
      },
    });

    const tokens = await this.tokenService.generateTokenPair(
      newUser.id,
      newUser.email,
      newUser.role,
      deviceInfo,
    );

    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      tokens,
      isNewUser: true,
    };
  }

  async unlinkOAuthAccount(
    userId: string,
    provider: OAuthProvider,
  ): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { oauthAccounts: true },
    });

    if (!user) {
      return false;
    }

    // Ensure user has another way to login
    const hasPassword = !!user.password;
    const otherOAuthAccounts = user.oauthAccounts.filter(
      (acc) => acc.provider !== provider,
    );

    if (!hasPassword && otherOAuthAccounts.length === 0) {
      throw new Error(
        'Cannot unlink OAuth account. Set a password first or link another OAuth provider.',
      );
    }

    await this.prisma.oAuthAccount.deleteMany({
      where: {
        userId,
        provider,
      },
    });

    return true;
  }

  async getLinkedProviders(userId: string): Promise<OAuthProvider[]> {
    const accounts = await this.prisma.oAuthAccount.findMany({
      where: { userId },
      select: { provider: true },
    });

    return accounts.map((acc) => acc.provider);
  }
}
