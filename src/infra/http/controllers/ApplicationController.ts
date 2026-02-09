import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateApplicationUseCase } from '../../../application/use-cases/CreateApplication';
import { AcceptApplicationUseCase } from '../../../application/use-cases/AcceptApplication';
import { RejectApplicationUseCase } from '../../../application/use-cases/RejectApplication';
import { prisma } from '../../database/prisma/client';
import { PrismaApplicationRepository } from '../../repositories/PrismaApplicationRepository';
import { PrismaCandidateRepository } from '../../repositories/PrismaCandidateRepository';
import { PrismaJobRepository } from '../../repositories/PrismaJobRepository';
import { PrismaCompanyRepository } from '../../repositories/PrismaCompanyRepository';
import { JWTPayload } from '../middlewares/authMiddleware';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';
import { NotFoundError } from '../../../domain/errors/NotFoundError';

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
    // Get authenticated user from JWT
    const user = request.user as JWTPayload;

    // Only CANDIDATE role can apply to jobs
    if (user.role !== 'CANDIDATE') {
      throw new UnauthorizedError('Only candidates can apply to jobs');
    }

    // Get jobId from body
    const { jobId } = request.body as {
      jobId: string;
    };

    // Initialize repositories
    const applicationRepository = new PrismaApplicationRepository(prisma);
    const candidateRepository = new PrismaCandidateRepository(prisma);
    const jobRepository = new PrismaJobRepository(prisma);

    // Find candidate by userId from JWT
    const candidate = await candidateRepository.findByUserId(user.userId);
    if (!candidate) {
      throw new NotFoundError(
        'Candidate profile not found. Create a candidate profile first.'
      );
    }

    // Execute use case
    const useCase = new CreateApplicationUseCase(
      applicationRepository,
      candidateRepository,
      jobRepository
    );

    // Use candidateId from the authenticated user's candidate profile
    const application = await useCase.execute({
      candidateId: candidate.getId(),
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
    // Get authenticated user from JWT
    const user = request.user as JWTPayload;

    // Only COMPANY role can accept applications
    if (user.role !== 'COMPANY') {
      throw new UnauthorizedError('Only companies can accept applications');
    }

    const { id } = request.params as { id: string };

    // Initialize repositories
    const applicationRepository = new PrismaApplicationRepository(prisma);
    const jobRepository = new PrismaJobRepository(prisma);
    const companyRepository = new PrismaCompanyRepository(prisma);

    // Find company by userId from JWT
    const company = await companyRepository.findByUserId(user.userId);
    if (!company) {
      throw new NotFoundError(
        'Company profile not found. Create a company profile first.'
      );
    }

    // Execute use case
    const useCase = new AcceptApplicationUseCase(
      applicationRepository,
      jobRepository
    );

    // Use companyId from the authenticated user's company
    const application = await useCase.execute(id, company.getId());

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
    // Get authenticated user from JWT
    const user = request.user as JWTPayload;

    // Only COMPANY role can reject applications
    if (user.role !== 'COMPANY') {
      throw new UnauthorizedError('Only companies can reject applications');
    }

    const { id } = request.params as { id: string };

    // Initialize repositories
    const applicationRepository = new PrismaApplicationRepository(prisma);
    const jobRepository = new PrismaJobRepository(prisma);
    const companyRepository = new PrismaCompanyRepository(prisma);

    // Find company by userId from JWT
    const company = await companyRepository.findByUserId(user.userId);
    if (!company) {
      throw new NotFoundError(
        'Company profile not found. Create a company profile first.'
      );
    }

    // Execute use case
    const useCase = new RejectApplicationUseCase(
      applicationRepository,
      jobRepository
    );

    // Use companyId from the authenticated user's company
    const application = await useCase.execute(id, company.getId());

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
