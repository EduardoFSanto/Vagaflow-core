import { DomainError } from './DomainError';

/**
 * Unauthorized Error
 *
 * Thrown when a user attempts an action they don't have permission for.
 *
 * Examples:
 * - CANDIDATE trying to accept/reject an application
 * - User trying to modify another user's data
 * - CANDIDATE trying to create a job
 */
export class UnauthorizedError extends DomainError {
  constructor(
    message: string = 'You are not authorized to perform this action'
  ) {
    super(message);
  }
}
