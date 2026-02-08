import { FastifyInstance } from 'fastify';
import { JobController } from '../controllers/JobController';

export async function jobRoutes(fastify: FastifyInstance) {
  const controller = new JobController();

  fastify.post('/jobs', controller.create.bind(controller));
}
