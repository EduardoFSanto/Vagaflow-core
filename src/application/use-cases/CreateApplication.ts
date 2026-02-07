import { Application } from '../../domain/entities/Application';
import { IApplicationRepository } from '../../domain/repositories/IApplicationRepository';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';
import { IJobRepository } from '../../domain/repositories/IJobRepository';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { ConflictError } from '../../domain/errors/ConflictError';
import { ValidationError } from '../../domain/errors/ValidationError';
import { CreateApplicationDTO } from '../dtos/CreateApplicationDTO';
import { randomUUID } from 'crypto';

/**
 * Create Application Use Case
 *
 * Business Rules:
 * - Candidate must exist
 * - Job must exist and be OPEN
 * - Candidate cannot apply twice to the same job
 */
export class CreateApplicationUseCase {
  constructor(
    private applicationRepository: IApplicationRepository,
    private candidateRepository: ICandidateRepository,
    private jobRepository: IJobRepository
  ) {}

  async execute(dto: CreateApplicationDTO): Promise<Application> {
    // 1. Validate input
    this.validateInput(dto);

    // 2. Check if candidate exists
    const candidate = await this.candidateRepository.findById(dto.candidateId);
    if (!candidate) {
      throw new NotFoundError('Candidate', dto.candidateId);
    }

    // 3. Check if job exists
    const job = await this.jobRepository.findById(dto.jobId);
    if (!job) {
      throw new NotFoundError('Job', dto.jobId);
    }

    // 4. Check if job is open
    if (!job.isOpen()) {
      throw new ValidationError('Cannot apply to a closed job');
    }

    // 5. Check if candidate already applied to this job
    const alreadyApplied =
      await this.applicationRepository.existsByCandidateAndJob(
        dto.candidateId,
        dto.jobId
      );

    if (alreadyApplied) {
      throw new ConflictError('You have already applied to this job');
    }

    // 6. Create application entity
    const application = new Application({
      id: randomUUID(),
      candidateId: dto.candidateId,
      jobId: dto.jobId,
    });

    // 7. Persist application
    await this.applicationRepository.save(application);

    // 8. Return created application
    return application;
  }

  private validateInput(dto: CreateApplicationDTO): void {
    if (!dto.candidateId || dto.candidateId.trim().length === 0) {
      throw new ValidationError('Candidate ID is required');
    }

    if (!dto.jobId || dto.jobId.trim().length === 0) {
      throw new ValidationError('Job ID is required');
    }
  }
}
