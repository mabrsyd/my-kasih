import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient()

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma

/**
 * Connection validation helper
 * Run this on app startup to catch DB issues early
 */
export async function validateDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✓ Database connection successful');
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error);
    throw error;
  }
}

export default prisma;

