"use client";

import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/lib/utils";

interface RiskGaugeProps {
  /** Valor de 0 a 100 */
  value: number;
  level: RiskLevel;
  label?: string;
  className?: string;
}

const riskColors: Record<RiskLevel, string> = {
  low: "hsl(var(--risk-low))",
  medium: "hsl(var(--risk-medium))",
  high: "hsl(var(--risk-high))",
  critical: "hsl(var(--risk-critical))",
};

const levelLabels: Record<RiskLevel, string> = {
  low: "BAIXO",
  medium: "MEDIO",
  high: "ALTO",
  critical: "CRITICO",
};

export function RiskGauge({ value, level, label, className }: RiskGaugeProps) {
  const clamped = Math.max(0, Math.min(100, value));
  // Semi-circle gauge: 180 degrees total
  const angle = -90 + (clamped / 100) * 180;

  // Arc parameters
  const radius = 80;
  const strokeWidth = 14;
  const cx = 100;
  const cy = 100;

  // Path do arco completo de 180 graus
  const backgroundArc = describeArc(cx, cy, radius, -90, 90);
  const foregroundArc = describeArc(cx, cy, radius, -90, angle);

  return (
    <div
      className={cn("flex flex-col items-center gap-3", className)}
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Nivel de risco: ${levelLabels[level]}, ${clamped} de 100`}
    >
      <svg
        viewBox="0 0 200 115"
        className="w-full max-w-[240px]"
        role="presentation"
      >
        {/* Background arc */}
        <path
          d={backgroundArc}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Foreground arc */}
        <path
          d={foregroundArc}
          fill="none"
          stroke={riskColors[level]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          style={{
            transition: "stroke-dasharray 600ms ease-out, stroke 300ms ease-out",
          }}
        />
        {/* Pointer line */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + (radius - 5) * Math.cos((angle * Math.PI) / 180)}
          y2={cy + (radius - 5) * Math.sin((angle * Math.PI) / 180)}
          stroke="hsl(var(--foreground))"
          strokeWidth={3}
          strokeLinecap="round"
        />
        {/* Center dot */}
        <circle cx={cx} cy={cy} r={6} fill="hsl(var(--foreground))" />
        <circle cx={cx} cy={cy} r={2.5} fill="hsl(var(--background))" />
      </svg>

      <div className="flex flex-col items-center">
        <span
          className="text-3xl font-bold tabular-nums"
          style={{ color: riskColors[level] }}
        >
          {clamped}
        </span>
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: riskColors[level] }}
        >
          {label ?? levelLabels[level]}
        </span>
      </div>
    </div>
  );
}

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): { x: number; y: number } {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  const sweep = endAngle > startAngle ? "1" : "0";
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
}
