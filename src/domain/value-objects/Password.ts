import bcrypt from 'bcryptjs';

/**
 * Password Value Object
 *
 * Encapsulates password hashing logic.
 * Ensures passwords are always stored securely.
 *
 * Business Rules:
 * - Minimum 6 characters
 * - Always hashed with bcrypt (salt rounds: 10)
 * - Plain password never stored
 */
export class Password {
  private readonly hashedValue: string;

  private constructor(hashedValue: string) {
    this.hashedValue = hashedValue;
  }

  /**
   * Create Password from plain text (for registration/password change)
   */
  static async create(plainPassword: string): Promise<Password> {
    this.validate(plainPassword);
    const hashedValue = await bcrypt.hash(plainPassword, 10);
    return new Password(hashedValue);
  }

  /**
   * Recreate Password from hash (for loading from database)
   */
  static fromHash(hashedValue: string): Password {
    if (!hashedValue || hashedValue.trim().length === 0) {
      throw new Error('Password hash cannot be empty');
    }
    return new Password(hashedValue);
  }

  /**
   * Compare plain password with hash
   */
  async compare(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.hashedValue);
  }

  /**
   * Get hashed value (for persistence)
   */
  getValue(): string {
    return this.hashedValue;
  }

  /**
   * Validate plain password rules
   */
  private static validate(plainPassword: string): void {
    if (!plainPassword || plainPassword.trim().length === 0) {
      throw new Error('Password cannot be empty');
    }

    if (plainPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    if (plainPassword.length > 72) {
      // bcrypt limit
      throw new Error('Password cannot exceed 72 characters');
    }
  }
}
