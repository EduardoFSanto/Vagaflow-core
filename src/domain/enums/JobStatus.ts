/**
 * Job Status Enum
 *
 * Defines whether a job vacancy is accepting applications.
 *
 * Business Rules:
 * - New jobs start as OPEN
 * - Only COMPANY role can change status
 * - OPEN: Accepting new applications
 * - CLOSED: No longer accepting applications (existing applications remain)
 */
export enum JobStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

/**
 * Type guard to check if a string is a valid JobStatus
 *
 * @param value - String to validate
 * @returns true if value is a valid JobStatus
 *
 * @example
 * isValidJobStatus('OPEN')   // true
 * isValidJobStatus('DRAFT')  // false
 */
export function isValidJobStatus(value: string): value is JobStatus {
  return Object.values(JobStatus).includes(value as JobStatus);
}
