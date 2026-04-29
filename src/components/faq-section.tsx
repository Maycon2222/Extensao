"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    q: "Como a OPA evita denúncias falsas?",
    a: "Usamos um sistema de votacao comunitária ponderada pela reputação dos votantes, detecção de padrões anomalos e moderação humana. Contas novas tem peso reduzido até demonstrarem histórico confiavel.",
  },
  {
    q: "Posso denunciar de forma anônima?",
    a: "O cadastro e obrigatório para denunciar e votar (para evitar spam), mas seu nome real não e exibido publicamente. Usuários veem apenas seu username.",
  },
  {
    q: "Os dados ficam públicos? E a LGPD?",
    a: "Telefones e CNPJs são exibidos parcialmente mascarados. CPFs e nomes completos não são publicados em hipótese alguma. Seguimos a LGPD com base legal de legítimo interesse para dados públicos e consentimento para cadastro.",
  },
  {
    q: "E se alguem me denunciar injustamente?",
    a: "Você tem direito a contestação garantido pelo Art. 18 da LGPD. Basta abrir um pedido de contestação, apresentar evidências e nossa equipe analisa em até 72 horas.",
  },
  {
    q: "A OPA substitui a polícia ou o Procon?",
    a: "Não. Somos uma plataforma complementar de alerta comunitário. Em caso de golpe, registre Boletim de Ocorrência na polícia e denuncie no Procon e no seu banco.",
  },
  {
    q: "Posso usar a OPA sem me cadastrar?",
    a: "Sim. Qualquer pessoa pode pesquisar telefones, URLs e CNPJs e ver o feed público sem cadastro. O cadastro e necessário apenas para denunciar e votar.",
  },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="bg-surface/40 py-20 lg:py-28"
    >
      <div className="container mx-auto max-w-3xl">
        <div className="space-y-3 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary">
            Perguntas frequentes
          </span>
          <h2
            id="faq-heading"
            className="font-display text-3xl font-extrabold tracking-tight md:text-4xl"
          >
            Tudo que você precisa saber
          </h2>
        </div>

        <div className="mt-10 space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${idx}`}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <span className="text-base font-semibold">{item.q}</span>
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </button>
                <div
                  id={`faq-panel-${idx}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${idx}`}
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    isOpen ? "max-h-96" : "max-h-0"
                  )}
                >
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
