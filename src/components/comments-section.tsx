"use client";

import { useEffect, useState, FormEvent } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/utils";

interface CommentItem {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    reputationTier: "BRONZE" | "PRATA" | "OURO" | "DIAMANTE";
  };
}

const TIER_LABEL = {
  BRONZE: "Bronze",
  PRATA: "Prata",
  OURO: "Ouro",
  DIAMANTE: "Diamante",
};

export function CommentsSection({
  reportId,
  initialCount = 0,
}: {
  reportId: string;
  initialCount?: number;
}) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/reports/${reportId}/comments`);
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        if (!cancelled) setComments(data.items ?? []);
      } catch {
        // API indisponivel — mostra estado vazio
        if (!cancelled) setComments([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [reportId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Entre para comentar");
      return;
    }
    if (content.trim().length < 5) {
      toast.error("Comentário muito curto");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/reports/${reportId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Erro ao publicar comentário");
        return;
      }

      setComments((prev) => [data, ...prev]);
      setContent("");
      toast.success("Comentário publicado");
    } catch (err) {
      console.error(err);
      toast.error("Erro de conexão");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="size-9 shrink-0 animate-pulse rounded-full bg-muted/20" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 animate-pulse rounded bg-muted/20" />
                <div className="h-4 w-full animate-pulse rounded bg-muted/20" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">
          {initialCount > 0
            ? `Há ${initialCount} comentário${initialCount > 1 ? "s" : ""} registrado${initialCount > 1 ? "s" : ""}, mas eles não estão carregados neste modo de demonstração.`
            : "Seja o primeiro a comentar."}
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <article key={c.id} className="flex gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-primary-foreground">
                {c.author.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-foreground">
                    @{c.author.username}
                  </span>
                  <span className="rounded-full bg-muted/15 px-1.5 py-0.5 text-[10px] font-bold uppercase">
                    {TIER_LABEL[c.author.reputationTier]}
                  </span>
                  <span className="text-muted-foreground">
                    · {timeAgo(c.createdAt)}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {c.content}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

      {session?.user ? (
        <form
          onSubmit={handleSubmit}
          className="flex gap-2 border-t border-border pt-5"
        >
          <textarea
            rows={2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Adicione um comentário respeitoso..."
            className="flex-1 resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-ring"
            maxLength={500}
          />
          <Button size="sm" type="submit" disabled={submitting}>
            {submitting ? "..." : "Publicar"}
          </Button>
        </form>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          <Link
            href="/entrar"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Entre
          </Link>{" "}
          para comentar.
        </div>
      )}
    </div>
  );
}
