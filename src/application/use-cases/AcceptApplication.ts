import { Application } from '../../domain/entities/Application';
import { IApplicationRepository } from '../../domain/repositories/IApplicationRepository';
import { IJobRepository } from '../../domain/repositories/IJobRepository';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { UnauthorizedError } from '../../domain/errors/UnauthorizedError';

/**
 * Accept Application Use Case
 *
 * Business Rules:
 * - Only COMPANY can accept applications
 * - Company can only accept applications for their own jobs
 * - Application must be PENDING
 */
export class AcceptApplicationUseCase {
  constructor(
    private applicationRepository: IApplicationRepository,
    private jobRepository: IJobRepository
  ) {}

  async execute(
    applicationId: string,
    companyId: string
  ): Promise<Application> {
    // 1. Find application
    const application =
      await this.applicationRepository.findById(applicationId);
    if (!application) {
      throw new NotFoundError('Application', applicationId);
    }

    // 2. Find job
    const job = await this.jobRepository.findById(application.getJobId());
    if (!job) {
      throw new NotFoundError('Job', application.getJobId());
    }

    // 3. Verify company owns the job
    if (!job.belongsToCompany(companyId)) {
      throw new UnauthorizedError(
        'You can only accept applications for your own jobs'
      );
    }

    // 4. Accept application (entity validates transition)
    application.accept();

    // 5. Persist changes
    await this.applicationRepository.update(application);

    // 6. Return updated application
    return application;
  }
}
