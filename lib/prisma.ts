import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

// Use a simple singleton to avoid recursive proxy traps and stack overflows
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL is not set');
}

const parsed = new URL(dbUrl);
const sslaccept = parsed.searchParams.get('sslaccept');
const ssl = sslaccept
  ? sslaccept.toLowerCase() === 'strict'
    ? { rejectUnauthorized: true }
    : true
  : undefined;

const adapter = new PrismaMariaDb({
  host: parsed.hostname,
  port: parsed.port ? Number(parsed.port) : 3306,
  user: decodeURIComponent(parsed.username),
  password: decodeURIComponent(parsed.password),
  database: parsed.pathname.replace(/^\//, '') || undefined,
  ssl,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}