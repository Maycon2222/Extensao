"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Send, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contestationSchema } from "@/lib/validations/report";

export function ContestationForm({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [doc, setDoc] = useState("");
  const [email, setEmail] = useState("");
  const [argument, setArgument] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const parsed = contestationSchema.safeParse({
      reportId,
      contestantName: name.trim(),
      contestantDoc: doc.trim(),
      contestantEmail: email.trim(),
      argument: argument.trim(),
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path[issue.path.length - 1] as string;
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contestations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Erro ao enviar contestação");
        return;
      }

      toast.success("Contestação enviada", {
        description: "Você recebera retorno por email em até 72 horas.",
      });
      router.push(`/denuncia/${reportId}`);
    } catch (err) {
      console.error(err);
      toast.error("Erro de conexão");
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
      <div className="flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
        <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
        <p className="text-foreground">
          Suas informações são usadas apenas para verificar a legitimidade da
          contestação. Não são publicadas.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cont-name">
          Nome ou razao social <span className="text-destructive">*</span>
        </Label>
        <Input
          id="cont-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          aria-invalid={!!errors.contestantName}
        />
        {errors.contestantName && (
          <p className="text-xs text-destructive">{errors.contestantName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cont-doc">
          CNPJ ou documento de representacao{" "}
          <span className="text-destructive">*</span>
        </Label>
        <Input
          id="cont-doc"
          value={doc}
          onChange={(e) => setDoc(e.target.value)}
          required
          placeholder="00.000.000/0000-00"
          aria-invalid={!!errors.contestantDoc}
        />
        {errors.contestantDoc && (
          <p className="text-xs text-destructive">{errors.contestantDoc}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cont-email">
          Email para contato <span className="text-destructive">*</span>
        </Label>
        <Input
          id="cont-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-invalid={!!errors.contestantEmail}
        />
        {errors.contestantEmail && (
          <p className="text-xs text-destructive">{errors.contestantEmail}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cont-arg">
          Sua defesa <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="cont-arg"
          rows={7}
          value={argument}
          onChange={(e) => setArgument(e.target.value)}
          required
          placeholder="Explique por que a denúncia e incorreta. Apresente evidências, documentos relevantes e qualquer informação que ajude nossa análise."
          maxLength={2000}
          aria-invalid={!!errors.argument}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {argument.length < 50
              ? `Mínimo 50 caracteres (${50 - argument.length} faltam)`
              : "Descrição ok"}
          </span>
          <span>{argument.length}/2000</span>
        </div>
        {errors.argument && (
          <p className="text-xs text-destructive">{errors.argument}</p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
        <Send className="size-4" aria-hidden="true" />
        {loading ? "Enviando..." : "Enviar contestação"}
      </Button>
    </form>
  );
}
