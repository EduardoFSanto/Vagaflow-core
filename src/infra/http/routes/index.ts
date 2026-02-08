import { FastifyInstance } from 'fastify';
import { applicationRoutes } from './application.routes';

/**
 * Register all routes
 */
export async function routes(fastify: FastifyInstance) {
  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // API routes
  await fastify.register(applicationRoutes, { prefix: '/api' });
}
