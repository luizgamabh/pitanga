import { OAuthProvider } from '../enums/oauth-provider.enum';
import { IUserProfile } from './user.interface';

export interface IAuthResponse {
  user: IUserProfile;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface ILoginResponse extends IAuthResponse {
  requiresTwoFactor?: boolean;
  twoFactorToken?: string; // Temporary token for 2FA verification
}

export interface IOAuthProfile {
  provider: OAuthProvider;
  providerUserId: string;
  email: string;
  name: string | null;
  picture?: string;
}

export interface ITwoFactorSetup {
  secret: string;
  qrCode: string; // Data URL for QR code image
  otpauthUrl: string; // otpauth:// URL for manual entry
  backupCodes?: string[];
}

export interface ISession {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: Date;
  lastUsedAt: Date;
  isCurrent: boolean;
}
