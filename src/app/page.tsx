import Link from "next/link";
import {
  Search,
  ShieldPlus,
  CheckCircle2,
  Share2,
  Eye,
  Scale,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { LandingNavbar } from "@/components/landing-navbar";
import { LandingFooter } from "@/components/landing-footer";
import { SearchBar } from "@/components/search-bar";
import { ReportCard } from "@/components/report-card";
import { Button } from "@/components/ui/button";
import { AnimatedCounter } from "@/components/animated-counter";
import { fetchRecentReports, fetchPlatformStats } from "@/lib/data-source";
import { FaqSection } from "@/components/faq-section";

const HOW_IT_WORKS = [
  {
    icon: Search,
    title: "Pesquise",
    description:
      "Antes de confiar, consulte. Cole o telefone, link ou CNPJ suspeito e veja o histórico de denúncias.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: ShieldPlus,
    title: "Denuncie",
    description:
      "Registre tentativas de golpe que você recebeu. Sua denúncia protege milhares de pessoas.",
    color: "bg-secondary/15 text-secondary",
  },
  {
    icon: CheckCircle2,
    title: "Vote",
    description:
      "A comunidade valida cada denúncia como confirmada ou falso alerta. Score de credibilidade público.",
    color: "bg-success/10 text-success",
  },
  {
    icon: Share2,
    title: "Compartilhe",
    description:
      "Gere cards informativos para WhatsApp, Instagram e Twitter. Alerte sua rede de próximos.",
    color: "bg-warning/15 text-warning-foreground",
  },
];

const LGPD_PILLARS = [
  {
    icon: Eye,
    title: "Dados mascarados",
    description:
      "Telefones, CNPJs e URLs são exibidos parcialmente na interface pública. Nenhum CPF ou nome completo e publicado.",
  },
  {
    icon: Scale,
    title: "Direito de contestação",
    description:
      "Qualquer pessoa ou empresa citada pode abrir contestação (Art. 18 da LGPD) e apresentar defesa.",
  },
  {
    icon: ShieldCheck,
    title: "Conformidade LGPD",
    description:
      "Base legal de legítimo interesse para dados públicos, consentimento para cadastro. DPO nomeado.",
  },
];

export default async function LandingPage() {
  const [recent, stats] = await Promise.all([
    fetchRecentReports(3),
    fetchPlatformStats(),
  ]);

  return (
    <div className="flex min-h-dvh flex-col">
      <LandingNavbar />
      <main id="conteudo-principal" className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-40 dark:opacity-30"
            aria-hidden="true"
          >
            <div className="absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/30 via-secondary/20 to-transparent blur-3xl" />
          </div>

          <div className="container grid gap-12 py-16 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:py-24">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium">
                <Sparkles className="size-3.5 text-secondary" aria-hidden="true" />
                <span className="text-muted-foreground">
                  Rede colaborativa contra golpes digitais
                </span>
              </div>

              <div className="space-y-5">
                <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance md:text-5xl lg:text-6xl">
                  Antes de clicar,{" "}
                  <span className="text-primary">consulte</span>.
                  <br />
                  Antes de cair,{" "}
                  <span className="text-secondary">alerte</span>.
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                  Uma rede colaborativa onde brasileiros protegem brasileiros.
                  Pesquise telefones, links e CNPJs suspeitos antes de
                  transações. Denuncie tentativas e ajude a comunidade a
                  identificar golpes.
                </p>
              </div>

              <SearchBar size="xl" />

              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Exemplos:</span>
                <button
                  className="rounded-md bg-muted/10 px-2.5 py-1 font-mono text-xs font-medium transition-colors hover:bg-muted/20"
                  type="button"
                >
                  (11) 9****-3456
                </button>
                <button
                  className="rounded-md bg-muted/10 px-2.5 py-1 font-mono text-xs font-medium transition-colors hover:bg-muted/20"
                  type="button"
                >
                  bradesc0-seguro.top
                </button>
                <button
                  className="rounded-md bg-muted/10 px-2.5 py-1 font-mono text-xs font-medium transition-colors hover:bg-muted/20"
                  type="button"
                >
                  00.***.***/***1-90
                </button>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <HeroIllustration />
            </div>
          </div>
        </section>

        {/* Live counter */}
        <section
          aria-labelledby="stats-heading"
          className="border-y border-border bg-surface"
        >
          <div className="container py-10">
            <h2 id="stats-heading" className="sr-only">
              Estatísticas da plataforma
            </h2>
            <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
              <StatItem
                value={stats.activeReports}
                label="denúncias ativas"
                delay={0}
              />
              <StatItem
                value={stats.confirmedScams}
                label="golpes confirmados"
                delay={200}
                highlight
              />
              <StatItem
                value={stats.monthlySearches}
                label="buscas este mês"
                delay={400}
              />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="como-funciona"
          aria-labelledby="how-heading"
          className="container py-20 lg:py-28"
        >
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Como funciona
            </span>
            <h2
              id="how-heading"
              className="font-display text-3xl font-extrabold tracking-tight md:text-4xl"
            >
              Quatro passos para uma internet mais segura
            </h2>
            <p className="text-muted-foreground">
              Simples, transparente e sempre colaborativo. Sua contribuicao gera
              proteção real para outras pessoas.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.title}
                  className="group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex size-12 items-center justify-center rounded-xl ${step.color}`}
                    >
                      <Icon className="size-6" aria-hidden="true" />
                    </div>
                    <span className="text-4xl font-bold text-muted/25 tabular-nums">
                      0{idx + 1}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-bold">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent reports preview */}
        <section
          aria-labelledby="recent-heading"
          className="bg-surface/40 py-20 lg:py-28"
        >
          <div className="container space-y-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl space-y-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Feed em tempo real
                </span>
                <h2
                  id="recent-heading"
                  className="font-display text-3xl font-extrabold tracking-tight md:text-4xl"
                >
                  Denúncias verificadas pela comunidade
                </h2>
                <p className="text-muted-foreground">
                  Veja o que brasileiros estão denunciando neste momento. Cada
                  relato passa por validação coletiva.
                </p>
              </div>
              <Link href="/feed">
                <Button variant="outline" size="lg" className="gap-2">
                  Ver feed completo
                  <ArrowRight aria-hidden="true" />
                </Button>
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recent.map((report) => (
                <ReportCard key={report.id} report={report} variant="compact" />
              ))}
            </div>
          </div>
        </section>

        {/* LGPD / Trust */}
        <section
          id="lgpd"
          aria-labelledby="lgpd-heading"
          className="container py-20 lg:py-28"
        >
          <div className="mx-auto max-w-2xl space-y-3 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-secondary">
              Feito com responsabilidade
            </span>
            <h2
              id="lgpd-heading"
              className="font-display text-3xl font-extrabold tracking-tight md:text-4xl"
            >
              Proteger sem expor
            </h2>
            <p className="text-muted-foreground">
              Denunciar e importante. Respeitar direitos também. Nossas diretrizes
              foram desenhadas em conformidade com a LGPD.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {LGPD_PILLARS.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="flex flex-col items-start gap-4 rounded-2xl border border-border bg-card p-8"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <Icon className="size-6" aria-hidden="true" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold">{pillar.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <FaqSection />

        {/* CTA final */}
        <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground lg:py-28">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            aria-hidden="true"
          >
            <div className="absolute -bottom-40 -right-40 size-[500px] rounded-full bg-secondary/40 blur-3xl" />
            <div className="absolute -top-40 -left-40 size-[500px] rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="container relative grid gap-8 md:grid-cols-[2fr_1fr] md:items-center">
            <div className="space-y-4">
              <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-5xl">
                Pronto para proteger mais gente?
              </h2>
              <p className="max-w-xl text-lg text-primary-foreground/85">
                Cadastre-se gratis. Cada denúncia sua pode impedir que dezenas de
                outras pessoas caiam no mesmo golpe.
              </p>
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              <Link href="/cadastrar" className="w-full md:w-auto">
                <Button
                  size="xl"
                  className="w-full bg-white text-primary shadow-xl hover:bg-white/90 md:w-auto"
                >
                  Criar conta gratis
                  <ArrowRight aria-hidden="true" />
                </Button>
              </Link>
              <Link
                href="/feed"
                className="text-sm font-medium text-primary-foreground/80 underline-offset-4 hover:underline"
              >
                Quero so ver o feed antes
              </Link>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}

