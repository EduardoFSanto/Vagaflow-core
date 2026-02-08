import { FastifyInstance } from 'fastify';
import { JobController } from '../controllers/JobController';
import { authMiddleware } from '../middlewares/authMiddleware';

export async function jobRoutes(fastify: FastifyInstance) {
  const controller = new JobController();

  // Protected route - only authenticated companies can create jobs
  fastify.post(
    '/jobs',
    {
      preHandler: [authMiddleware],
    },
    controller.create.bind(controller)
  );
}
