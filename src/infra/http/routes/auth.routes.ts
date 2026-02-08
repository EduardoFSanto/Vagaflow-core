import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/AuthController';

/**
 * Auth routes
 */
export async function authRoutes(fastify: FastifyInstance) {
  // POST /auth/register - Register new user
  fastify.post('/register', AuthController.register);

  // POST /auth/login - Authenticate user
  fastify.post('/login', AuthController.login);
}