function StatItem({
  value,
  label,
  highlight,
  delay = 0,
}: {
  value: number;
  label: string;
  highlight?: boolean;
  delay?: number;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <AnimatedCounter
        target={value}
        delay={delay}
        duration={1800}
        className={`font-display text-4xl font-extrabold tracking-tight tabular-nums md:text-5xl ${
          highlight ? "text-secondary" : "text-foreground"
        }`}
      />
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="relative mx-auto aspect-square max-w-md">
      {/* Radial background */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent" />

      {/* Shield center */}
      <div className="absolute left-1/2 top-1/2 flex size-36 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-2xl shadow-primary/30">
        <ShieldCheck className="size-16 text-primary-foreground" strokeWidth={1.5} />
      </div>

      {/* Floating report cards */}
      <div className="absolute left-0 top-12 w-56 rounded-2xl border border-border bg-card p-4 shadow-lg animate-fade-in-up">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-primary">
            <ShieldPlus className="size-3.5" />
            Phishing
          </div>
          <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase text-destructive">
            Critico
          </span>
        </div>
        <p className="font-mono text-xs text-foreground">bradesc0-seguro.top</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="size-3.5 text-success" />
          <span>142 confirmaram</span>
        </div>
      </div>

      <div className="absolute bottom-16 right-0 w-56 rounded-2xl border border-border bg-card p-4 shadow-lg animate-fade-in-up [animation-delay:120ms]">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-primary">
            <Share2 className="size-3.5" />
            PIX
          </div>
          <span className="rounded-full bg-[hsl(var(--risk-high)/0.15)] px-2 py-0.5 text-[10px] font-bold uppercase text-[hsl(var(--risk-high))]">
            Alto
          </span>
        </div>
        <p className="font-mono text-xs text-foreground">(11) 9****-4321</p>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="size-3.5 text-success" />
          <span>87 confirmaram</span>
        </div>
      </div>

      <div className="absolute right-10 top-0 rounded-xl border border-border bg-card p-3 shadow-lg animate-fade-in-up [animation-delay:240ms]">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-success/10 text-success">
            <CheckCircle2 className="size-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-bold">Verificada</span>
            <span className="text-[10px] text-muted-foreground">
              Pela comunidade
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
