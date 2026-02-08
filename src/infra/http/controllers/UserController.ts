import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserUseCase } from '../../../application/use-cases/CreateUser';
import { getPrismaClient } from '../../database/prisma/client';
import { PrismaUserRepository } from '../../repositories/PrismaUserRepository';
import { UserRole } from '../../../domain/enums/UserRole';

export class UserController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { email, name, role, password } = request.body as {
      email: string;
      name: string;
      role: UserRole;
      password: string;
    };

    const prisma = getPrismaClient();
    const userRepository = new PrismaUserRepository(prisma);

    const useCase = new CreateUserUseCase(userRepository);

    const user = await useCase.execute({
      email,
      name,
      role,
      password,
    });

    return reply.status(201).send({
      id: user.getId(),
      email: user.getEmail().getValue(),
      name: user.getName(),
      role: user.getRole(),
      createdAt: user.getCreatedAt(),
    });
  }
}
