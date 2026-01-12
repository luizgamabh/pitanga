export interface TokenResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface RefreshTokenDto {
  refreshToken: string;
}
