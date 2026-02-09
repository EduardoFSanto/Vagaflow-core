import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';

export async function userRoutes(fastify: FastifyInstance) {
  const controller = new UserController();

  // Protected route - only authenticated users can create other users
  fastify.post(
    '/users',
    {
      preHandler: [authMiddleware],
    },
    controller.create.bind(controller)
  );
}
