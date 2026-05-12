import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validations/auth";
import { authConfig } from "@/lib/auth.config";

const MOCK_USERS = [
  {
    id: "mock-admin",
    email: "admin@opa.app",
    name: "Administrador OPA",
    username: "admin",
    role: "ADMIN",
    reputationTier: "DIAMANTE",
    image: null,
  },
  {
    id: "mock-maria",
    email: "maria@example.com",
    name: "Maria Silva",
    username: "maria",
    role: "USER",
    reputationTier: "OURO",
    image: null,
  },
] as const;

function authorizeMockUser(email: string, password: string) {
  if (process.env.OPA_FORCE_MOCK !== "true" || password !== "senha123") {
    return null;
  }

  return MOCK_USERS.find((user) => user.email === email) ?? null;
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
