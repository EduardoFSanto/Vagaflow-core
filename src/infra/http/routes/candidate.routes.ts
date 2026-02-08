import { FastifyInstance } from 'fastify';
import { CandidateController } from '../controllers/CandidateController';
import { authMiddleware } from '../middlewares/authMiddleware';

export async function candidateRoutes(fastify: FastifyInstance) {
  const controller = new CandidateController();

  // Protected route - only authenticated users can create candidate profile
  fastify.post(
    '/candidates',
    {
      preHandler: [authMiddleware],
    },
    controller.create.bind(controller)
  );
}
