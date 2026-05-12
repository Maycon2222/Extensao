"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ShieldPlus,
  Filter,
  Flame,
  Clock,
  ShieldAlert,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportCard } from "@/components/report-card";
import {
  FeedFilters,
  REGION_OPTIONS,
  type RegionValue,
} from "@/components/feed-filters";
import type { Report } from "@/lib/mock-data";
import type { FraudCategoryId } from "@/lib/categories";
import { cn, type RiskLevel } from "@/lib/utils";

type SortKey = "recent" | "voted" | "risk";

const SORT_OPTIONS: { key: SortKey; label: string; icon: typeof Clock }[] = [
  { key: "recent", label: "Mais recentes", icon: Clock },
  { key: "voted", label: "Mais votadas", icon: Flame },
  { key: "risk", label: "Maior risco", icon: ShieldAlert },
];

const RISK_RANK: Record<RiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function FeedClient({ reports }: { reports: Report[] }) {
  const [categories, setCategories] = useState<FraudCategoryId[]>([]);
  const [risks, setRisks] = useState<RiskLevel[]>([]);
  const [period, setPeriod] = useState("all");
  const [region, setRegion] = useState<RegionValue>("all");
  const [sort, setSort] = useState<SortKey>("recent");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list: Report[] = [...reports];

    if (categories.length > 0) {
      list = list.filter((r) => categories.includes(r.category));
    }
    if (risks.length > 0) {
      list = list.filter((r) => risks.includes(r.riskLevel));
    }
    if (period !== "all") {
      const now = Date.now();
      const hours = period === "24h" ? 24 : period === "7d" ? 24 * 7 : 24 * 30;
      list = list.filter(
        (r) => now - new Date(r.createdAt).getTime() < hours * 60 * 60 * 1000
      );
    }
    if (region !== "all") {
      const selectedRegion = REGION_OPTIONS.find((option) => option.value === region);
      if (selectedRegion?.uf) {
        list = list.filter((r) => r.location.trim().endsWith(`, ${selectedRegion.uf}`));
      }
    }

    switch (sort) {
      case "voted":
        list.sort((a, b) => b.votesUp - a.votesUp);
        break;
      case "risk":
        list.sort((a, b) => RISK_RANK[b.riskLevel] - RISK_RANK[a.riskLevel]);
        break;
      case "recent":
      default:
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return list;
  }, [reports, categories, risks, period, region, sort]);

  const activeFilterCount =
    categories.length + risks.length + (period !== "all" ? 1 : 0) + (region !== "all" ? 1 : 0);

  const clearFilters = () => {
    setCategories([]);
    setRisks([]);
    setPeriod("all");
    setRegion("all");
  };

  return (
    <div className="flex">
      <aside
        className="hidden w-72 shrink-0 border-r border-border lg:block"
        aria-label="Filtros do feed"
      >
        <div className="sticky top-16">
          <FeedFilters
            categories={categories}
            onCategoriesChange={setCategories}
            risks={risks}
            onRisksChange={setRisks}
            period={period}
            onPeriodChange={setPeriod}
            region={region}
            onRegionChange={setRegion}
            onClear={clearFilters}
          />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
          <div className="mb-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">
                  Feed de denúncias
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {filtered.length} denúncia{filtered.length !== 1 && "s"}
                  {activeFilterCount > 0 &&
                    ` · ${activeFilterCount} filtro${activeFilterCount > 1 ? "s" : ""} ativo${activeFilterCount > 1 ? "s" : ""}`}
                </p>
              </div>
              <Link href="/denunciar">
                <Button size="lg" className="hidden gap-2 md:inline-flex">
                  <ShieldPlus className="size-4" aria-hidden="true" />
                  Nova denúncia
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-surface p-1">
                {SORT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const active = sort === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setSort(opt.key)}
                      aria-pressed={active}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      <span className="hidden sm:inline">{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="gap-2 lg:hidden"
                onClick={() => setFiltersOpen(true)}
              >
                <Filter className="size-4" aria-hidden="true" />
                Filtros
                {activeFilterCount > 0 && (
                  <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border p-12 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted/10 text-muted-foreground">
                <Inbox className="size-8" aria-hidden="true" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-lg font-bold">
                  Nenhuma denúncia com esses filtros
                </h2>
                <p className="max-w-md text-sm text-muted-foreground">
                  Tente ajustar os filtros ou limpa-los para ver todas as
                  denúncias recentes.
                </p>
              </div>
              <Button variant="outline" onClick={clearFilters}>
                Limpar filtros
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </div>
          )}
        </div>
      </div>

      {filtersOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filtros"
        >
          <button
            type="button"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            aria-label="Fechar filtros"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-surface shadow-2xl">
            <FeedFilters
              mobile
              categories={categories}
              onCategoriesChange={setCategories}
              risks={risks}
              onRisksChange={setRisks}
              period={period}
              onPeriodChange={setPeriod}
              region={region}
              onRegionChange={setRegion}
              onClear={clearFilters}
              onClose={() => setFiltersOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
