import type { NextAuthConfig } from "next-auth";

/**
 * Configuração "edge-compatible" do NextAuth — usada pelo middleware.
 * Não pode importar bcrypt, Prisma ou qualquer modulo Node.
 * Credentials provider e adicionado apenas no auth.ts (Node runtime).
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/entrar",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAuthPage =
        nextUrl.pathname.startsWith("/entrar") ||
        nextUrl.pathname.startsWith("/cadastrar");

      const protectedPaths = ["/denunciar", "/perfil", "/minhas-denuncias", "/configuracoes"];
      const isProtected = protectedPaths.some((p) =>
        nextUrl.pathname.startsWith(p)
      );

      if (isOnAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/feed", nextUrl));
      }

      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL("/entrar", nextUrl);
        redirectUrl.searchParams.set("callbackUrl", nextUrl.pathname);
        return Response.redirect(redirectUrl);
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const u = user as unknown as {
          id: string;
          username: string;
          role: "USER" | "MODERATOR" | "ADMIN";
          reputationTier: "BRONZE" | "PRATA" | "OURO" | "DIAMANTE";
        };
        token.id = u.id;
        token.username = u.username;
        token.role = u.role;
        token.reputationTier = u.reputationTier;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        const t = token as unknown as {
          id: string;
          username: string;
          role: "USER" | "MODERATOR" | "ADMIN";
          reputationTier: "BRONZE" | "PRATA" | "OURO" | "DIAMANTE";
        };
        session.user.id = t.id;
        session.user.username = t.username;
        session.user.role = t.role;
        session.user.reputationTier = t.reputationTier;
      }
      return session;
    },
  },
  trustHost: true,
};
