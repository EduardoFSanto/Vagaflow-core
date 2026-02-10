import { PrismaClient } from '@prisma/client';
import { Job } from '../../domain/entities/Job';
import {
  IJobRepository,
  PaginationOptions,
  PaginatedResult,
} from '../../domain/repositories/IJobRepository';
import { JobStatus } from '../../domain/enums/JobStatus';
import { JobTitle } from '../../domain/value-objects/JobTitle';

/**
 * Prisma implementation of Job Repository
 */
export class PrismaJobRepository implements IJobRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Job | null> {
    const data = await this.prisma.job.findUnique({
      where: { id },
    });

    if (!data) return null;

    return this.toDomain(data);
  }

  async findByCompanyId(companyId: string): Promise<Job[]> {
    const jobs = await this.prisma.job.findMany({
      where: { companyId },
    });

    return jobs.map(this.toDomain);
  }

  async findByStatus(status: JobStatus): Promise<Job[]> {
    const jobs = await this.prisma.job.findMany({
      where: { status },
    });

    return jobs.map(this.toDomain);
  }

  async findAllOpen(): Promise<Job[]> {
    const jobs = await this.prisma.job.findMany({
      where: { status: JobStatus.OPEN },
    });

    return jobs.map(this.toDomain);
  }

  async findAllOpenPaginated(
    options: PaginationOptions
  ): Promise<PaginatedResult<Job>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    // Execute query and count in parallel for better performance
    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where: { status: JobStatus.OPEN },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }, // Most recent first
      }),
      this.prisma.job.count({
        where: { status: JobStatus.OPEN },
      }),
    ]);

    return {
      items: jobs.map(this.toDomain),
      total,
    };
  }

  async countOpen(): Promise<number> {
    return await this.prisma.job.count({
      where: { status: JobStatus.OPEN },
    });
  }

  async save(job: Job): Promise<void> {
    await this.prisma.job.create({
      data: {
        id: job.getId(),
        companyId: job.getCompanyId(),
        title: job.getTitle().getValue(),
        description: job.getDescription(),
        status: job.getStatus(),
        createdAt: job.getCreatedAt(),
        updatedAt: job.getUpdatedAt(),
      },
    });
  }

  async update(job: Job): Promise<void> {
    await this.prisma.job.update({
      where: { id: job.getId() },
      data: {
        title: job.getTitle().getValue(),
        description: job.getDescription(),
        status: job.getStatus(),
        updatedAt: job.getUpdatedAt(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.job.delete({
      where: { id },
    });
  }

  /**
   * Convert Prisma model to Domain Entity
   */
  private toDomain(data: any): Job {
    return new Job({
      id: data.id,
      companyId: data.companyId,
      title: new JobTitle(data.title),
      description: data.description,
      status: data.status as JobStatus,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
