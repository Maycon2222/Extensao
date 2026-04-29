import { ShieldCheck, ShieldAlert, AlertTriangle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/utils";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const riskConfig: Record<
  RiskLevel,
  {
    label: string;
    icon: typeof Shield;
    bg: string;
    text: string;
    border: string;
  }
> = {
  low: {
    label: "Risco baixo",
    icon: ShieldCheck,
    bg: "bg-[hsl(var(--risk-low)/0.12)]",
    text: "text-[hsl(var(--risk-low))]",
    border: "border-[hsl(var(--risk-low)/0.3)]",
  },
  medium: {
    label: "Risco medio",
    icon: Shield,
    bg: "bg-[hsl(var(--risk-medium)/0.18)]",
    text: "text-[hsl(38_92%_35%)] dark:text-[hsl(var(--risk-medium))]",
    border: "border-[hsl(var(--risk-medium)/0.4)]",
  },
  high: {
    label: "Risco alto",
    icon: ShieldAlert,
    bg: "bg-[hsl(var(--risk-high)/0.15)]",
    text: "text-[hsl(var(--risk-high))]",
    border: "border-[hsl(var(--risk-high)/0.4)]",
  },
  critical: {
    label: "Risco critico",
    icon: AlertTriangle,
    bg: "bg-[hsl(var(--risk-critical)/0.12)]",
    text: "text-[hsl(var(--risk-critical))]",
    border: "border-[hsl(var(--risk-critical)/0.4)]",
  },
};

export function RiskBadge({ level, size = "md", className }: RiskBadgeProps) {
  const config = riskConfig[level];
  const Icon = config.icon;

  const sizeClasses = {
    sm: "h-6 px-2 text-[10px] gap-1 [&_svg]:size-3",
    md: "h-7 px-2.5 text-xs gap-1.5 [&_svg]:size-3.5",
    lg: "h-9 px-3.5 text-sm gap-2 [&_svg]:size-4",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-semibold uppercase tracking-wide",
        config.bg,
        config.text,
        config.border,
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={config.label}
    >
      <Icon aria-hidden="true" />
      <span>{config.label}</span>
    </span>
  );
}
