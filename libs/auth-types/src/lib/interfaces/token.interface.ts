import { Role } from '../enums/role.enum';

export interface ITokenPayload {
  sub: string; // User ID
  email: string;
  role: Role;
  iat: number;
  exp: number;
}

export interface IRefreshTokenPayload {
  sub: string; // User ID
  tokenId: string; // Refresh token ID for revocation
  iat: number;
  exp: number;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}
