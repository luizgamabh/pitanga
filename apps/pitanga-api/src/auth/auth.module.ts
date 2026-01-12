import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database';

// Services
import {
  AuthService,
  PasswordService,
  TokenService,
  EmailService,
  VerificationService,
  PasswordResetService,
  TwoFactorService,
  OAuthService,
} from './services';

// Strategies
import { JwtStrategy, GoogleStrategy, FacebookStrategy } from './strategies';

// Guards
import {
  JwtAuthGuard,
  RolesGuard,
  EmailVerifiedGuard,
  GoogleOAuthGuard,
  FacebookOAuthGuard,
} from './guards';

// Controllers
import {
  AuthController,
  OAuthController,
  VerificationController,
  PasswordController,
  TwoFactorController,
} from './controllers';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_ACCESS_EXPIRY') || '15m',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AuthController,
    OAuthController,
    VerificationController,
    PasswordController,
    TwoFactorController,
  ],
  providers: [
    // Services
    AuthService,
    PasswordService,
    TokenService,
    EmailService,
    VerificationService,
    PasswordResetService,
    TwoFactorService,
    OAuthService,
    // Strategies
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    // Guards
    JwtAuthGuard,
    RolesGuard,
    EmailVerifiedGuard,
    GoogleOAuthGuard,
    FacebookOAuthGuard,
  ],
  exports: [
    AuthService,
    TokenService,
    PasswordService,
    JwtAuthGuard,
    RolesGuard,
    EmailVerifiedGuard,
  ],
})
export class AuthModule {}
