import { HttpClient } from '../http-client';
import type {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
  VerifyEmailDto,
  Enable2FADto,
  Verify2FADto,
  Disable2FADto,
  IAuthResponse,
  ILoginResponse,
  ITokenPair,
  IUserProfile,
  IAuthUser,
  ITwoFactorSetup,
} from '@pitanga/auth-types';

export class AuthApi {
  constructor(private readonly http: HttpClient) {}

  // ==========================================
  // Core Auth
  // ==========================================

  async register(dto: RegisterDto): Promise<IAuthResponse> {
    return this.http.post<IAuthResponse>('/auth/register', dto);
  }

  async login(dto: LoginDto): Promise<ILoginResponse> {
    return this.http.post<ILoginResponse>('/auth/login', dto);
  }

  async logout(): Promise<{ success: boolean }> {
    return this.http.post<{ success: boolean }>('/auth/logout');
  }

  async logoutAll(): Promise<{ success: boolean }> {
    return this.http.post<{ success: boolean }>('/auth/logout-all');
  }

  async refreshTokens(refreshToken?: string): Promise<ITokenPair> {
    return this.http.post<ITokenPair>('/auth/refresh', { refreshToken });
  }

  async getProfile(): Promise<IUserProfile> {
    return this.http.get<IUserProfile>('/auth/me');
  }

  async getSession(): Promise<IAuthUser> {
    return this.http.get<IAuthUser>('/auth/session');
  }

  // ==========================================
  // Email Verification
  // ==========================================

  async verifyEmail(dto: VerifyEmailDto): Promise<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      '/auth/verify-email',
      dto,
    );
  }

  async resendVerificationEmail(): Promise<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      '/auth/resend-verification',
    );
  }

  // ==========================================
  // Password
  // ==========================================

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      '/auth/forgot-password',
      dto,
    );
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      '/auth/reset-password',
      dto,
    );
  }

  async changePassword(dto: ChangePasswordDto): Promise<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      '/auth/change-password',
      dto,
    );
  }

  async setPassword(password: string): Promise<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      '/auth/set-password',
      { password },
    );
  }

  // ==========================================
  // Two-Factor Authentication
  // ==========================================

  async generate2FASetup(): Promise<ITwoFactorSetup> {
    return this.http.post<ITwoFactorSetup>('/auth/2fa/generate');
  }

  async enable2FA(dto: Enable2FADto): Promise<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      '/auth/2fa/enable',
      dto,
    );
  }

  async verify2FA(dto: Verify2FADto): Promise<IAuthResponse> {
    return this.http.post<IAuthResponse>('/auth/2fa/verify', dto);
  }

  async disable2FA(dto: Disable2FADto): Promise<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      '/auth/2fa/disable',
      dto,
    );
  }

  async get2FAStatus(): Promise<{ enabled: boolean }> {
    return this.http.post<{ enabled: boolean }>('/auth/2fa/status');
  }

  // ==========================================
  // OAuth
  // ==========================================

  getGoogleAuthUrl(): string {
    return `${(this.http as unknown as { baseUrl: string }).baseUrl}/auth/google`;
  }

  getFacebookAuthUrl(): string {
    return `${(this.http as unknown as { baseUrl: string }).baseUrl}/auth/facebook`;
  }
}
