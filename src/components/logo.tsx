import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  href?: string;
}

export function Logo({
  size = "md",
  showText = true,
  className,
  href = "/",
}: LogoProps) {
  const iconSize = { sm: 28, md: 36, lg: 48 }[size];
  const textSize = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }[size];

  const content = (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Shield outer */}
        <path
          d="M20 3L5 8v11c0 9.5 6.5 16.5 15 18 8.5-1.5 15-8.5 15-18V8L20 3z"
          fill="hsl(var(--primary))"
        />
        {/* Inner eye/shield motif */}
        <path
          d="M20 12c-4 0-7.5 2.5-9 7 1.5 4.5 5 7 9 7s7.5-2.5 9-7c-1.5-4.5-5-7-9-7z"
          fill="hsl(var(--secondary))"
          opacity="0.9"
        />
        <circle cx="20" cy="19" r="3" fill="hsl(var(--primary-foreground))" />
      </svg>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn("font-display font-extrabold tracking-tight text-foreground", textSize)}>
            OPA
          </span>
          {size !== "sm" && (
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted">
              Observatório Antifraude
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="OPA - Página inicial"
      >
        {content}
      </Link>
    );
  }

  return content;
}
