import Fastify from 'fastify';
import cors from '@fastify/cors';
import { routes } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { disconnectPrisma } from '../database/prisma/client';

/**
 * Create and configure Fastify server
 */
async function buildServer() {
  const fastify = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'development' ? 'info' : 'error',
    },
  });

  // Register CORS
  await fastify.register(cors, {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
  });

  // Register routes
  await fastify.register(routes);

  // Register error handler
  fastify.setErrorHandler(errorHandler);

  return fastify;
}

/**
 * Start server
 */
async function start() {
  try {
    const fastify = await buildServer();

    const port = Number(process.env.PORT) || 3333;
    const host = '0.0.0.0';

    await fastify.listen({ port, host });

    console.log(`🚀 Server running at http://localhost:${port}`);
    console.log(`📚 Health check: http://localhost:${port}/health`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 */
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await disconnectPrisma();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await disconnectPrisma();
  process.exit(0);
});

// Start server
start();
