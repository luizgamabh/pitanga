export interface Enable2FADto {
  totpCode: string;
  secret: string;
}

export interface Verify2FADto {
  totpCode: string;
  twoFactorToken: string; // Temporary token from login
}

export interface Disable2FADto {
  totpCode: string;
  password: string;
}

export interface VerifyBackupCodeDto {
  backupCode: string;
  twoFactorToken: string;
}
