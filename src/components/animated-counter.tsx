"use client";

import { useEffect, useRef, useState } from "react";
import { formatCompactNumber } from "@/lib/utils";

interface AnimatedCounterProps {
  /** Valor final do contador. */
  target: number;
  /** Duracao da animacao em ms. */
  duration?: number;
  /** Delay antes de comecar (ms). */
  delay?: number;
  /** Formatador customizado; por padrão usa formatCompactNumber. */
  format?: (n: number) => string;
  className?: string;
}

export function AnimatedCounter({
  target,
  duration = 1600,
  delay = 0,
  format = formatCompactNumber,
  className,
}: AnimatedCounterProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respeita prefers-reduced-motion: pula direto ao valor final
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      setValue(target);
      animatedRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;
            animate();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(node);

    function animate() {
      const startTime = performance.now() + delay;
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

      const tick = (now: number) => {
        if (now < startTime) {
          requestAnimationFrame(tick);
          return;
        }
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutCubic(progress);
        setValue(Math.round(eased * target));

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    }

    return () => observer.disconnect();
  }, [target, duration, delay]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
