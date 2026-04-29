import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  BadgeCheck,
  ChevronRight,
  MessageCircle,
  Scale,
  Home,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/risk-badge";
import { RiskGauge } from "@/components/risk-gauge";
import { MaskedIdentifier } from "@/components/masked-identifier";
import { VoteButtons } from "@/components/vote-buttons";
import { ShareCard } from "@/components/share-card";
import { ReportCard } from "@/components/report-card";
import { CommentsSection } from "@/components/comments-section";
import { Button } from "@/components/ui/button";
import { fetchReportById, fetchAllReports } from "@/lib/data-source";
import { getCategoryById } from "@/lib/categories";
import { timeAgo } from "@/lib/utils";

interface DenunciaPageProps {
  params: Promise<{ id: string }>;
}

export default async function DenunciaPage({ params }: DenunciaPageProps) {
  const { id } = await params;
  const [report, allReports] = await Promise.all([
    fetchReportById(id),
    fetchAllReports(),
  ]);

  if (!report) notFound();

  const category = getCategoryById(report.category);
  const Icon = category.icon;

  const riskScore =
    report.riskLevel === "critical"
      ? 92
      : report.riskLevel === "high"
      ? 72
      : report.riskLevel === "medium"
      ? 45
      : 20;

  const related = allReports
    .filter((r) => r.id !== report.id && r.category === report.category)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-10">
      <nav aria-label="Navegacao" className="mb-6">
        <ol className="flex items-center gap-1 text-xs text-muted-foreground">
          <li>
            <Link
              href="/feed"
              className="inline-flex items-center gap-1 rounded hover:text-foreground"
            >
              <Home className="size-3.5" aria-hidden="true" />
              Feed
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li>
            <Link
              href={`/feed?category=${report.category}`}
              className="hover:text-foreground"
            >
              {category.label}
            </Link>
          </li>
          <ChevronRight className="size-3.5" aria-hidden="true" />
          <li className="text-foreground" aria-current="page">
            Denúncia #{report.id.slice(-4)}
          </li>
        </ol>
      </nav>

      <header className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1.5">
            <Icon className="size-3.5" aria-hidden="true" />
            {category.label}
          </Badge>
          <RiskBadge level={report.riskLevel} size="md" />
          {report.verified && (
            <Badge variant="success" className="gap-1">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              Verificada pela comunidade
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{timeAgo(report.createdAt)}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-4" aria-hidden="true" />
            {report.location}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            por{" "}
            <span className="font-medium text-foreground">
              @{report.author.username}
            </span>
            <span className="ml-2 inline-flex items-center rounded-full bg-muted/15 px-2 py-0.5 text-[10px] font-bold uppercase">
              {report.author.reputation}
            </span>
          </span>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <Card
            className="overflow-hidden border-l-4"
            style={{
              borderLeftColor: `hsl(var(--risk-${report.riskLevel}))`,
            }}
          >
            <div className="space-y-3 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Identificador denunciado
              </p>
              <MaskedIdentifier
                type={report.identifierType}
                value={report.identifier}
                size="lg"
              />
              <p className="text-xs text-muted-foreground">
                Exibido de forma parcialmente mascarada conforme nossa política
                LGPD. O valor completo fica armazenado apenas para matching de
                busca.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="mb-3 font-display text-lg font-bold">
              O que aconteceu
            </h2>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
              {report.description}
            </p>
          </Card>

          <Card className="p-6">
            <h2 className="mb-5 font-display text-lg font-bold">
              Sua opinião sobre essa denúncia
            </h2>
            <VoteButtons
              reportId={report.id}
              initialUp={report.votesUp}
              initialDown={report.votesDown}
            />
          </Card>

          <Card className="p-6">
            <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
              <MessageCircle className="size-5 text-primary" aria-hidden="true" />
              Comentários ({report.comments})
            </h2>
            <CommentsSection reportId={report.id} />
          </Card>

          <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-border p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 text-sm">
              <Scale
                className="mt-0.5 size-5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <div>
                <p className="font-medium text-foreground">
                  E você quem está sendo denunciado?
                </p>
                <p className="text-muted-foreground">
                  Seu direito de contestação e garantido pelo Art. 18 da LGPD.
                </p>
              </div>
            </div>
            <Link href={`/contestar/${report.id}`}>
              <Button variant="outline" size="sm">
                Contestar denúncia
              </Button>
            </Link>
          </div>
        </div>

        <aside className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Nivel de risco
            </h2>
            <RiskGauge value={riskScore} level={report.riskLevel} />
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Calculado a partir de votos, tendência e denúncias similares.
            </p>
          </Card>

          <ShareCard report={report} />

          {related.length > 0 && (
            <Card className="p-6">
              <h2 className="mb-4 text-sm font-semibold">Denúncias similares</h2>
              <ul className="space-y-3">
                {related.map((r) => {
                  const cat = getCategoryById(r.category);
                  const CatIcon = cat.icon;
                  return (
                    <li key={r.id}>
                      <Link
                        href={`/denuncia/${r.id}`}
                        className="group -m-2 flex items-start gap-3 rounded-lg p-2 hover:bg-muted/10"
                      >
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/10 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                          <CatIcon className="size-4" aria-hidden="true" />
                        </div>
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <p className="truncate font-mono text-xs font-medium">
                            <MaskedIdentifier
                              type={r.identifierType}
                              value={r.identifier}
                              size="sm"
                              showIcon={false}
                            />
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {r.votesUp} confirmações · {timeAgo(r.createdAt)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section
          aria-labelledby="related-heading"
          className="mt-10 border-t border-border pt-8"
        >
          <h2
            id="related-heading"
            className="mb-4 font-display text-xl font-bold tracking-tight"
          >
            Mais denúncias de {category.label}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <ReportCard key={r.id} report={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
