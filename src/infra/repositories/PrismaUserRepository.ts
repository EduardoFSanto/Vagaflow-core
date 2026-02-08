import { PrismaClient } from '@prisma/client';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { UserRole } from '../../domain/enums/UserRole';

/**
 * Prisma implementation of User Repository
 */
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!data) return null;

    return this.toDomain(data);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const data = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });

    if (!data) return null;

    return this.toDomain(data);
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email: email.getValue() },
    });

    return count > 0;
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.getId(),
        email: user.getEmail().getValue(),
        passwordHash: user.getPasswordHash().getValue(),
        name: user.getName(),
        role: user.getRole(),
        createdAt: user.getCreatedAt(),
        updatedAt: user.getUpdatedAt(),
      },
    });
  }

  async update(user: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: user.getId() },
      data: {
        name: user.getName(),
        updatedAt: user.getUpdatedAt(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Convert Prisma model to Domain Entity
   */
  private toDomain(data: any): User {
    return new User({
      id: data.id,
      email: new Email(data.email),
      passwordHash: Password.fromHash(data.passwordHash),
      name: data.name,
      role: data.role as UserRole,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
