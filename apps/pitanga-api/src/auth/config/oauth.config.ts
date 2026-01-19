/**
 * OAuth configuration helper for conditional provider registration
 * @author Luiz Gama
 */

import { ConfigService } from '@nestjs/config';

export interface OAuthProviderConfig {
  google: boolean;
  facebook: boolean;
}

/**
 * Check which OAuth providers have valid credentials configured
 */
export function getEnabledOAuthProviders(
  configService: ConfigService,
): OAuthProviderConfig {
  return {
    google: !!(
      configService.get<string>('GOOGLE_CLIENT_ID') &&
      configService.get<string>('GOOGLE_CLIENT_SECRET')
    ),
    facebook: !!(
      configService.get<string>('FACEBOOK_APP_ID') &&
      configService.get<string>('FACEBOOK_APP_SECRET')
    ),
  };
}

/**
 * Token to inject OAuth providers configuration
 */
export const OAUTH_PROVIDERS_CONFIG = 'OAUTH_PROVIDERS_CONFIG';
