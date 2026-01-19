import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from '../database';

// Config
import {
  getEnabledOAuthProviders,
  OAUTH_PROVIDERS_CONFIG,
  OAuthProviderConfig,
} from './config';

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

const logger = new Logger('AuthModule');

/**
 * Factory to create conditional OAuth strategy providers
 */
function createOAuthStrategyProviders() {
  return [
    // Google Strategy - only register if credentials are configured
    {
      provide: GoogleStrategy,
      useFactory: (configService: ConfigService) => {
        const providers = getEnabledOAuthProviders(configService);
        if (providers.google) {
          logger.log('Google OAuth strategy enabled');
          return new GoogleStrategy(configService);
        }
        logger.warn(
          'Google OAuth strategy disabled - missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET',
        );
        return null;
      },
      inject: [ConfigService],
    },
    // Facebook Strategy - only register if credentials are configured
    {
      provide: FacebookStrategy,
      useFactory: (configService: ConfigService) => {
        const providers = getEnabledOAuthProviders(configService);
        if (providers.facebook) {
          logger.log('Facebook OAuth strategy enabled');
          return new FacebookStrategy(configService);
        }
        logger.warn(
          'Facebook OAuth strategy disabled - missing FACEBOOK_APP_ID or FACEBOOK_APP_SECRET',
        );
        return null;
      },
      inject: [ConfigService],
    },
  ];
}

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
    // OAuth providers configuration
    {
      provide: OAUTH_PROVIDERS_CONFIG,
      useFactory: (configService: ConfigService): OAuthProviderConfig =>
        getEnabledOAuthProviders(configService),
      inject: [ConfigService],
    },
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
    ...createOAuthStrategyProviders(),
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
    OAUTH_PROVIDERS_CONFIG,
  ],
})
export class AuthModule {}
