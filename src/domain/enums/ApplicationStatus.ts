/**
 * Application Status Enum
 *
 * Defines the lifecycle states of a job application.
 *
 * Business Rules:
 * - All applications start as PENDING
 * - Only COMPANY role can change status
 * - Valid transitions:
 *   - PENDING → ACCEPTED
 *   - PENDING → REJECTED
 * - Once ACCEPTED or REJECTED, status is final (immutable)
 */
export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

/**
 * Type guard to check if a string is a valid ApplicationStatus
 *
 * @param value - String to validate
 * @returns true if value is a valid ApplicationStatus
 *
 * @example
 * isValidApplicationStatus('PENDING')   // true
 * isValidApplicationStatus('APPROVED') // false
 */
export function isValidApplicationStatus(
  value: string
): value is ApplicationStatus {
  return Object.values(ApplicationStatus).includes(value as ApplicationStatus);
}

/**
 * Check if status transition is allowed
 *
 * @param from - Current status
 * @param to - Target status
 * @returns true if transition is valid
 *
 * @example
 * canTransitionStatus(ApplicationStatus.PENDING, ApplicationStatus.ACCEPTED) // true
 * canTransitionStatus(ApplicationStatus.ACCEPTED, ApplicationStatus.PENDING) // false
 */
export function canTransitionStatus(
  from: ApplicationStatus,
  to: ApplicationStatus
): boolean {
  // Cannot change final states
  if (
    from === ApplicationStatus.ACCEPTED ||
    from === ApplicationStatus.REJECTED
  ) {
    return false;
  }

  // PENDING can go to ACCEPTED or REJECTED
  if (from === ApplicationStatus.PENDING) {
    return (
      to === ApplicationStatus.ACCEPTED || to === ApplicationStatus.REJECTED
    );
  }

  return false;
}
