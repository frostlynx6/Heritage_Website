import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new Proxy({} as PrismaClient, {
  get: (_target, prop) => {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient();
    }

    const value = globalForPrisma.prisma[prop as keyof PrismaClient];

    if (typeof value === 'function') {
      return value.bind(globalForPrisma.prisma);
    }

    return value;
  },
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma as PrismaClient;
}