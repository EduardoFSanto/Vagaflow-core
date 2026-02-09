import { FastifyInstance } from 'fastify';
import { ApplicationController } from '../controllers/ApplicationController';
import { authMiddleware } from '../middlewares/authMiddleware';

/**
 * Application Routes
 */
export async function applicationRoutes(fastify: FastifyInstance) {
  const controller = new ApplicationController();

  // Protected routes - all require authentication

  // Create application - only CANDIDATE can apply
  fastify.post(
    '/applications',
    {
      preHandler: [authMiddleware],
    },
    controller.create.bind(controller)
  );

  // Accept application - only COMPANY can accept
  fastify.patch(
    '/applications/:id/accept',
    {
      preHandler: [authMiddleware],
    },
    controller.accept.bind(controller)
  );

  // Reject application - only COMPANY can reject
  fastify.patch(
    '/applications/:id/reject',
    {
      preHandler: [authMiddleware],
    },
    controller.reject.bind(controller)
  );
}
