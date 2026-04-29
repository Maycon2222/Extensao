"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, UserPlus, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/lib/validations/auth";
import { cn } from "@/lib/utils";

export function RegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const passwordChecks = [
    { label: "Ao menos 8 caracteres", ok: password.length >= 8 },
    { label: "Uma letra", ok: /[a-zA-Z]/.test(password) },
    { label: "Um número", ok: /\d/.test(password) },
  ];

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const parsed = registerSchema.safeParse({
      name,
      username: username.toLowerCase(),
      email,
      password,
      confirmPassword,
      acceptTerms: acceptTerms as true,
    });

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
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Erro ao criar conta");
        return;
      }

      toast.success("Conta criada com sucesso!");

      // Login automático
      await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        redirect: false,
      });

      router.push("/feed");
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
      className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="space-y-2">
        <Label htmlFor="name">
          Nome completo <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-xs text-destructive" role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">
          Nome de usuário <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            @
          </span>
          <Input
            id="username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="usuário"
            aria-invalid={!!errors.username}
            className="pl-8"
          />
        </div>
        {errors.username && (
          <p className="text-xs text-destructive" role="alert">
            {errors.username}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Apenas letras minusculas, números e underscore.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email-reg">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email-reg"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-xs text-destructive" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password-reg">
          Senha <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Input
            id="password-reg"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Crie uma senha segura"
            aria-invalid={!!errors.password}
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
        {password.length > 0 && (
          <ul className="mt-2 space-y-1 text-xs">
            {passwordChecks.map((check) => (
              <li
                key={check.label}
                className={cn(
                  "flex items-center gap-1.5",
                  check.ok ? "text-success" : "text-muted-foreground"
                )}
              >
                {check.ok ? (
                  <Check className="size-3.5" aria-hidden="true" />
                ) : (
                  <X className="size-3.5" aria-hidden="true" />
                )}
                {check.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">
          Confirmar senha <span className="text-destructive">*</span>
        </Label>
        <Input
          id="confirm-password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Repita a senha"
          aria-invalid={!!errors.confirmPassword}
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive" role="alert">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <label className="flex cursor-pointer items-start gap-2.5 pt-2">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="mt-0.5 size-4 rounded border-border text-primary focus:ring-ring"
        />
        <span className="text-xs leading-relaxed text-muted-foreground">
          Li e aceito os{" "}
          <a
            href="/termos"
            target="_blank"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Termos de Uso
          </a>{" "}
          e a{" "}
          <a
            href="/privacidade"
            target="_blank"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Política de Privacidade
          </a>
          . Entendo que as denúncias que eu publicar são de minha responsabilidade.
        </span>
      </label>
      {errors.acceptTerms && (
        <p className="text-xs text-destructive" role="alert">
          {errors.acceptTerms}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full gap-2"
        disabled={loading}
      >
        <UserPlus className="size-4" aria-hidden="true" />
        {loading ? "Criando conta..." : "Criar conta gratis"}
      </Button>
    </form>
  );
}
