"use client";

import { useState } from "react";
import { Share2, Link2, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MaskedIdentifier } from "@/components/masked-identifier";
import { RiskBadge } from "@/components/risk-badge";
import { cn } from "@/lib/utils";
import type { Report } from "@/lib/mock-data";
import { getCategoryById } from "@/lib/categories";
import { Logo } from "@/components/logo";

const SOCIAL_NETWORKS = [
  {
    name: "WhatsApp",
    buildUrl: (text: string, url: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
    className: "bg-[#25D366] hover:bg-[#20b958] text-white",
  },
  {
    name: "Twitter/X",
    buildUrl: (text: string, url: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    className: "bg-[#000] hover:bg-[#222] text-white dark:bg-white dark:text-black dark:hover:bg-white/90",
  },
  {
    name: "Telegram",
    buildUrl: (text: string, url: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    className: "bg-[#229ED9] hover:bg-[#1d88bb] text-white",
  },
];

interface ShareCardProps {
  report: Report;
}

export function ShareCard({ report }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const category = getCategoryById(report.category);
  const Icon = category.icon;

  const shareText = `ALERTA DE GOLPE (${category.label}) — confirmado por ${report.votesUp} pessoas na OPA. Compartilhe para proteger mais gente.`;
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/denuncia/${report.id}`
      : `/denuncia/${report.id}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border p-5 space-y-1.5">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Share2 className="size-4 text-secondary" aria-hidden="true" />
          <span>Compartilhar alerta</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Preview do card que será compartilhado
        </p>
      </div>

      {/* Preview do card social */}
      <div className="p-5">
        <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary to-primary/80 p-5 text-primary-foreground">
          <div
            className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-secondary/30 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-semibold uppercase tracking-widest opacity-70">
                    Alerta de golpe
                  </span>
                  <span className="text-sm font-bold">{category.label}</span>
                </div>
              </div>
              <div className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase backdrop-blur">
                {report.riskLevel === "critical" ? "CRITICO" : report.riskLevel.toUpperCase()}
              </div>
            </div>

            <div className="rounded-lg bg-white/10 p-3 font-mono text-sm font-semibold backdrop-blur">
              <MaskedIdentifier
                type={report.identifierType}
                value={report.identifier}
                showIcon={false}
                size="sm"
                className="text-primary-foreground"
              />
            </div>

            <p className="line-clamp-2 text-sm leading-relaxed opacity-90">
              {report.description}
            </p>

            <div className="flex items-center justify-between border-t border-white/20 pt-3">
              <div className="flex items-center gap-2 text-xs">
                <Check className="size-3.5" aria-hidden="true" />
                <span className="font-semibold">
                  {report.votesUp} confirmaram
                </span>
              </div>
              <Logo
                size="sm"
                href=""
                className="opacity-90"
                showText
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ações de compartilhamento */}
      <div className="space-y-3 border-t border-border p-5">
        <div className="grid grid-cols-3 gap-2">
          {SOCIAL_NETWORKS.map((net) => (
            <a
              key={net.name}
              href={net.buildUrl(shareText, shareUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                net.className
              )}
            >
              {net.name}
            </a>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="w-full gap-2"
        >
          {copied ? (
            <>
              <Check className="size-4" aria-hidden="true" />
              Link copiado!
            </>
          ) : (
            <>
              <Copy className="size-4" aria-hidden="true" />
              Copiar link
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
