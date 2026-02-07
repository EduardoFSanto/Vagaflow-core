import { Company } from '../entities/Company';

/**
 * Company Repository Interface
 *
 * Defines methods for persisting and retrieving Company entities.
 */
export interface ICompanyRepository {
  /**
   * Find company by ID
   */
  findById(id: string): Promise<Company | null>;

  /**
   * Find company by user ID
   */
  findByUserId(userId: string): Promise<Company | null>;

  /**
   * Check if user already has a company profile
   */
  existsByUserId(userId: string): Promise<boolean>;

  /**
   * Save a new company
   */
  save(company: Company): Promise<void>;

  /**
   * Update an existing company
   */
  update(company: Company): Promise<void>;

  /**
   * Delete a company
   */
  delete(id: string): Promise<void>;
}
