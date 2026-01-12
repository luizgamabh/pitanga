import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AUTH_CONSTANTS, PASSWORD_REGEX } from '@pitanga/auth-types';

@Injectable()
export class PasswordService {
  private readonly saltRounds = 12;

  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  validate(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < AUTH_CONSTANTS.PASSWORD_MIN_LENGTH) {
      errors.push(
        `Password must be at least ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters`,
      );
    }

    if (password.length > AUTH_CONSTANTS.PASSWORD_MAX_LENGTH) {
      errors.push(
        `Password must be at most ${AUTH_CONSTANTS.PASSWORD_MAX_LENGTH} characters`,
      );
    }

    if (!PASSWORD_REGEX.test(password)) {
      errors.push(
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
