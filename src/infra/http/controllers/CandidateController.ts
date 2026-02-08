import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateCandidateUseCase } from '../../../application/use-cases/CreateCandidate';
import { prisma } from '../../database/prisma/client';
import { PrismaCandidateRepository } from '../../repositories/PrismaCandidateRepository';
import { PrismaUserRepository } from '../../repositories/PrismaUserRepository';
import { JWTPayload } from '../middlewares/authMiddleware';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';

export class CandidateController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    // Get authenticated user from JWT
    const user = request.user as JWTPayload;

    // Only CANDIDATE role can create candidate profile
    if (user.role !== 'CANDIDATE') {
      throw new UnauthorizedError(
        'Only candidates can create candidate profile'
      );
    }

    // Get optional resume from body
    const { resume } = (request.body as { resume?: string }) || {};

    const candidateRepository = new PrismaCandidateRepository(prisma);
    const userRepository = new PrismaUserRepository(prisma);

    const useCase = new CreateCandidateUseCase(
      candidateRepository,
      userRepository
    );

    // Use userId from JWT token (secure!)
    const candidate = await useCase.execute(user.userId, resume);

    return reply.status(201).send({
      id: candidate.getId(),
      userId: candidate.getUserId(),
      resume: candidate.getResume(),
      createdAt: candidate.getCreatedAt(),
    });
  }
}
