import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * Retorna a sessao atual ou null se não autenticado.
 */
export async function getSession() {
  return await auth();
}

/**
 * Retorna o usuário autenticado (do JWT) ou null.
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Carrega o registro COMPLETO do usuário do banco (além do JWT).
 * Use quando precisar de campos que não estão no token.
 */
export async function getCurrentUserFull() {
  const user = await getCurrentUser();
  if (!user?.id) return null;
  return await db.user.findUnique({ where: { id: user.id } });
}

/**
 * Exige autenticação em server components. Redireciona para /entrar se não logado.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");
  return user;
}

/**
 * Exige role ADMIN. Redireciona para /feed se não for admin.
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "ADMIN") redirect("/feed");
  return user;
}

/**
 * Exige role MODERATOR ou ADMIN.
 */
export async function requireModerator() {
  const user = await requireAuth();
  if (user.role !== "ADMIN" && user.role !== "MODERATOR") redirect("/feed");
  return user;
}
