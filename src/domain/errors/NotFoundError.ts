import { DomainError } from './DomainError';

/**
 * Not Found Error
 *
 * Thrown when a requested resource does not exist.
 *
 * Examples:
 * - User not found by ID
 * - Job not found
 * - Application not found
 */
export class NotFoundError extends DomainError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with identifier '${identifier}' not found`
      : `${resource} not found`;

    super(message);
  }
}
