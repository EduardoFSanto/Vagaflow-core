import { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes';
import { applicationRoutes } from './application.routes';
import { userRoutes } from './user.routes';
import { candidateRoutes } from './candidate.routes';
import { companyRoutes } from './company.routes';
import { jobRoutes } from './job.routes';

/**
 * Register all routes
 */
export async function routes(fastify: FastifyInstance) {
  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Auth routes (public)
  await fastify.register(authRoutes, { prefix: '/api/auth' });

  // API routes
  await fastify.register(userRoutes, { prefix: '/api' });
  await fastify.register(candidateRoutes, { prefix: '/api' });
  await fastify.register(companyRoutes, { prefix: '/api' });
  await fastify.register(jobRoutes, { prefix: '/api' });
  await fastify.register(applicationRoutes, { prefix: '/api' });
}
