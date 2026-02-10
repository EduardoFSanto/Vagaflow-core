import { Job } from '../entities/Job';
import { JobStatus } from '../enums/JobStatus';

/**
 * Pagination options for repository queries
 */
export interface PaginationOptions {
  page: number;
  limit: number;
}

/**
 * Paginated result from repository
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
}

/**
 * Job Repository Interface
 *
 * Defines methods for persisting and retrieving Job entities.
 */
export interface IJobRepository {
  /**
   * Find job by ID
   */
  findById(id: string): Promise<Job | null>;

  /**
   * Find all jobs by company ID
   */
  findByCompanyId(companyId: string): Promise<Job[]>;

  /**
   * Find all jobs by status
   */
  findByStatus(status: JobStatus): Promise<Job[]>;

  /**
   * Find all open jobs
   */
  findAllOpen(): Promise<Job[]>;

  /**
   * Find all open jobs with pagination
   */
  findAllOpenPaginated(
    options: PaginationOptions
  ): Promise<PaginatedResult<Job>>;

  /**
   * Count total open jobs
   */
  countOpen(): Promise<number>;

  /**
   * Save a new job
   */
  save(job: Job): Promise<void>;

  /**
   * Update an existing job
   */
  update(job: Job): Promise<void>;

  /**
   * Delete a job
   */
  delete(id: string): Promise<void>;
}
