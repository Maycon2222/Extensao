import type { DefaultSession } from "next-auth";
import type { ReputationTier, UserRole } from "@/generated/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      role: UserRole;
      reputationTier: ReputationTier;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    username?: string;
    role?: UserRole;
    reputationTier?: ReputationTier;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    role: UserRole;
    reputationTier: ReputationTier;
  }
}
