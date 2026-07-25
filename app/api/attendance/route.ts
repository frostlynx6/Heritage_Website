export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { getToken } from 'next-auth/jwt';

// Helper to get the current user id from the JWT
async function getUserId(req: Request) {
  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
  return token?.sub as string | undefined;
}

// GET /api/attendance -> list of attended tripIds for the current user
export async function GET(req: Request) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const badges = await prisma.userBadge.findMany({
    where: { userId },
    select: { tripId: true, earnedAt: true },
    orderBy: { earnedAt: 'desc' },
  });

  return NextResponse.json({ attended: badges }, { status: 200 });
}

// POST /api/attendance { tripId } -> mark attended
export async function POST(req: Request) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { tripId } = await req.json();
  if (!tripId || typeof tripId !== 'string') {
    return NextResponse.json({ error: 'tripId is required' }, { status: 400 });
  }

  try {
    const badge = await prisma.userBadge.upsert({
      where: { userId_tripId: { userId, tripId } },
      update: {},
      create: { userId, tripId },
    });
    return NextResponse.json({ ok: true, badge }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to mark attended' }, { status: 500 });
  }
}

// DELETE /api/attendance { tripId } -> unmark attended
export async function DELETE(req: Request) {
  const userId = await getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { tripId } = await req.json();
  if (!tripId || typeof tripId !== 'string') {
    return NextResponse.json({ error: 'tripId is required' }, { status: 400 });
  }

  try {
    await prisma.userBadge.delete({ where: { userId_tripId: { userId, tripId } } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e) {
    // If it doesn't exist, still return ok
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
