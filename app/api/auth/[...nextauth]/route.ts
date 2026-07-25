export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

function normalizeAuthUrl(value?: string) {
  if (!value) return undefined;

  let cleaned = value.trim();

  try {
    const parsed = new URL(cleaned);
    return parsed.origin;
  } catch {
    // fall through to normalization
  }

  cleaned = cleaned.replace(/^\[+|\]+$/g, "");

  while (/^https?:\/\//i.test(cleaned)) {
    cleaned = cleaned.replace(/^https?:\/\//i, "");
  }

  const withoutTrailingSlash = cleaned.replace(/\/+$/, "");
  const host = withoutTrailingSlash.split(/[/?#]/)[0];

  return host ? `https://${host}` : undefined;
}

async function createAuthHandler() {
  const normalizedUrl = normalizeAuthUrl(
    process.env.NEXTAUTH_URL ?? process.env.URL ?? process.env.VERCEL_URL ?? process.env.NETLIFY_URL
  );

  if (normalizedUrl) {
    process.env.NEXTAUTH_URL = normalizedUrl;
  }

  const { default: NextAuth } = await import("next-auth");
  const { default: CredentialsProvider } = await import("next-auth/providers/credentials");

  return NextAuth({
    providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials) {
          if (!credentials?.email || !credentials?.password) return null;

          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          if (!user) return null;

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) return null;

          return { id: user.id, name: user.name, email: user.email };
        }
      })
    ],
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: "/",
    },
  });
}

export async function GET(request: Request, context: unknown) {
  const handler = await createAuthHandler();
  return handler(request, context as never);
}

export async function POST(request: Request, context: unknown) {
  const handler = await createAuthHandler();
  return handler(request, context as never);
}