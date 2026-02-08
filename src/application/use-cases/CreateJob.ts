import { Job } from '../../domain/entities/Job';
import { IJobRepository } from '../../domain/repositories/IJobRepository';
import { ICompanyRepository } from '../../domain/repositories/ICompanyRepository';
import { JobTitle } from '../../domain/value-objects/JobTitle';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { ValidationError } from '../../domain/errors/ValidationError';
import { randomUUID } from 'crypto';

/**
 * Create Job Use Case
 *
 * Business Rules:
 * - Company must exist
 * - Title and description are required
 */
export class CreateJobUseCase {
  constructor(
    private jobRepository: IJobRepository,
    private companyRepository: ICompanyRepository
  ) {}

  async execute(
    companyId: string,
    title: string,
    description: string
  ): Promise<Job> {
    // 1. Validate input
    this.validateInput(companyId, title, description);

    // 2. Check if company exists
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw new NotFoundError('Company', companyId);
    }

    // 3. Create JobTitle value object (validates title)
    const jobTitle = new JobTitle(title);

    // 4. Create job entity
    const job = new Job({
      id: randomUUID(),
      companyId,
      title: jobTitle,
      description,
    });

    // 5. Persist job
    await this.jobRepository.save(job);

    // 6. Return created job
    return job;
  }

  private validateInput(
    companyId: string,
    title: string,
    description: string
  ): void {
    if (!companyId || companyId.trim().length === 0) {
      throw new ValidationError('Company ID is required');
    }

    if (!title || title.trim().length === 0) {
      throw new ValidationError('Job title is required');
    }

    if (!description || description.trim().length === 0) {
      throw new ValidationError('Job description is required');
    }
  }
}
