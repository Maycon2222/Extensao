import Link from "next/link";
import { Suspense } from "react";
import { ArrowUpRight, TrendingUp, MapPin, ShieldPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SearchBar } from "@/components/search-bar";
import { RiskBadge } from "@/components/risk-badge";
import { RiskGauge } from "@/components/risk-gauge";
import { MaskedIdentifier } from "@/components/masked-identifier";
import { ReportCard } from "@/components/report-card";
import { detectIdentifierType, type RiskLevel } from "@/lib/utils";
import { fetchSearchResults } from "@/lib/data-source";
import type { Report } from "@/lib/mock-data";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

function computeAggregate(matches: Report[]): {
  riskLevel: RiskLevel;
  score: number;
} {
  if (matches.length === 0) return { riskLevel: "low", score: 0 };

  const weights = { low: 10, medium: 30, high: 60, critical: 95 };
  const avg =
    matches.reduce((sum, r) => sum + weights[r.riskLevel], 0) / matches.length;
  const voteBoost = matches.reduce((s, r) => s + r.votesUp - r.votesDown, 0) / 10;
  const score = Math.min(100, Math.round(avg + Math.min(voteBoost, 30)));

  let level: RiskLevel = "low";
  if (score >= 75) level = "critical";
  else if (score >= 50) level = "high";
  else if (score >= 25) level = "medium";

  return { riskLevel: level, score };
}

export default async function BuscarPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const matches = query ? await fetchSearchResults(query) : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
      <div className="mb-8">
        <h1 className="mb-4 font-display text-2xl font-extrabold tracking-tight md:text-3xl">
          Buscar
        </h1>
        <Suspense fallback={<div className="h-14 rounded-2xl bg-muted/20" />}>
          <SearchBar defaultValue={query} size="lg" />
        </Suspense>
      </div>

      {query ? (
        matches.length > 0 ? (
          <SearchResults query={query} matches={matches} />
        ) : (
          <NoResultsState query={query} />
        )
      ) : (
        <EmptySearchState />
      )}
    </div>
  );
}

function SearchResults({ query, matches }: { query: string; matches: Report[] }) {
  const { riskLevel, score } = computeAggregate(matches);
  const type = detectIdentifierType(query);

  const topLocation = matches[0]?.location ?? "-";

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden p-0">
        <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:gap-8 md:p-8">
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Resultado para
              </p>
              {type !== "unknown" ? (
                <MaskedIdentifier
                  type={type as "phone" | "url" | "cnpj"}
                  value={query}
                  size="lg"
                  showIcon
                />
              ) : (
                <p className="font-mono text-lg font-semibold">{query}</p>
              )}
            </div>

            <RiskBadge level={riskLevel} size="lg" />

            <div className="grid gap-4 border-t border-border pt-5 sm:grid-cols-3">
              <Metric
                label="Denúncias encontradas"
                value={matches.length.toString()}
              />
              <Metric
                label="Confirmações da comunidade"
                value={matches.reduce((s, r) => s + r.votesUp, 0).toString()}
              />
              <Metric
                label="Região mais reportada"
                value={topLocation}
                icon={<MapPin className="size-3.5" aria-hidden="true" />}
              />
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-warning/30 bg-warning/10 p-4 text-sm">
              <TrendingUp
                className="size-5 shrink-0 text-warning-foreground"
                aria-hidden="true"
              />
              <p className="text-foreground">
                <span className="font-semibold">Atenção:</span> este
                identificador tem histórico de denúncias. Evite interagir.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center border-border md:border-l md:pl-8">
            <RiskGauge value={score} level={riskLevel} />
          </div>
        </div>
      </Card>

      <section aria-labelledby="matches-heading">
        <div className="mb-4 flex items-end justify-between">
          <h2
            id="matches-heading"
            className="font-display text-xl font-bold tracking-tight"
          >
            Denúncias relacionadas ({matches.length})
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {matches.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="inline-flex items-center gap-1.5 text-lg font-bold tabular-nums">
        {icon}
        {value}
      </span>
    </div>
  );
}

function EmptySearchState() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border p-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Search className="size-8" aria-hidden="true" />
      </div>
      <div className="space-y-1.5">
        <h2 className="text-lg font-bold">Pesquise antes de confiar</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Cole um telefone, link ou CNPJ no campo acima para ver o histórico de
          denúncias e o nivel de risco.
        </p>
      </div>
    </div>
  );
}

function NoResultsState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border p-12 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-success/10 text-success">
        <Search className="size-8" aria-hidden="true" />
      </div>
      <div className="max-w-md space-y-1.5">
        <h2 className="text-lg font-bold">
          Nenhuma denúncia encontrada para{" "}
          <span className="font-mono text-primary">
            {query.length > 30 ? `${query.slice(0, 30)}...` : query}
          </span>
        </h2>
        <p className="text-sm text-muted-foreground">
          Isto pode ser um bom sinal, mas não e garantia de segurança. Se você
          suspeita de golpe, registre a primeira denúncia.
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href={`/denunciar?identifier=${encodeURIComponent(query)}`}>
          <Button size="lg" className="gap-2">
            <ShieldPlus className="size-4" aria-hidden="true" />
            Criar primeira denúncia
          </Button>
        </Link>
        <Link href="/feed">
          <Button variant="outline" size="lg" className="gap-2">
            Ver feed geral
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
      <div className="mt-2 flex items-start gap-2 rounded-xl border border-warning/30 bg-warning/10 p-4 text-left text-xs">
        <span className="font-semibold">Importante:</span>
        <span className="text-muted-foreground">
          A ausencia de denúncias não garante segurança. Confira o remetente,
          evite clicar em links suspeitos e nunca compartilhe códigos recebidos
          por SMS.
        </span>
      </div>
    </div>
  );
}
