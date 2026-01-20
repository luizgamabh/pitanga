import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../services';
import { JwtAuthGuard } from '../guards';
import { CurrentUser, Public } from '../decorators';
import {
  AUTH_CONSTANTS,
  IAuthResponse,
  IAuthUser,
  ILoginResponse,
  ITokenPair,
  IUserProfile,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  Role,
} from '@pitanga/auth-types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IAuthResponse> {
    const deviceInfo = this.extractDeviceInfo(req);
    const result = await this.authService.register(dto, deviceInfo);

    this.setTokenCookies(res, result);

    return result;
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ILoginResponse> {
    const deviceInfo = this.extractDeviceInfo(req);
    const result = await this.authService.login(dto, deviceInfo);

    if (!result.requiresTwoFactor && result.accessToken) {
      this.setTokenCookies(res, result as IAuthResponse);
    }

    return result;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Body() dto: RefreshTokenDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ITokenPair> {
    const refreshToken =
      dto.refreshToken || req.cookies?.[AUTH_CONSTANTS.COOKIE_REFRESH_TOKEN];

    const deviceInfo = this.extractDeviceInfo(req);
    const result = await this.authService.refreshTokens(
      refreshToken,
      deviceInfo,
    );

    this.setTokenCookies(res, {
      expiresIn: 0,
      tokenType: 'Bearer',
      ...result,
      user: {
        id: '',
        email: '',
        name: null,
        role: Role.USER,
        emailVerified: false,
        twoFactorEnabled: false,
      },
    });

    return result;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: boolean }> {
    const refreshToken = req.cookies?.[AUTH_CONSTANTS.COOKIE_REFRESH_TOKEN];

    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }

    this.clearTokenCookies(res);

    return { success: true };
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logoutAll(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ success: boolean }> {
    await this.authService.logoutAll(userId);

    this.clearTokenCookies(res);

    return { success: true };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser('id') userId: string): Promise<IUserProfile> {
    return this.authService.getProfile(userId);
  }

  @Get('session')
  @UseGuards(JwtAuthGuard)
  async getSession(@CurrentUser() user: IAuthUser): Promise<IAuthUser> {
    return user;
  }

  private extractDeviceInfo(req: Request): {
    userAgent?: string;
    ipAddress?: string;
  } {
    return {
      userAgent: req.headers['user-agent'],
      ipAddress:
        (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
        req.socket.remoteAddress,
    };
  }

  private setTokenCookies(res: Response, tokens: IAuthResponse): void {
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie(AUTH_CONSTANTS.COOKIE_ACCESS_TOKEN, tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: AUTH_CONSTANTS.ACCESS_TOKEN_EXPIRY_MS,
    });

    res.cookie(AUTH_CONSTANTS.COOKIE_REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: AUTH_CONSTANTS.REFRESH_TOKEN_EXPIRY_MS,
      path: '/api/auth',
    });
  }

  private clearTokenCookies(res: Response): void {
    res.clearCookie(AUTH_CONSTANTS.COOKIE_ACCESS_TOKEN);
    res.clearCookie(AUTH_CONSTANTS.COOKIE_REFRESH_TOKEN, { path: '/api/auth' });
  }
}
