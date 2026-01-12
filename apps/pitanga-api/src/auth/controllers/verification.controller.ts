import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { VerificationService } from '../services';
import { JwtAuthGuard } from '../guards';
import { Public, CurrentUser } from '../decorators';
import { VerifyEmailDto } from '@pitanga/auth-types';

@Controller('auth')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  async verifyEmail(
    @Body() dto: VerifyEmailDto,
  ): Promise<{ success: boolean; message: string }> {
    await this.verificationService.verifyEmail(dto.token);

    return {
      success: true,
      message: 'Email verified successfully',
    };
  }

  @Post('resend-verification')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async resendVerification(
    @CurrentUser('id') userId: string,
  ): Promise<{ success: boolean; message: string }> {
    await this.verificationService.sendVerificationEmail(userId);

    return {
      success: true,
      message: 'Verification email sent',
    };
  }
}
