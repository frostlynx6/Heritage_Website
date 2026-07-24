import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    
    // Encrypt the password before saving to SQL
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return NextResponse.json({ message: "Account created!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Email already exists." }, { status: 400 });
  }
}