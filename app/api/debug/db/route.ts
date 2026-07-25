export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET() {
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

  if (isDev) {
    body.detail = String((error as any)?.message ?? error ?? '');
    body.databaseUrlSampled = hasEnv ? (process.env.DATABASE_URL?.slice(0, 20) + '...') : undefined;
  }

  return NextResponse.json(body, { status: body.ok ? 200 : 500 });
}
