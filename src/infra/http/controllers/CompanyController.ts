import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateCompanyUseCase } from '../../../application/use-cases/CreateCompany';
import { getPrismaClient } from '../../database/prisma/client';
import { PrismaCompanyRepository } from '../../repositories/PrismaCompanyRepository';
import { PrismaUserRepository } from '../../repositories/PrismaUserRepository';

export class CompanyController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { userId, companyName, description } = request.body as {
      userId: string;
      companyName: string;
      description?: string;
    };

    const prisma = getPrismaClient();
    const companyRepository = new PrismaCompanyRepository(prisma);
    const userRepository = new PrismaUserRepository(prisma);

    const useCase = new CreateCompanyUseCase(companyRepository, userRepository);

    const company = await useCase.execute(userId, companyName, description);

    return reply.status(201).send({
      id: company.getId(),
      userId: company.getUserId(),
      companyName: company.getCompanyName(),
      description: company.getDescription(),
      createdAt: company.getCreatedAt(),
    });
  }
}
