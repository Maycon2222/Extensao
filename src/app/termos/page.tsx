import { ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { BackButton } from "@/components/back-button";

export default function TermosPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <div className="mb-6">
        <BackButton fallback="/denunciar" />
      </div>

      <div className="mb-8 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck className="size-6" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            Termos de Uso
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Regras basicas para uso responsavel da plataforma OPA.
          </p>
        </div>
      </div>

      <Card className="space-y-6 p-6 leading-relaxed">
        <section>
          <h2 className="mb-2 text-lg font-bold">Uso da plataforma</h2>
          <p className="text-sm text-muted-foreground">
            A OPA e uma plataforma colaborativa para registrar e consultar
            tentativas de golpe. As informacoes publicadas devem ser verdadeiras,
            objetivas e relacionadas a riscos digitais.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold">Responsabilidade do usuario</h2>
          <p className="text-sm text-muted-foreground">
            Ao publicar uma denuncia, voce declara que as informacoes sao
            verdadeiras dentro do seu conhecimento e aceita que conteudos falsos,
            abusivos ou com dados pessoais indevidos podem ser removidos.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-bold">Dados pessoais</h2>
          <p className="text-sm text-muted-foreground">
            Nao publique CPF, dados bancarios, nomes completos de pessoas fisicas,
            fotos de perfil ou numeros pessoais visiveis em screenshots.
          </p>
        </section>
      </Card>
    </main>
  );
}
