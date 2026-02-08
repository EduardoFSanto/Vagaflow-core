import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateApplicationUseCase } from '../../../application/use-cases/CreateApplication';
import { AcceptApplicationUseCase } from '../../../application/use-cases/AcceptApplication';
import { RejectApplicationUseCase } from '../../../application/use-cases/RejectApplication';
import { prisma } from '../../database/prisma/client';
import { PrismaApplicationRepository } from '../../repositories/PrismaApplicationRepository';
import { PrismaCandidateRepository } from '../../repositories/PrismaCandidateRepository';
import { PrismaJobRepository } from '../../repositories/PrismaJobRepository';

/**
 * Application Controller
 *
 * Handles HTTP requests for application-related endpoints
 */
export class ApplicationController {
  /**
   * Create a new application
   * POST /applications
   */
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { candidateId, jobId } = request.body as {
      candidateId: string;
      jobId: string;
    };

    // Initialize repositories
    const applicationRepository = new PrismaApplicationRepository(prisma);
    const candidateRepository = new PrismaCandidateRepository(prisma);
    const jobRepository = new PrismaJobRepository(prisma);

    // Execute use case
    const useCase = new CreateApplicationUseCase(
      applicationRepository,
      candidateRepository,
      jobRepository
    );

    const application = await useCase.execute({
      candidateId,
      jobId,
    });

    return reply.status(201).send({
      id: application.getId(),
      candidateId: application.getCandidateId(),
      jobId: application.getJobId(),
      status: application.getStatus(),
      createdAt: application.getCreatedAt(),
      updatedAt: application.getUpdatedAt(),
    });
  }

  /**
   * Accept an application
   * PATCH /applications/:id/accept
   */
  async accept(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { companyId } = request.body as { companyId: string };

    // Initialize repositories
    const applicationRepository = new PrismaApplicationRepository(prisma);
    const jobRepository = new PrismaJobRepository(prisma);

    // Execute use case
    const useCase = new AcceptApplicationUseCase(
      applicationRepository,
      jobRepository
    );

    const application = await useCase.execute(id, companyId);

    return reply.status(200).send({
      id: application.getId(),
      candidateId: application.getCandidateId(),
      jobId: application.getJobId(),
      status: application.getStatus(),
      createdAt: application.getCreatedAt(),
      updatedAt: application.getUpdatedAt(),
    });
  }

  /**
   * Reject an application
   * PATCH /applications/:id/reject
   */
  async reject(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };
    const { companyId } = request.body as { companyId: string };

    // Initialize repositories
    const applicationRepository = new PrismaApplicationRepository(prisma);
    const jobRepository = new PrismaJobRepository(prisma);

    // Execute use case
    const useCase = new RejectApplicationUseCase(
      applicationRepository,
      jobRepository
    );

    const application = await useCase.execute(id, companyId);

    return reply.status(200).send({
      id: application.getId(),
      candidateId: application.getCandidateId(),
      jobId: application.getJobId(),
      status: application.getStatus(),
      createdAt: application.getCreatedAt(),
      updatedAt: application.getUpdatedAt(),
    });
  }
}