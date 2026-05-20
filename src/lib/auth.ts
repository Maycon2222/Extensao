import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";
import { authConfig } from "@/lib/auth.config";

function authorizeMockUser(email: string, password: string) {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.OPA_FORCE_MOCK !== "true" ||
    !process.env.OPA_MOCK_EMAIL ||
    !process.env.OPA_MOCK_PASSWORD ||
    email !== process.env.OPA_MOCK_EMAIL ||
    password !== process.env.OPA_MOCK_PASSWORD
  ) {
    return null;
  }

  return {
    id: "mock-user",
    email,
    name: process.env.OPA_MOCK_NAME ?? "Usuario Demo",
    username: process.env.OPA_MOCK_USERNAME ?? "demo",
    role: process.env.OPA_MOCK_ROLE === "ADMIN" ? ("ADMIN" as const) : ("USER" as const),
    reputationTier: "DIAMANTE" as const,
    image: null,
  };
}

/**
 * Config completo do NextAuth — inclui Credentials provider com bcrypt + Prisma.
 * Roda no Node runtime (API routes, server components).
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const mockUser = authorizeMockUser(
          parsed.data.email,
          parsed.data.password
        );
        if (mockUser) return mockUser;

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user || !user.passwordHash) return null;

        const valid = await bcrypt.compare(
          parsed.data.password,
          user.passwordHash
        );

        if (!valid) return null;

        await db.user.update({
          where: { id: user.id },
          data: { lastActiveAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
          reputationTier: user.reputationTier,
          image: user.avatarUrl,
        };
      },
    }),
  ],
});
