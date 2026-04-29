import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Middleware Edge-compatible: usa apenas authConfig sem providers Node
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|images|fonts).*)",
  ],
};
