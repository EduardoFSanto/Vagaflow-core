import { IJobRepository } from '../../domain/repositories/IJobRepository';
import { Job } from '../../domain/entities/Job';
import {
  PaginatedResponse,
  PaginationParams,
  calculatePagination,
} from '../../shared/types/Pagination';

/**
 * List Jobs Use Case
 *
 * Returns paginated list of open jobs
 */
export class ListJobsUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(params: PaginationParams): Promise<PaginatedResponse<Job>> {
    const { page, limit } = params;

    // Get paginated jobs from repository
    const { items, total } = await this.jobRepository.findAllOpenPaginated({
      page,
      limit,
    });

    // Calculate pagination metadata
    const pagination = calculatePagination(page, limit, total);

    return {
      data: items,
      pagination,
    };
  }
}
