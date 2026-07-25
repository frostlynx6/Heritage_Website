export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // <-- ADD THIS
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";



export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Basic validation
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const displayName = typeof name === 'string' ? name.trim() : null;
    if (password.length < 6) {
      return NextResponse.json({ error: "Password too short." }, { status: 400 });
    }

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ error: "Email already exists." }, { status: 409 });
    }

    // Encrypt the password before saving to SQL
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name: displayName ?? undefined, email: normalizedEmail, password: hashedPassword },
    });

    return NextResponse.json({ message: "Account created!" }, { status: 201 });
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: "Email already exists." }, { status: 409 });
    }
    // Common setup issues: missing DATABASE_URL or missing tables
    const isDev = process.env.NODE_ENV !== 'production';
    const hint = isDev
      ? "Check DATABASE_URL and run `npx prisma db push` to create tables."
      : undefined;
    console.error("Register error:", error);
    return NextResponse.json({ error: "Unable to create account.", hint, detail: isDev ? String(error?.message ?? error) : undefined }, { status: 500 });
  }
}