"use client";

import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { FormEvent, useState } from "react";
import { cn, detectIdentifierType } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  /** Tamanho do campo. Hero usa "xl". */
  size?: "md" | "lg" | "xl";
  defaultValue?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  size = "lg",
  defaultValue = "",
  className,
  autoFocus = false,
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/buscar?q=${encodeURIComponent(trimmed)}`);
  };

  const detected = value.trim() ? detectIdentifierType(value) : "unknown";

  const heights = {
    md: "h-12",
    lg: "h-14",
    xl: "h-16",
  };

  const iconSizes = {
    md: "size-5",
    lg: "size-5",
    xl: "size-6",
  };

  const inputSizes = {
    md: "text-sm",
    lg: "text-base",
    xl: "text-base md:text-lg",
  };

  const iconPadding = {
    md: "pl-4",
    lg: "pl-5",
    xl: "pl-5",
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={cn(
        "relative flex w-full items-center gap-2 rounded-2xl border-2 border-border bg-surface px-2 shadow-lg transition-all focus-within:border-primary focus-within:shadow-xl",
        heights[size],
        className
      )}
    >
      <Search
        className={cn(
          "shrink-0 text-muted-foreground",
          iconSizes[size],
          iconPadding[size]
        )}
        style={{ paddingLeft: undefined }}
        aria-hidden="true"
      />

      <input
        type="text"
        inputMode="search"
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cole um link, telefone ou CNPJ suspeito..."
        aria-label="Buscar link, telefone ou CNPJ"
        autoFocus={autoFocus}
        enterKeyHint="search"
        autoComplete="off"
        spellCheck={false}
        className={cn(
          "min-w-0 flex-1 bg-transparent py-2 text-foreground placeholder:text-muted-foreground/70 focus:outline-none [appearance:none] [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden",
          inputSizes[size]
        )}
      />

      {detected !== "unknown" && value.trim().length > 3 && (
        <span
          className="hidden shrink-0 items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold uppercase text-primary md:inline-flex"
          aria-label={`Tipo detectado: ${detected}`}
        >
          {detected === "phone"
            ? "telefone"
            : detected === "cnpj"
            ? "CNPJ"
            : "URL"}
        </span>
      )}

      <Button
        type="submit"
        size={size === "xl" ? "lg" : size === "md" ? "sm" : "default"}
        className="shrink-0 gap-2 rounded-xl"
        disabled={!value.trim()}
      >
        <span className="hidden sm:inline">Verificar</span>
        <ArrowRight aria-hidden="true" />
      </Button>
    </form>
  );
}
