import { PrismaClient } from '@prisma/client';
import { Application } from '../../domain/entities/Application';
import { IApplicationRepository } from '../../domain/repositories/IApplicationRepository';
import { ApplicationStatus } from '../../domain/enums/ApplicationStatus';

/**
 * Prisma implementation of Application Repository
 */
export class PrismaApplicationRepository implements IApplicationRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Application | null> {
    const data = await this.prisma.application.findUnique({
      where: { id },
    });

    if (!data) return null;

    return this.toDomain(data);
  }

  async findByCandidateId(candidateId: string): Promise<Application[]> {
    const applications = await this.prisma.application.findMany({
      where: { candidateId },
    });

    return applications.map(this.toDomain);
  }

  async findByJobId(jobId: string): Promise<Application[]> {
    const applications = await this.prisma.application.findMany({
      where: { jobId },
    });

    return applications.map(this.toDomain);
  }

  async findByCompanyId(companyId: string): Promise<Application[]> {
    const applications = await this.prisma.application.findMany({
      where: {
        job: {
          companyId,
        },
      },
    });

    return applications.map(this.toDomain);
  }

  async findByStatus(status: ApplicationStatus): Promise<Application[]> {
    const applications = await this.prisma.application.findMany({
      where: { status },
    });

    return applications.map(this.toDomain);
  }

  async existsByCandidateAndJob(
    candidateId: string,
    jobId: string
  ): Promise<boolean> {
    const count = await this.prisma.application.count({
      where: {
        candidateId,
        jobId,
      },
    });

    return count > 0;
  }

  async save(application: Application): Promise<void> {
    await this.prisma.application.create({
      data: {
        id: application.getId(),
        candidateId: application.getCandidateId(),
        jobId: application.getJobId(),
        status: application.getStatus(),
        createdAt: application.getCreatedAt(),
        updatedAt: application.getUpdatedAt(),
      },
    });
  }

  async update(application: Application): Promise<void> {
    await this.prisma.application.update({
      where: { id: application.getId() },
      data: {
        status: application.getStatus(),
        updatedAt: application.getUpdatedAt(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.application.delete({
      where: { id },
    });
  }

  /**
   * Convert Prisma model to Domain Entity
   */
  private toDomain(data: any): Application {
    return new Application({
      id: data.id,
      candidateId: data.candidateId,
      jobId: data.jobId,
      status: data.status as ApplicationStatus,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
