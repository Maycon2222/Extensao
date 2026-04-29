import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Criar conta",
  description: "Crie sua conta OPA gratis",
};

export default function CadastrarPage() {
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
              Crie sua conta
            </h1>
            <p className="text-sm text-muted-foreground">
              Grátis em menos de um minuto. Sem cobranças, sem spam.
            </p>
          </div>

          <RegisterForm />

          <p className="text-center text-sm text-muted-foreground">
            Já tem conta?{" "}
            <Link
              href="/entrar"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Entrar
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
