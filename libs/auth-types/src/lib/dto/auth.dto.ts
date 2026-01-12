export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface LoginDto {
  email: string;
  password: string;
  totpCode?: string; // For 2FA login
}

export interface LogoutDto {
  refreshToken?: string;
  allDevices?: boolean;
}
