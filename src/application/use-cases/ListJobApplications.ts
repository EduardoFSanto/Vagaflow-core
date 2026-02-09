import { IApplicationRepository } from '../../domain/repositories/IApplicationRepository';
import { IJobRepository } from '../../domain/repositories/IJobRepository';
import { Application } from '../../domain/entities/Application';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { UnauthorizedError } from '../../domain/errors/UnauthorizedError';

/**
 * List Job Applications Use Case
 *
 * Returns all applications for a specific job
 * Only the job owner (company) can see applications
 */
export class ListJobApplicationsUseCase {
  constructor(
    private applicationRepository: IApplicationRepository,
    private jobRepository: IJobRepository
  ) {}

  async execute(jobId: string, companyId: string): Promise<Application[]> {
    // Verifica se a vaga existe
    const job = await this.jobRepository.findById(jobId);

    if (!job) {
      throw new NotFoundError('Job not found');
    }

    // Verifica se a vaga pertence à empresa que está fazendo a requisição
    if (job.getCompanyId() !== companyId) {
      throw new UnauthorizedError(
        'You can only view applications for your own jobs'
      );
    }

    // Retorna as applications da vaga
    return await this.applicationRepository.findByJobId(jobId);
  }
}
