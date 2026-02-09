import { IJobRepository } from '../../domain/repositories/IJobRepository';
import { Job } from '../../domain/entities/Job';
import { NotFoundError } from '../../domain/errors/NotFoundError';

/**
 * Get Job By ID Use Case
 *
 * Returns a specific job by its ID
 */
export class GetJobByIdUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(jobId: string): Promise<Job> {
    const job = await this.jobRepository.findById(jobId);

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    return job;
  }
}
