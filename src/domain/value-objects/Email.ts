/**
 * Email Value Object
 *
 * Represents a valid email address with built-in validation.
 *
 * Business Rules:
 * - Must be a valid email format
 * - Cannot be empty
 * - Case-insensitive (stored in lowercase)
 * - Immutable once created
 */
export class Email {
  private readonly value: string;

  constructor(email: string) {
    this.validate(email);
    this.value = email.toLowerCase().trim();
  }

  /**
   * Validate email format
   * @throws Error if email is invalid
   */
  private validate(email: string): void {
    if (!email || email.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }

    // Simple email regex (basic validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  /**
   * Get email value
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * Compare with another Email
   */
  public equals(other: Email): boolean {
    return this.value === other.value;
  }

  /**
   * String representation
   */
  public toString(): string {
    return this.value;
  }
}
