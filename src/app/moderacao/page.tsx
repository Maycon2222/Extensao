import { Scale, TriangleAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/back-button";

export default function ModeracaoPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <div className="mb-6">
        <BackButton fallback="/denunciar" />
      </div>

      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Scale className="size-6" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            Politica de Moderacao
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Como denuncias e evidencias sao avaliadas antes de ganhar destaque.
          </p>
        </div>
      </div>

      <Card className="space-y-6 p-6 leading-relaxed">
        <section>
          <h2 className="mb-2 text-lg font-bold">Criterios de analise</h2>
          <p className="text-sm text-muted-foreground">
            Denuncias podem ser revisadas por padroes de risco, votos da
            comunidade, reincidencia do identificador e clareza das evidencias
            apresentadas.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold">Evidencias</h2>
          <p className="text-sm text-muted-foreground">
            Screenshots podem passar por moderacao antes de publicacao. Evidencias
            com dados pessoais expostos, conteudo sensivel ou informacoes
            irrelevantes podem ser recusadas.
          </p>
        </section>

        <section className="flex gap-3 rounded-xl border border-amber-400/60 bg-amber-400/10 p-4">
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-amber-300" aria-hidden="true" />
          <p className="text-sm font-medium text-amber-50">
            Denuncias falsas, ofensivas ou feitas para prejudicar terceiros podem
            ser removidas e a conta pode ser suspensa.
          </p>
        </section>
      </Card>
    </main>
  );
}
