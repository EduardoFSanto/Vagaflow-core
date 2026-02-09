import { FastifyInstance } from 'fastify';
import { JobController } from '../controllers/JobController';
import { authMiddleware } from '../middlewares/authMiddleware';

export async function jobRoutes(fastify: FastifyInstance) {
  const controller = new JobController();

  // Public route - anyone can list open jobs
  fastify.get('/jobs', controller.list.bind(controller));

  // Public route - anyone can view a job
  fastify.get('/jobs/:id', controller.getById.bind(controller));

  // Protected route - only authenticated companies can create jobs
  fastify.post(
    '/jobs',
    {
      preHandler: [authMiddleware],
    },
    controller.create.bind(controller)
  );
}
