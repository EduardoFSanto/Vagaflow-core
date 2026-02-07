import { Application } from '../entities/Application';
import { ApplicationStatus } from '../enums/ApplicationStatus';

/**
 * Application Repository Interface
 *
 * Defines methods for persisting and retrieving Application entities.
 */
export interface IApplicationRepository {
  /**
   * Find application by ID
   */
  findById(id: string): Promise<Application | null>;

  /**
   * Find all applications by candidate ID
   */
  findByCandidateId(candidateId: string): Promise<Application[]>;

  /**
   * Find all applications for a specific job
   */
  findByJobId(jobId: string): Promise<Application[]>;

  /**
   * Find all applications by company ID (through jobs)
   */
  findByCompanyId(companyId: string): Promise<Application[]>;

  /**
   * Find all applications by status
   */
  findByStatus(status: ApplicationStatus): Promise<Application[]>;

  /**
   * Check if candidate already applied to a job
   *
   * Business Rule: Candidate cannot apply twice to the same job
   */
  existsByCandidateAndJob(candidateId: string, jobId: string): Promise<boolean>;

  /**
   * Save a new application
   */
  save(application: Application): Promise<void>;

  /**
   * Update an existing application
   */
  update(application: Application): Promise<void>;

  /**
   * Delete an application
   */
  delete(id: string): Promise<void>;
}
