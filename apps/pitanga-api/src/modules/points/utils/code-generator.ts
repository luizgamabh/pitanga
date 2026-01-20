/**
 * Utility for generating unique point activation codes.
 *
 * @author Luiz Gama
 */

const CODE_PREFIX = 'PTG';
const CODE_LENGTH = 6;
const CHARACTERS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing chars: 0, O, 1, I

/**
 * Generate a random activation code in format PTG-XXXXXX
 */
export function generateActivationCode(): string {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
  }
  return `${CODE_PREFIX}-${code}`;
}

/**
 * Validate activation code format
 */
export function isValidActivationCode(code: string): boolean {
  return /^PTG-[A-Z0-9]{6}$/.test(code);
}
