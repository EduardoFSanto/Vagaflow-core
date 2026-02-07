import { Application } from '../../domain/entities/Application';
import { IApplicationRepository } from '../../domain/repositories/IApplicationRepository';
import { IJobRepository } from '../../domain/repositories/IJobRepository';
import { NotFoundError } from '../../domain/errors/NotFoundError';
import { UnauthorizedError } from '../../domain/errors/UnauthorizedError';

/**
 * Reject Application Use Case
 *
 * Business Rules:
 * - Only COMPANY can reject applications
 * - Company can only reject applications for their own jobs
 * - Application must be PENDING
 */
export class RejectApplicationUseCase {
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
        'You can only reject applications for your own jobs'
      );
    }

    // 4. Reject application (entity validates transition)
    application.reject();

    // 5. Persist changes
    await this.applicationRepository.update(application);

    // 6. Return updated application
    return application;
  }
}
