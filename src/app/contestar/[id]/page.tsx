import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";
import { Logo } from "@/components/logo";
import { ContestationForm } from "@/components/contestation-form";
import { fetchReportById } from "@/lib/data-source";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function ContestarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await fetchReportById(id);
  if (!report) notFound();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <Logo size="md" />
          <Link href={`/denuncia/${id}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Voltar para a denúncia
            </Button>
          </Link>
        </div>
      </header>

      <main
        id="conteudo-principal"
        className="flex-1 px-4 py-10 md:px-6 md:py-14"
      >
        <div className="mx-auto max-w-2xl space-y-8">
          <div className="space-y-3 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Scale className="size-7" aria-hidden="true" />
            </div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
              Contestação de denúncia
            </h1>
            <p className="mx-auto max-w-xl text-sm text-muted-foreground">
              Garantido pelo Art. 18 da LGPD, você pode contestar uma denúncia
              apresentando sua defesa. Nossa equipe analisa em até 72 horas úteis
              e você recebe retorno por email.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-4 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Sobre a denúncia
            </p>
            <p className="mt-1.5 font-mono font-semibold">
              #{report.id.slice(-4)} · {report.location} · {new Date(report.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>

          <ContestationForm reportId={id} />
        </div>
      </main>
    </div>
  );
}
