import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateJobUseCase } from '../../../application/use-cases/CreateJob';
import { prisma } from '../../database/prisma/client';
import { PrismaJobRepository } from '../../repositories/PrismaJobRepository';
import { PrismaCompanyRepository } from '../../repositories/PrismaCompanyRepository';

export class JobController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { companyId, title, description } = request.body as {
      companyId: string;
      title: string;
      description: string;
    };

    const jobRepository = new PrismaJobRepository(prisma);
    const companyRepository = new PrismaCompanyRepository(prisma);

    const useCase = new CreateJobUseCase(jobRepository, companyRepository);

    const job = await useCase.execute(companyId, title, description);

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
