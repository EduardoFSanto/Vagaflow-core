/**
 * JobTitle Value Object
 *
 * Represents a job vacancy title with validation.
 *
 * Business Rules:
 * - Cannot be empty
 * - Minimum 3 characters
 * - Maximum 100 characters
 * - Trimmed (no leading/trailing spaces)
 * - Immutable once created
 */
export class JobTitle {
  private static readonly MIN_LENGTH = 3;
  private static readonly MAX_LENGTH = 100;

  private readonly value: string;

  constructor(title: string) {
    this.validate(title);
    this.value = title.trim();
  }

  /**
   * Validate job title
   * @throws Error if title is invalid
   */
  private validate(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new Error('Job title cannot be empty');
    }

    const trimmed = title.trim();

    if (trimmed.length < JobTitle.MIN_LENGTH) {
      throw new Error(
        `Job title must be at least ${JobTitle.MIN_LENGTH} characters`
      );
    }

    if (trimmed.length > JobTitle.MAX_LENGTH) {
      throw new Error(
        `Job title cannot exceed ${JobTitle.MAX_LENGTH} characters`
      );
    }
  }

  /**
   * Get title value
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * Compare with another JobTitle
   */
  public equals(other: JobTitle): boolean {
    return this.value === other.value;
  }

  /**
   * String representation
   */
  public toString(): string {
    return this.value;
  }
}
