import { Controller, Get, Inject, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { OAuthProvider } from '@prisma/client';
import { OAuthService } from '../services';
import { GoogleOAuthGuard, FacebookOAuthGuard } from '../guards';
import { Public } from '../decorators';
import { IOAuthProfile, AUTH_CONSTANTS } from '@pitanga/auth-types';
import { OAUTH_PROVIDERS_CONFIG } from '../config';
import type { OAuthProviderConfig } from '../config';

@Controller('auth')
export class OAuthController {
  private readonly frontendUrl: string;

  constructor(
    private readonly oauthService: OAuthService,
    private readonly configService: ConfigService,
    @Inject(OAUTH_PROVIDERS_CONFIG)
    private readonly oauthConfig: OAuthProviderConfig,
  ) {
    this.frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  }

  /**
   * Returns which OAuth providers are available on this server
   */
  @Public()
  @Get('oauth/providers')
  getAvailableProviders(): OAuthProviderConfig {
    return this.oauthConfig;
  }

  @Public()
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  googleAuth(): void {
    // Guard redirects to Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.handleOAuthCallback(req, res, OAuthProvider.GOOGLE);
  }

  @Public()
  @Get('facebook')
  @UseGuards(FacebookOAuthGuard)
  facebookAuth(): void {
    // Guard redirects to Facebook
  }

  @Public()
  @Get('facebook/callback')
  @UseGuards(FacebookOAuthGuard)
  async facebookCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.handleOAuthCallback(req, res, OAuthProvider.FACEBOOK);
  }

  private async handleOAuthCallback(
    req: Request,
    res: Response,
    provider: OAuthProvider,
  ): Promise<void> {
    try {
      const profile = req.user as IOAuthProfile;
      const deviceInfo = {
        userAgent: req.headers['user-agent'],
        ipAddress:
          (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
          req.socket.remoteAddress,
      };

      const result = await this.oauthService.handleOAuthLogin(
        profile,
        provider,
        deviceInfo,
      );

      const isProduction = process.env.NODE_ENV === 'production';

      // Set cookies
      res.cookie(
        AUTH_CONSTANTS.COOKIE_ACCESS_TOKEN,
        result.tokens.accessToken,
        {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? 'strict' : 'lax',
          maxAge: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY_MS,
        },
      );

      res.cookie(
        AUTH_CONSTANTS.COOKIE_REFRESH_TOKEN,
        result.tokens.refreshToken,
        {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? 'strict' : 'lax',
          maxAge: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY_MS,
          path: '/api/auth',
        },
      );

      // Redirect to frontend with success
      const redirectUrl = new URL(`${this.frontendUrl}/auth/callback`);
      redirectUrl.searchParams.set('success', 'true');
      redirectUrl.searchParams.set('isNewUser', String(result.isNewUser));

      res.redirect(redirectUrl.toString());
    } catch (error) {
      // Redirect to frontend with error
      const redirectUrl = new URL(`${this.frontendUrl}/auth/callback`);
      redirectUrl.searchParams.set('success', 'false');
      redirectUrl.searchParams.set(
        'error',
        error instanceof Error ? error.message : 'OAuth failed',
      );

      res.redirect(redirectUrl.toString());
    }
  }
}
