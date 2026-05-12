"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AdminReportActionsProps {
  reportId: string;
  compact?: boolean;
  className?: string;
}

export function AdminReportActions({
  reportId,
  compact = false,
  className,
}: AdminReportActionsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const role = session?.user?.role;
  const canModerate = role === "ADMIN" || role === "MODERATOR";

  if (!canModerate) return null;

  const removeReport = async () => {
    const confirmed = window.confirm("Remover esta denuncia do feed?");
    if (!confirmed || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/moderation/reports/${reportId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "REMOVE",
          reason: "Removida pelo administrador",
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error ?? "Erro ao remover denuncia");
        return;
      }

      toast.success("Denuncia removida");

      if (pathname.startsWith("/denuncia/")) {
        router.push("/feed");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Erro de conexao");
    } finally {
      setLoading(false);
    }
  };

  const button = (
    <button
      type="button"
      onClick={removeReport}
      disabled={loading}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 disabled:pointer-events-none disabled:opacity-60",
        compact && "border border-destructive/30 bg-destructive/5 px-3 py-1.5"
      )}
      aria-label="Remover denuncia"
    >
      <Trash2 className="size-3.5" aria-hidden="true" />
      {loading ? "Removendo..." : "Excluir"}
    </button>
  );

  if (compact) {
    return <div className={className}>{button}</div>;
  }

  return (
    <div className={cn("border-t border-border bg-muted/5 px-5 pb-3", className)}>
      {button}
    </div>
  );
}
