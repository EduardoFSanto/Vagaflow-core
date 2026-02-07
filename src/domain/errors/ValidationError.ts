import { DomainError } from './DomainError';

/**
 * Validation Error
 *
 * Thrown when domain validation rules are violated.
 *
 * Examples:
 * - Invalid email format
 * - Empty required fields
 * - Value out of range
 */
export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
