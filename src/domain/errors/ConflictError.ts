import { DomainError } from './DomainError';

/**
 * Conflict Error
 *
 * Thrown when an operation conflicts with existing data.
 *
 * Examples:
 * - Duplicate email registration
 * - Applying twice to the same job
 * - Duplicate resource creation
 */
export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
