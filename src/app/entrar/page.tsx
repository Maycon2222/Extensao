import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta OPA",
};

export default function EntrarPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center">
          <Logo size="md" />
        </div>
      </header>

      <main
        id="conteudo-principal"
        className="flex flex-1 items-center justify-center px-4 py-10"
      >
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
              Bem-vindo de volta
            </h1>
            <p className="text-sm text-muted-foreground">
              Entre na sua conta para denunciar, votar e acompanhar alertas.
            </p>
          </div>

          <Suspense fallback={<div className="h-80 animate-pulse rounded-2xl bg-muted/20" />}>
            <LoginForm />
          </Suspense>

          <p className="text-center text-sm text-muted-foreground">
            Ainda não tem conta?{" "}
            <Link
              href="/cadastrar"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Criar conta gratis
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
