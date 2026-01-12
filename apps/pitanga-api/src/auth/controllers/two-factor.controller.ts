import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService, TwoFactorService, PasswordService } from '../services';
import { JwtAuthGuard } from '../guards';
import { Public, CurrentUser } from '../decorators';
import {
  Enable2FADto,
  Verify2FADto,
  Disable2FADto,
  ITwoFactorSetup,
  IAuthResponse,
  AUTH_CONSTANTS,
} from '@pitanga/auth-types';

@Controller('auth/2fa')
export class TwoFactorController {
  constructor(
    private readonly authService: AuthService,
    private readonly twoFactorService: TwoFactorService,
    private readonly passwordService: PasswordService,
  ) {}

  @Post('generate')
  @UseGuards(JwtAuthGuard)
  async generateSetup(
    @CurrentUser('id') userId: string,
  ): Promise<ITwoFactorSetup> {
    return this.twoFactorService.generateSetup(userId);
  }

  @Post('enable')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async enable(
    @CurrentUser('id') userId: string,
    @Body() dto: Enable2FADto,
  ): Promise<{ success: boolean; message: string }> {
    await this.twoFactorService.enable(userId, dto.secret, dto.totpCode);

    return {
      success: true,
      message: '2FA enabled successfully',
    };
  }

  @Public()
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verify(
    @Body() dto: Verify2FADto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IAuthResponse> {
    const deviceInfo = {
      userAgent: req.headers['user-agent'],
      ipAddress:
        (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
        req.socket.remoteAddress,
    };

    const result = await this.authService.verifyTwoFactorLogin(
      dto.twoFactorToken,
      dto.totpCode,
      deviceInfo,
    );

    // Set cookies
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie(AUTH_CONSTANTS.COOKIE_ACCESS_TOKEN, result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY_MS,
    });

    res.cookie(AUTH_CONSTANTS.COOKIE_REFRESH_TOKEN, result.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY_MS,
      path: '/api/auth',
    });

    return result;
  }

  @Post('disable')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async disable(
    @CurrentUser('id') userId: string,
    @Body() dto: Disable2FADto,
  ): Promise<{ success: boolean; message: string }> {
    await this.twoFactorService.disable(
      userId,
      dto.totpCode,
      dto.password,
      this.passwordService,
    );

    return {
      success: true,
      message: '2FA disabled successfully',
    };
  }

  @Post('status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async status(
    @CurrentUser('id') userId: string,
  ): Promise<{ enabled: boolean }> {
    const enabled = await this.twoFactorService.isEnabled(userId);

    return { enabled };
  }
}
