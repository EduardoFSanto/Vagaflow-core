import { PrismaClient } from '@prisma/client';
import { Company } from '../../domain/entities/Company';
import { ICompanyRepository } from '../../domain/repositories/ICompanyRepository';

/**
 * Prisma implementation of Company Repository
 */
export class PrismaCompanyRepository implements ICompanyRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Company | null> {
    const data = await this.prisma.company.findUnique({
      where: { id },
    });

    if (!data) return null;

    return this.toDomain(data);
  }

  async findByUserId(userId: string): Promise<Company | null> {
    const data = await this.prisma.company.findUnique({
      where: { userId },
    });

    if (!data) return null;

    return this.toDomain(data);
  }

  async existsByUserId(userId: string): Promise<boolean> {
    const count = await this.prisma.company.count({
      where: { userId },
    });

    return count > 0;
  }

  async save(company: Company): Promise<void> {
    await this.prisma.company.create({
      data: {
        id: company.getId(),
        userId: company.getUserId(),
        companyName: company.getCompanyName(),
        description: company.getDescription(),
        createdAt: company.getCreatedAt(),
        updatedAt: company.getUpdatedAt(),
      },
    });
  }

  async update(company: Company): Promise<void> {
    await this.prisma.company.update({
      where: { id: company.getId() },
      data: {
        companyName: company.getCompanyName(),
        description: company.getDescription(),
        updatedAt: company.getUpdatedAt(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.company.delete({
      where: { id },
    });
  }

  /**
   * Convert Prisma model to Domain Entity
   */
  private toDomain(data: any): Company {
    return new Company({
      id: data.id,
      userId: data.userId,
      companyName: data.companyName,
      description: data.description,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
