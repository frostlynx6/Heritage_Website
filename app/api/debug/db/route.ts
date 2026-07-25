export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const verbose = url.searchParams.get('debug') === '1';
  const hasEnv = Boolean(process.env.DATABASE_URL);
  const isDev = process.env.NODE_ENV !== 'production';
  let canConnect = false;
  let hasUserTable = false;
  let error: unknown = null;

  try {
    // Simple connectivity test (SELECT 1 works for MySQL)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _ = await prisma.$queryRawUnsafe('SELECT 1');
    canConnect = true;
  } catch (e) {
    error = e;
  }

  if (canConnect) {
    try {
      await prisma.user.count();
      hasUserTable = true;
    } catch (e) {
      error = e;
    }
  }

  const body: Record<string, unknown> = {
    ok: hasEnv && canConnect && hasUserTable,
    hasEnv,
    canConnect,
    hasUserTable,
  };

  if (isDev || verbose) {
    body.detail = String((error as any)?.message ?? error ?? '');
    if (hasEnv) {
      try {
        const parsed = new URL(process.env.DATABASE_URL as string);
        body.databaseHost = parsed.hostname;
        body.databasePort = parsed.port;
        body.databaseUrlSampled = (process.env.DATABASE_URL as string).slice(0, 25) + '...';
      } catch {}
    }
    body.node = process.version;
    body.adapter = 'mariadb';
  }

  return NextResponse.json(body, { status: body.ok ? 200 : 500 });
}
