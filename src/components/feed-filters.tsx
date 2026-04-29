"use client";

import { useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FRAUD_CATEGORIES, type FraudCategoryId } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/utils";

const RISK_OPTIONS: { value: RiskLevel; label: string; color: string }[] = [
  { value: "low", label: "Baixo", color: "text-[hsl(var(--risk-low))]" },
  { value: "medium", label: "Medio", color: "text-[hsl(var(--risk-medium))]" },
  { value: "high", label: "Alto", color: "text-[hsl(var(--risk-high))]" },
  { value: "critical", label: "Critico", color: "text-[hsl(var(--risk-critical))]" },
];

const PERIOD_OPTIONS = [
  { value: "24h", label: "últimas 24h" },
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "all", label: "Todos" },
];

interface FeedFiltersProps {
  categories: FraudCategoryId[];
  onCategoriesChange: (ids: FraudCategoryId[]) => void;
  risks: RiskLevel[];
  onRisksChange: (levels: RiskLevel[]) => void;
  period: string;
  onPeriodChange: (p: string) => void;
  onClear: () => void;
  mobile?: boolean;
  onClose?: () => void;
}

export function FeedFilters({
  categories,
  onCategoriesChange,
  risks,
  onRisksChange,
  period,
  onPeriodChange,
  onClear,
  mobile,
  onClose,
}: FeedFiltersProps) {
  const toggleCategory = (id: FraudCategoryId) => {
    onCategoriesChange(
      categories.includes(id)
        ? categories.filter((c) => c !== id)
        : [...categories, id]
    );
  };

  const toggleRisk = (level: RiskLevel) => {
    onRisksChange(
      risks.includes(level)
        ? risks.filter((r) => r !== level)
        : [...risks, level]
    );
  };

  const hasFilters = categories.length > 0 || risks.length > 0 || period !== "all";

  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        mobile ? "h-full overflow-y-auto p-5" : "p-5"
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Filtros
        </h2>
        {mobile && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar filtros"
            className="rounded-lg p-1.5 hover:bg-muted/10"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* Categorias */}
      <fieldset className="space-y-3">
        <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Categoria
        </legend>
        <div className="space-y-1.5">
          {FRAUD_CATEGORIES.map((cat) => {
            const checked = categories.includes(cat.id);
            const Icon = cat.icon;
            return (
              <label
                key={cat.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors",
                  checked
                    ? "border-primary/40 bg-primary/5"
                    : "border-transparent hover:bg-muted/10"
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleCategory(cat.id)}
                  className="size-4 rounded border-border text-primary focus:ring-ring"
                />
                <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="flex-1">{cat.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Risco */}
      <fieldset className="space-y-3">
        <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Nivel de risco
        </legend>
        <div className="flex flex-wrap gap-2">
          {RISK_OPTIONS.map((opt) => {
            const checked = risks.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => toggleRisk(opt.value)}
                aria-pressed={checked}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
                  checked
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Periodo */}
      <fieldset className="space-y-3">
        <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Periodo
        </legend>
        <div className="flex flex-wrap gap-2">
          {PERIOD_OPTIONS.map((opt) => {
            const checked = period === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onPeriodChange(opt.value)}
                aria-pressed={checked}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
                  checked
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Região (placeholder) */}
      <div className="space-y-2">
        <Label htmlFor="region-select" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Região
        </Label>
        <select
          id="region-select"
          className="flex h-10 w-full rounded-lg border border-input bg-surface px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          defaultValue="all"
        >
          <option value="all">Todo o Brasil</option>
          <option value="sp">São Paulo</option>
          <option value="rj">Rio de Janeiro</option>
          <option value="mg">Minas Gerais</option>
          <option value="rs">Rio Grande do Sul</option>
          <option value="pr">Parana</option>
          <option value="ba">Bahia</option>
        </select>
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="self-start gap-1.5 text-muted-foreground"
        >
          <X className="size-4" aria-hidden="true" />
          Limpar filtros
        </Button>
      )}
    </div>
  );
}
