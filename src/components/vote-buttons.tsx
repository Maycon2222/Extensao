"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface VoteButtonsProps {
  reportId: string;
  initialUp: number;
  initialDown: number;
}

export function VoteButtons({ reportId, initialUp, initialDown }: VoteButtonsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [up, setUp] = useState(initialUp);
  const [down, setDown] = useState(initialDown);
  const [loading, setLoading] = useState(false);

  const cast = async (newVote: "up" | "down") => {
    if (!session?.user) {
      toast.error("Entre para votar", {
        action: {
          label: "Entrar",
          onClick: () => router.push("/entrar"),
        },
      });
      return;
    }

    if (loading) return;
    setLoading(true);

    // Optimistic update
    const prevVote = vote;
    const prevUp = up;
    const prevDown = down;

    if (vote === newVote) {
      setVote(null);
      if (newVote === "up") setUp((v) => v - 1);
      else setDown((v) => v - 1);
    } else {
      if (vote === "up") setUp((v) => v - 1);
      if (vote === "down") setDown((v) => v - 1);
      if (newVote === "up") setUp((v) => v + 1);
      else setDown((v) => v + 1);
      setVote(newVote);
    }

    try {
      const res = await fetch(`/api/reports/${reportId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: newVote === "up" ? "CONFIRM" : "FALSE_ALERT",
        }),
      });

      if (!res.ok) {
        // Rollback
        setVote(prevVote);
        setUp(prevUp);
        setDown(prevDown);
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Erro ao registrar voto");
        return;
      }

      const data = await res.json();
      if (data.action === "removed") {
        toast.info("Voto removido");
      } else {
        toast.success(
          newVote === "up"
            ? "Voto de confirmação registrado"
            : "Marcado como falso alerta"
        );
      }
      // Atualiza stats do server para sincronizar valores exatos
      if (data.stats) {
        setUp(data.stats.votesUp);
        setDown(data.stats.votesDown);
      }
    } catch (err) {
      console.error(err);
      setVote(prevVote);
      setUp(prevUp);
      setDown(prevDown);
      toast.error("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const total = up + down;
  const confirmPct = total > 0 ? Math.round((up / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <VoteButton
          type="up"
          selected={vote === "up"}
          count={up}
          loading={loading}
          onClick={() => cast("up")}
        />
        <VoteButton
          type="down"
          selected={vote === "down"}
          count={down}
          loading={loading}
          onClick={() => cast("down")}
        />
      </div>

      {total > 0 && (
        <div className="space-y-1.5" aria-label="Barra de credibilidade">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{confirmPct}% confirmam o golpe</span>
            <span className="tabular-nums">
              {total} voto{total > 1 && "s"}
            </span>
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-destructive/15"
            role="progressbar"
            aria-valuenow={confirmPct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-success transition-[width] duration-500"
              style={{ width: `${confirmPct}%` }}
            />
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Sua reputação influencia o peso do voto.
      </p>
    </div>
  );
}

function VoteButton({
  type,
  selected,
  count,
  loading,
  onClick,
}: {
  type: "up" | "down";
  selected: boolean;
  count: number;
  loading: boolean;
  onClick: () => void;
}) {
  const Icon = type === "up" ? ThumbsUp : ThumbsDown;
  const label = type === "up" ? "Confirmar golpe" : "Marcar como falso alerta";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={label}
      disabled={loading}
      className={cn(
        "group flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-70",
        selected
          ? type === "up"
            ? "border-success bg-success/10 text-success"
            : "border-destructive bg-destructive/10 text-destructive"
          : "border-border bg-card text-foreground hover:border-primary/40"
      )}
    >
      <Icon
        className={cn(
          "size-7 transition-transform",
          selected ? "scale-110" : "group-hover:scale-105"
        )}
        aria-hidden="true"
      />
      <span className="text-xs font-semibold uppercase tracking-wide">
        {label}
      </span>
      <span className="text-xl font-bold tabular-nums">{count}</span>
    </button>
  );
}
