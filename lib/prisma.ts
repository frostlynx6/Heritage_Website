import { PrismaClient } from '@prisma/client';
import { setDefaultResultOrder } from 'node:dns';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

// Use a simple singleton to avoid recursive proxy traps and stack overflows
// Prefer IPv4 to avoid IPv6-first resolution issues on some serverless hosts
try { setDefaultResultOrder('ipv4first'); } catch {}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  throw new Error('DATABASE_URL is not set');
}

const parsed = new URL(dbUrl);
const sslaccept = parsed.searchParams.get('sslaccept');
let ssl: any = undefined;
if (sslaccept) {
  ssl = sslaccept.toLowerCase() === 'strict' ? { rejectUnauthorized: true } : true;
} else if (/tidbcloud\.com$/i.test(parsed.hostname)) {
  // TiDB Cloud requires TLS; default to strict if not explicitly provided
  ssl = { rejectUnauthorized: true };
}

const adapter = new PrismaMariaDb({
  host: parsed.hostname,
  port: parsed.port ? Number(parsed.port) : 3306,
  user: decodeURIComponent(parsed.username),
  password: decodeURIComponent(parsed.password),
  database: parsed.pathname.replace(/^\//, '') || undefined,
  ssl,
  connectionLimit: 1,
  acquireTimeout: 10000,
  connectTimeout: 10000,
  socketTimeout: 15000,
  keepAliveInitialDelay: 10000,
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}