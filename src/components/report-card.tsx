import Link from "next/link";
import { ArrowUp, ArrowDown, MessageCircle, MapPin, BadgeCheck } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import { getCategoryById } from "@/lib/categories";
import type { Report } from "@/lib/mock-data";
import { Card } from "@/components/ui/card";
import { RiskBadge } from "@/components/risk-badge";
import { MaskedIdentifier } from "@/components/masked-identifier";

interface ReportCardProps {
  report: Report;
  variant?: "compact" | "full";
  className?: string;
}

export function ReportCard({ report, variant = "full", className }: ReportCardProps) {
  const category = getCategoryById(report.category);
  const Icon = category.icon;

  return (
    <Card
      className={cn(
        "group flex flex-col overflow-hidden transition-all hover:border-primary/30 hover:shadow-md",
        className
      )}
    >
      <Link
        href={`/denuncia/${report.id}`}
        className="flex h-full flex-col focus-visible:outline-none"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-[18px]" aria-hidden="true" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                {category.label}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>{timeAgo(report.createdAt)}</span>
                <span aria-hidden="true">·</span>
                <MapPin className="size-3" aria-hidden="true" />
                <span className="truncate">{report.location}</span>
              </div>
            </div>
          </div>
          <RiskBadge level={report.riskLevel} size="sm" />
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 px-5 py-4">
          <MaskedIdentifier
            type={report.identifierType}
            value={report.identifier}
            size="md"
            showIcon
          />
          <p
            className={cn(
              "text-sm leading-relaxed text-foreground/80",
              variant === "compact" ? "line-clamp-2" : "line-clamp-3"
            )}
          >
            {report.description}
          </p>
          {report.verified && (
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-success">
              <BadgeCheck className="size-3.5" aria-hidden="true" />
              <span>Verificada pela comunidade</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-border bg-muted/5 px-5 py-3 text-sm">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span
              className="inline-flex items-center gap-1 font-medium"
              aria-label={`${report.votesUp} confirmações`}
            >
              <ArrowUp className="size-4 text-success" aria-hidden="true" />
              <span className="tabular-nums text-foreground">{report.votesUp}</span>
            </span>
            <span
              className="inline-flex items-center gap-1"
              aria-label={`${report.votesDown} marcados como falso alerta`}
            >
              <ArrowDown className="size-4 text-destructive" aria-hidden="true" />
              <span className="tabular-nums">{report.votesDown}</span>
            </span>
            <span
              className="inline-flex items-center gap-1"
              aria-label={`${report.comments} comentários`}
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              <span className="tabular-nums">{report.comments}</span>
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            por{" "}
            <span className="font-medium text-foreground">
              @{report.author.username}
            </span>
          </span>
        </div>
      </Link>
    </Card>
  );
}
