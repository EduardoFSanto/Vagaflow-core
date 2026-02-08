import { FastifyInstance } from 'fastify';
import { ApplicationController } from '../controllers/ApplicationController';

/**
 * Application Routes
 */
export async function applicationRoutes(fastify: FastifyInstance) {
  const controller = new ApplicationController();

  // Create application
  fastify.post('/applications', controller.create.bind(controller));

  // Accept application
  fastify.patch('/applications/:id/accept', controller.accept.bind(controller));

  // Reject application
  fastify.patch('/applications/:id/reject', controller.reject.bind(controller));
}
