"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative"
    >
      <Sun
        aria-hidden="true"
        className={`size-5 transition-all ${
          mounted && isDark ? "scale-0 -rotate-90" : "scale-100 rotate-0"
        }`}
      />
      <Moon
        aria-hidden="true"
        className={`absolute size-5 transition-all ${
          mounted && isDark ? "scale-100 rotate-0" : "scale-0 rotate-90"
        }`}
      />
    </Button>
  );
}
