import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateJobUseCase } from '../../../application/use-cases/CreateJob';
import { prisma } from '../../database/prisma/client';
import { PrismaJobRepository } from '../../repositories/PrismaJobRepository';
import { PrismaCompanyRepository } from '../../repositories/PrismaCompanyRepository';
import { JWTPayload } from '../middlewares/authMiddleware';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';
import { NotFoundError } from '../../../domain/errors/NotFoundError';

export class JobController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    // Get authenticated user from JWT
    const user = request.user as JWTPayload;

    // Only COMPANY role can create jobs
    if (user.role !== 'COMPANY') {
      throw new UnauthorizedError('Only companies can create jobs');
    }

    // Get job data from body
    const { title, description } = request.body as {
      title: string;
      description: string;
    };

    const jobRepository = new PrismaJobRepository(prisma);
    const companyRepository = new PrismaCompanyRepository(prisma);

    // Find company by userId from JWT
    const company = await companyRepository.findByUserId(user.userId);
    if (!company) {
      throw new NotFoundError(
        'Company profile not found. Create a company profile first.'
      );
    }

    const useCase = new CreateJobUseCase(jobRepository, companyRepository);

    // Use companyId from the authenticated user's company
    const job = await useCase.execute(company.getId(), title, description);

    return reply.status(201).send({
      id: job.getId(),
      companyId: job.getCompanyId(),
      title: job.getTitle().getValue(),
      description: job.getDescription(),
      status: job.getStatus(),
      createdAt: job.getCreatedAt(),
    });
  }
}
