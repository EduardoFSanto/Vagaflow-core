import { User } from '../entities/User';
import { Email } from '../value-objects/Email';

/**
 * User Repository Interface
 *
 * Defines methods for persisting and retrieving User entities.
 */
export interface IUserRepository {
  /**
   * Find user by ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find user by email
   */
  findByEmail(email: Email): Promise<User | null>;

  /**
   * Check if email already exists
   */
  existsByEmail(email: Email): Promise<boolean>;

  /**
   * Save a new user
   */
  save(user: User): Promise<void>;

  /**
   * Update an existing user
   */
  update(user: User): Promise<void>;

  /**
   * Delete a user
   */
  delete(id: string): Promise<void>;
}
