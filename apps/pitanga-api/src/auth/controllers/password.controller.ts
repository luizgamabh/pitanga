import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService, PasswordResetService } from '../services';
import { JwtAuthGuard } from '../guards';
import { Public, CurrentUser } from '../decorators';
import {
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from '@pitanga/auth-types';

@Controller('auth')
export class PasswordController {
  constructor(
    private readonly authService: AuthService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  @Public()
  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() dto: ForgotPasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    await this.passwordResetService.requestPasswordReset(dto.email);

    // Always return success to prevent email enumeration
    return {
      success: true,
      message:
        'If an account with that email exists, a password reset link has been sent',
    };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() dto: ResetPasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    await this.passwordResetService.resetPassword(dto.token, dto.password);

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
  ): Promise<{ success: boolean; message: string }> {
    await this.authService.changePassword(
      userId,
      dto.currentPassword,
      dto.newPassword,
    );

    return {
      success: true,
      message: 'Password changed successfully',
    };
  }

  @Post('set-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async setPassword(
    @CurrentUser('id') userId: string,
    @Body() dto: { password: string },
  ): Promise<{ success: boolean; message: string }> {
    await this.authService.setPassword(userId, dto.password);

    return {
      success: true,
      message: 'Password set successfully',
    };
  }
}
