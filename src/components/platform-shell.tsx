"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { PlatformSidebar } from "@/components/platform-sidebar";
import { PlatformTopbar } from "@/components/platform-topbar";
import { cn } from "@/lib/utils";

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-dvh">
      {/* Sidebar desktop */}
      <div className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-64">
          <PlatformSidebar />
        </div>
      </div>

      {/* Sidebar mobile (drawer) */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegacao"
        >
          <button
            type="button"
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
          />
          <div
            className={cn(
              "absolute inset-y-0 left-0 w-72 max-w-[80vw] shadow-2xl",
              "animate-[fade-in_0.2s_ease-out]"
            )}
          >
            <PlatformSidebar onLinkClick={() => setMobileOpen(false)} />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Fechar menu"
              className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-muted/10 text-foreground"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <PlatformTopbar onMenuClick={() => setMobileOpen(true)} />
        <main id="conteudo-principal" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
