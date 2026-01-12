export const AUTH_CONSTANTS = {
  // Token expiration
  ACCESS_TOKEN_EXPIRY: '15m',
  ACCESS_TOKEN_EXPIRY_MS: 15 * 60 * 1000, // 15 minutes
  REFRESH_TOKEN_EXPIRY_DAYS: 7,
  REFRESH_TOKEN_EXPIRY_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
  VERIFICATION_TOKEN_EXPIRY_HOURS: 24,
  RESET_TOKEN_EXPIRY_HOURS: 1,

  // Cookie names
  COOKIE_ACCESS_TOKEN: 'pitanga_access_token',
  COOKIE_REFRESH_TOKEN: 'pitanga_refresh_token',

  // Password validation
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,

  // Rate limiting
  MAX_LOGIN_ATTEMPTS: 5,
  LOGIN_LOCKOUT_DURATION_MINUTES: 15,

  // 2FA
  TOTP_WINDOW: 1, // Allow 1 step before/after for time drift
  BACKUP_CODES_COUNT: 10,

  // Session
  MAX_SESSIONS_PER_USER: 5,
} as const;

export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
