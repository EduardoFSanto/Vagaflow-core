import { PrismaClient } from '@prisma/client';
import { Candidate } from '../../domain/entities/Candidate';
import { ICandidateRepository } from '../../domain/repositories/ICandidateRepository';

/**
 * Prisma implementation of Candidate Repository
 */
export class PrismaCandidateRepository implements ICandidateRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Candidate | null> {
    const data = await this.prisma.candidate.findUnique({
      where: { id },
    });

    if (!data) return null;

    return this.toDomain(data);
  }

  async findByUserId(userId: string): Promise<Candidate | null> {
    const data = await this.prisma.candidate.findUnique({
      where: { userId },
    });

    if (!data) return null;

    return this.toDomain(data);
  }

  async existsByUserId(userId: string): Promise<boolean> {
    const count = await this.prisma.candidate.count({
      where: { userId },
    });

    return count > 0;
  }

  async save(candidate: Candidate): Promise<void> {
    await this.prisma.candidate.create({
      data: {
        id: candidate.getId(),
        userId: candidate.getUserId(),
        resume: candidate.getResume(),
        createdAt: candidate.getCreatedAt(),
        updatedAt: candidate.getUpdatedAt(),
      },
    });
  }

  async update(candidate: Candidate): Promise<void> {
    await this.prisma.candidate.update({
      where: { id: candidate.getId() },
      data: {
        resume: candidate.getResume(),
        updatedAt: candidate.getUpdatedAt(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.candidate.delete({
      where: { id },
    });
  }

  /**
   * Convert Prisma model to Domain Entity
   */
  private toDomain(data: any): Candidate {
    return new Candidate({
      id: data.id,
      userId: data.userId,
      resume: data.resume,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
