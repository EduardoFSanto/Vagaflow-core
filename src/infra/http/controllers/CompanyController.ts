import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateCompanyUseCase } from '../../../application/use-cases/CreateCompany';
import { prisma } from '../../database/prisma/client';
import { PrismaCompanyRepository } from '../../repositories/PrismaCompanyRepository';
import { PrismaUserRepository } from '../../repositories/PrismaUserRepository';
import { JWTPayload } from '../middlewares/authMiddleware';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';

export class CompanyController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    // Get authenticated user from JWT
    const user = request.user as JWTPayload;

    // Only COMPANY role can create company profile
    if (user.role !== 'COMPANY') {
      throw new UnauthorizedError('Only companies can create company profile');
    }

    // Get required data from body
    const { companyName, description } = request.body as {
      companyName: string;
      description?: string;
    };

    const companyRepository = new PrismaCompanyRepository(prisma);
    const userRepository = new PrismaUserRepository(prisma);

    const useCase = new CreateCompanyUseCase(companyRepository, userRepository);

    // Use userId from JWT token (secure!)
    const company = await useCase.execute(
      user.userId,
      companyName,
      description
    );

    return reply.status(201).send({
      id: company.getId(),
      userId: company.getUserId(),
      companyName: company.getCompanyName(),
      description: company.getDescription(),
      createdAt: company.getCreatedAt(),
    });
  }
}
