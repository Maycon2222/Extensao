"use client";

import Link from "next/link";
import { Menu, Bell, ShieldPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchBar } from "@/components/search-bar";
import { UserMenu } from "@/components/user-menu";

interface PlatformTopbarProps {
  onMenuClick?: () => void;
}

export function PlatformTopbar({ onMenuClick }: PlatformTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Abrir menu de navegacao"
        className="flex size-10 items-center justify-center rounded-lg text-foreground hover:bg-muted/10 lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <div className="mx-auto hidden w-full max-w-lg md:block">
        <SearchBar size="md" />
      </div>

      <div className="ml-auto flex items-center gap-1.5 md:ml-0">
        <ThemeToggle />

        <Button variant="ghost" size="icon" aria-label="Notificações">
          <Bell className="size-5" aria-hidden="true" />
        </Button>

        <Link href="/denunciar" className="hidden md:block">
          <Button size="sm" className="gap-1.5">
            <ShieldPlus className="size-4" aria-hidden="true" />
            <span>Nova denúncia</span>
          </Button>
        </Link>

        <UserMenu variant="topbar" />
      </div>
    </header>
  );
}
