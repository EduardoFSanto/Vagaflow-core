import { Candidate } from '../entities/Candidate';

/**
 * Candidate Repository Interface
 *
 * Defines methods for persisting and retrieving Candidate entities.
 */
export interface ICandidateRepository {
  /**
   * Find candidate by ID
   */
  findById(id: string): Promise<Candidate | null>;

  /**
   * Find candidate by user ID
   */
  findByUserId(userId: string): Promise<Candidate | null>;

  /**
   * Check if user already has a candidate profile
   */
  existsByUserId(userId: string): Promise<boolean>;

  /**
   * Save a new candidate
   */
  save(candidate: Candidate): Promise<void>;

  /**
   * Update an existing candidate
   */
  update(candidate: Candidate): Promise<void>;

  /**
   * Delete a candidate
   */
  delete(id: string): Promise<void>;
}
