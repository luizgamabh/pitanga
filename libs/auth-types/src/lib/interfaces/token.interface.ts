import { Role } from '../enums/role.enum';

export interface ITokenPayload {
  sub: string; // User ID
  email: string;
  role: Role;
  type: 'access';
  iat?: number; // Added by JWT
  exp?: number; // Added by JWT
}

export interface IRefreshTokenPayload {
  sub: string; // User ID
  token: string; // Raw token value for hashing
  type: 'refresh';
  iat?: number; // Added by JWT
  exp?: number; // Added by JWT
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
}
