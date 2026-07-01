import { useEffect, useRef, useState } from "react";

/**
 * useCountUp — eases a number from 0 to `end` once `active` becomes true.
 * Uses a cubic ease-out for a premium, decelerating tick. Respects
 * prefers-reduced-motion by snapping to the final value.
 */
export function useCountUp(end: number, active: boolean, duration = 1800) {
  const [value, setValue] = useState(0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValue(end);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(end * eased);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [active, end, duration]);

  return value;
}
