/**
 * User Role Enum
 *
 * Defines the possible roles a user can have in the system.
 *
 * Business Rules:
 * - A user can only be CANDIDATE or COMPANY
 * - Role is immutable (cannot change after user creation)
 * - CANDIDATE: Can apply to jobs
 * - COMPANY: Can create jobs and manage applications
 */
export enum UserRole {
  CANDIDATE = 'CANDIDATE',
  COMPANY = 'COMPANY',
}

/**
 * Type guard to check if a string is a valid UserRole
 *
 * @param value - String to validate
 * @returns true if value is a valid UserRole
 *
 * @example
 * isValidUserRole('CANDIDATE') // true
 * isValidUserRole('ADMIN')     // false
 */
export function isValidUserRole(value: string): value is UserRole {
  return Object.values(UserRole).includes(value as UserRole);
}
