"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { User, LogOut, Settings, ShieldPlus, LayoutDashboard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function UserMenu({ variant = "desktop" }: { variant?: "desktop" | "topbar" }) {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (status === "loading") {
    return <div className="size-10 animate-pulse rounded-full bg-muted/30" />;
  }

  if (!session?.user) {
    // não autenticado
    return variant === "topbar" ? null : (
      <div className="flex items-center gap-2">
        <Link href="/entrar" className="hidden sm:block">
          <Button variant="ghost" size="sm">
            Entrar
          </Button>
        </Link>
        <Link href="/cadastrar">
          <Button size="sm">Cadastrar</Button>
        </Link>
      </div>
    );
  }

  const initials = getInitials(session.user.name ?? "U");

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu do usuário"
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "flex items-center gap-2 rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          variant === "desktop" && "rounded-lg px-2 py-1 hover:bg-muted/10"
        )}
      >
        <div
          className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-primary-foreground shadow-sm"
          aria-hidden="true"
        >
          {initials}
        </div>
        {variant === "desktop" && (
          <>
            <span className="hidden text-sm font-medium md:inline">
              {session.user.name?.split(" ")[0]}
            </span>
            <ChevronDown
              className={cn(
                "hidden size-4 text-muted-foreground transition-transform md:inline",
                open && "rotate-180"
              )}
              aria-hidden="true"
            />
          </>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-border bg-popover shadow-lg animate-fade-in"
        >
          <div className="border-b border-border p-4">
            <p className="truncate text-sm font-semibold">
              {session.user.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              @{session.user.username}
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
              {session.user.reputationTier}
            </div>
          </div>

          <ul className="py-2">
            <MenuLink
              href="/feed"
              icon={LayoutDashboard}
              label="Feed"
              onClick={() => setOpen(false)}
            />
            <MenuLink
              href="/perfil"
              icon={User}
              label="Meu perfil"
              onClick={() => setOpen(false)}
            />
            <MenuLink
              href="/denunciar"
              icon={ShieldPlus}
              label="Nova denúncia"
              onClick={() => setOpen(false)}
            />
            <MenuLink
              href="/configuracoes"
              icon={Settings}
              label="Configurações"
              onClick={() => setOpen(false)}
            />
          </ul>

          <div className="border-t border-border p-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  label,
  onClick,
}: {
  href: string;
  icon: typeof User;
  label: string;
  onClick?: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        role="menuitem"
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-2 text-sm text-foreground/80 transition-colors hover:bg-muted/10 hover:text-foreground"
      >
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
        {label}
      </Link>
    </li>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
