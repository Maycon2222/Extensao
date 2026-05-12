"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/lib/validations/auth";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/feed";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Credenciais invalidas", {
          description: "Verifique seu email e senha.",
        });
        return;
      }

      toast.success("Bem-vindo de volta!");
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <p
            id="email-error"
            className="text-xs text-destructive"
            role="alert"
          >
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          <Link
            href="/recuperar"
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Esqueci a senha
          </Link>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            className="absolute right-1 top-1 flex size-9 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {errors.password && (
          <p
            id="password-error"
            className="text-xs text-destructive"
            role="alert"
          >
            {errors.password}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
        <LogIn className="size-4" aria-hidden="true" />
        {loading ? "Entrando..." : "Entrar"}
      </Button>

      <div className="rounded-lg border border-border bg-muted/10 p-3 text-xs text-muted-foreground">
        <p className="font-semibold text-foreground">Contas de teste:</p>
        <p>admin@opa.app · senha: <span className="font-mono">senha123</span></p>
        <p>maria@example.com · senha: <span className="font-mono">senha123</span></p>
      </div>
    </form>
  );
}
