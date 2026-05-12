"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton({ fallback = "/" }: { fallback?: string }) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="ghost"
      className="gap-2"
      onClick={() => {
        if (window.history.length > 1) {
          router.back();
        } else {
          router.push(fallback);
        }
      }}
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Voltar
    </Button>
  );
}
