export const dynamic = 'force-dynamic';
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Find the user in SQL
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) return null;

        // Check if password matches
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) return null;

        return { id: user.id, name: user.name, email: user.email };
      }
    })
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };