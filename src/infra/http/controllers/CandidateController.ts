import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateCandidateUseCase } from '../../../application/use-cases/CreateCandidate';
import { getPrismaClient } from '../../database/prisma/client';
import { PrismaCandidateRepository } from '../../repositories/PrismaCandidateRepository';
import { PrismaUserRepository } from '../../repositories/PrismaUserRepository';

export class CandidateController {
  async create(request: FastifyRequest, reply: FastifyReply) {
    const { userId, resume } = request.body as {
      userId: string;
      resume?: string;
    };

    const prisma = getPrismaClient();
    const candidateRepository = new PrismaCandidateRepository(prisma);
    const userRepository = new PrismaUserRepository(prisma);

    const useCase = new CreateCandidateUseCase(
      candidateRepository,
      userRepository
    );

    const candidate = await useCase.execute(userId, resume);

    return reply.status(201).send({
      id: candidate.getId(),
      userId: candidate.getUserId(),
      resume: candidate.getResume(),
      createdAt: candidate.getCreatedAt(),
    });
  }
}
