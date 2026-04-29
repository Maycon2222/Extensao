import Link from "next/link";
import { Award, Calendar, ShieldPlus, ThumbsUp, MessageCircle, CheckCircle2 } from "lucide-react";
import { requireAuth } from "@/lib/auth-utils";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportCard } from "@/components/report-card";
import { adaptReport } from "@/lib/report-adapter";
import { cn } from "@/lib/utils";
import type { Report } from "@/lib/mock-data";

const TIER_COLOR: Record<string, string> = {
  BRONZE: "from-amber-700 to-amber-500",
  PRATA: "from-slate-400 to-slate-300",
  OURO: "from-yellow-500 to-yellow-300",
  DIAMANTE: "from-cyan-400 to-blue-500",
};

const TIER_LABEL: Record<string, string> = {
  BRONZE: "Bronze",
  PRATA: "Prata",
  OURO: "Ouro",
  DIAMANTE: "Diamante",
};

export default async function PerfilPage() {
  const user = await requireAuth();

  // Fallback gracioso se o banco não estiver disponível
  let profile: {
    name: string;
    username: string;
    email: string;
    reputationScore: number;
    reputationTier: "BRONZE" | "PRATA" | "OURO" | "DIAMANTE";
    createdAt: Date;
  };
  let myReports: Report[] = [];
  let stats = { total: 0, verified: 0, votesCast: 0, comments: 0 };

  try {
    const [userData, reports, voteCount, commentCount] = await Promise.all([
      db.user.findUniqueOrThrow({
        where: { id: user.id },
        select: {
          name: true,
          username: true,
          email: true,
          reputationScore: true,
          reputationTier: true,
          createdAt: true,
        },
      }),
      db.report.findMany({
        where: { authorId: user.id, status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 12,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              reputationTier: true,
            },
          },
        },
      }),
      db.vote.count({ where: { userId: user.id } }),
      db.comment.count({ where: { authorId: user.id, hidden: false } }),
    ]);

    profile = userData;
    myReports = reports.map((r) => adaptReport(r));
    stats = {
      total: reports.length,
      verified: reports.filter((r) => r.verified).length,
      votesCast: voteCount,
      comments: commentCount,
    };
  } catch (error) {
    console.warn("[perfil] DB indisponivel:", (error as Error).message);
    profile = {
      name: user.name ?? "Usuário",
      username: user.username,
      email: user.email ?? "",
      reputationScore: 0,
      reputationTier: user.reputationTier,
      createdAt: new Date(),
    };
  }

  const initials = getInitials(profile.name);

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
      <Card className="overflow-hidden">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8">
          <div
            className={cn(
              "flex size-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-3xl font-bold text-white shadow-lg",
              TIER_COLOR[profile.reputationTier] ?? TIER_COLOR.BRONZE
            )}
            aria-hidden="true"
          >
            {initials}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                {profile.name}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold uppercase text-primary">
                <Award className="size-3.5" aria-hidden="true" />
                {TIER_LABEL[profile.reputationTier]}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-3.5" aria-hidden="true" />
                Desde {profile.createdAt.toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <span>
                <span className="tabular-nums font-semibold text-foreground">
                  {profile.reputationScore}
                </span>{" "}
                pontos de reputação
              </span>
            </div>
          </div>

          <Link href="/denunciar">
            <Button size="lg" className="gap-2">
              <ShieldPlus className="size-4" aria-hidden="true" />
              Nova denúncia
            </Button>
          </Link>
        </div>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ShieldPlus}
          label="Denúncias publicadas"
          value={stats.total}
        />
        <StatCard
          icon={CheckCircle2}
          label="Verificadas"
          value={stats.verified}
          highlight
        />
        <StatCard
          icon={ThumbsUp}
          label="Votos dados"
          value={stats.votesCast}
        />
        <StatCard
          icon={MessageCircle}
          label="Comentários"
          value={stats.comments}
        />
      </div>

      <section aria-labelledby="my-reports-heading" className="mt-8">
        <h2
          id="my-reports-heading"
          className="mb-4 font-display text-xl font-bold tracking-tight"
        >
          Minhas denúncias
        </h2>
        {myReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border p-12 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <ShieldPlus className="size-6" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold">Você ainda não publicou denúncias.</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Comece a proteger a comunidade.
              </p>
            </div>
            <Link href="/denunciar">
              <Button>Criar primeira denúncia</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myReports.map((r) => (
              <ReportCard key={r.id} report={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: typeof ShieldPlus;
  label: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl",
          highlight ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-2xl font-bold tabular-nums">{value}</p>
      </div>
    </Card>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
