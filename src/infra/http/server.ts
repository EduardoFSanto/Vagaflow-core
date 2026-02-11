import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
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

  // Register JWT
  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  });

  // Register Swagger
  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'VagaFlow API',
        description:
          'Professional job application platform API built with DDD and Clean Architecture',
        version: '1.0.0',
      },
      host: 'localhost:3333',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'Auth', description: 'Authentication endpoints' },
        { name: 'Users', description: 'User management' },
        { name: 'Candidates', description: 'Candidate profiles' },
        { name: 'Companies', description: 'Company profiles' },
        { name: 'Jobs', description: 'Job postings' },
        { name: 'Applications', description: 'Job applications' },
      ],
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'Enter your JWT token in the format: Bearer {token}',
        },
      },
    },
  });

  // Register Swagger UI
  await fastify.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });

  // ✅ Register error handler BEFORE routes
  fastify.setErrorHandler(errorHandler);

  // Register routes
  await fastify.register(routes);

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
    console.log(`📖 API Docs: http://localhost:${port}/docs`);
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

start();
