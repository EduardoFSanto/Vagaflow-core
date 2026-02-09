import { IJobRepository } from '../../domain/repositories/IJobRepository';
import { Job } from '../../domain/entities/Job';

/**
 * List Jobs Use Case
 *
 * Returns all open jobs
 */
export class ListJobsUseCase {
  constructor(private jobRepository: IJobRepository) {}

  async execute(): Promise<Job[]> {
    // Busca apenas jobs OPEN (vagas abertas)
    return await this.jobRepository.findAllOpen();
  }
}
