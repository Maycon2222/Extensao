"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  ShieldPlus,
  FileText,
  User,
  HelpCircle,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const PRIMARY_NAV: NavItem[] = [
  { href: "/feed", label: "Feed", icon: LayoutDashboard },
  { href: "/buscar", label: "Buscar", icon: Search },
  { href: "/denunciar", label: "Denunciar", icon: ShieldPlus },
  { href: "/minhas-denuncias", label: "Minhas denúncias", icon: FileText },
  { href: "/perfil", label: "Perfil", icon: User },
];

const FOOTER_NAV: NavItem[] = [
  { href: "/ajuda", label: "Ajuda", icon: HelpCircle },
  { href: "/sair", label: "Sair", icon: LogOut },
];

interface PlatformSidebarProps {
  onLinkClick?: () => void;
}

export function PlatformSidebar({ onLinkClick }: PlatformSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/feed") return pathname === "/feed";
    return pathname?.startsWith(href);
  };

  return (
    <aside
      className="flex h-full w-full flex-col border-r border-border bg-surface"
      aria-label="Navegacao principal"
    >
      <div className="flex h-16 items-center border-b border-border px-5">
        <Logo size="md" />
      </div>

      <nav
        aria-label="Menu da plataforma"
        className="flex-1 overflow-y-auto p-3"
      >
        <ul className="space-y-1">
          {PRIMARY_NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onLinkClick}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:bg-muted/10 hover:text-foreground"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5 shrink-0 transition-colors",
                      active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border p-3">
        <ul className="space-y-1">
          {FOOTER_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onLinkClick}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted/10 hover:text-foreground"
                >
                  <Icon
                    className="size-5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
