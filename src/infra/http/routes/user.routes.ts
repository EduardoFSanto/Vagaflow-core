import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/UserController';

export async function userRoutes(fastify: FastifyInstance) {
  const controller = new UserController();

  fastify.post('/users', controller.create.bind(controller));
}
