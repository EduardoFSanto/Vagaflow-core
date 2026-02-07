/**
 * Base Domain Error
 *
 * All domain-specific errors should extend this class.
 * This allows for consistent error handling across the domain layer.
 */
export class DomainError extends Error {
  public readonly name: string;
  public readonly timestamp: Date;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
