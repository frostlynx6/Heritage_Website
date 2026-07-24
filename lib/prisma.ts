import type { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// By using require() instead of import, we bypass the Next.js Edge compiler
const getPrismaClient = () => {
  const { PrismaClient } = require('@prisma/client');
  return new PrismaClient();
};

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;