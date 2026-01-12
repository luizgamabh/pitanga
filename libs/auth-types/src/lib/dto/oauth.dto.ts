import { OAuthProvider } from '../enums/oauth-provider.enum';

export interface OAuthCallbackDto {
  code: string;
  state?: string;
}

export interface OAuthStateDto {
  provider: OAuthProvider;
  redirectUrl?: string;
}

export interface LinkOAuthDto {
  provider: OAuthProvider;
}

export interface UnlinkOAuthDto {
  provider: OAuthProvider;
}
