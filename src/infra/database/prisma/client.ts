import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 *
 * Ensures only one instance of PrismaClient is created
 */
const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
});

export { prisma };

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}
