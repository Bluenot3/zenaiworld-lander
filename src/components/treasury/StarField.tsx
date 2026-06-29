import { useMemo } from "react";

interface StarFieldProps {
  className?: string;
  /** number of stars */
  count?: number;
  /** add a few larger luminous "sovereign" stars */
  feature?: boolean;
  density?: "sparse" | "normal" | "dense";
}

/**
 * StarField — a restrained, deterministic cosmos. Fine pinpoint stars with
 * staggered twinkle plus a handful of larger four-point "sovereign" stars.
 * Deterministic (seeded) so SSR and client render identically. Tasteful,
 * never confetti — this is a treasury night sky, not a screensaver.
 */
export function StarField({
  className = "",
  count = 90,
  feature = true,
  density = "normal",
}: StarFieldProps) {
  const mult = density === "dense" ? 1.4 : density === "sparse" ? 0.6 : 1;
  const n = Math.round(count * mult);

  const stars = useMemo(() => {
    // deterministic pseudo-random
    let seed = 9173;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    return Array.from({ length: n }, () => {
      const r = rand();
      const size = r < 0.86 ? 1 + rand() * 1.1 : 1.8 + rand() * 1.6;
      return {
        x: rand() * 100,
        y: rand() * 100,
        size,
        dur: 2.6 + rand() * 4.2,
        delay: rand() * 6,
        min: 0.06 + rand() * 0.22,
        max: 0.5 + rand() * 0.5,
        warm: rand() > 0.75,
      };
    });
  }, [n]);

  const featured = useMemo(() => {
    if (!feature) return [];
    return [
      { x: 18, y: 22, s: 14 },
      { x: 82, y: 16, s: 10 },
      { x: 68, y: 64, s: 12 },
      { x: 30, y: 76, s: 9 },
    ];
  }, [feature]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: s.warm
                ? "radial-gradient(circle, #fff3c4 0%, rgba(243,209,114,0.5) 60%, transparent 100%)"
                : "radial-gradient(circle, #ffffff 0%, rgba(149,232,255,0.5) 60%, transparent 100%)",
              boxShadow: s.warm
                ? "0 0 6px rgba(243,209,114,0.5)"
                : "0 0 6px rgba(149,232,255,0.45)",
              animation: `twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
              ["--tw-min" as string]: String(s.min),
              ["--tw-max" as string]: String(s.max),
            } as React.CSSProperties
          }
        />
      ))}

      {featured.map((f, i) => (
        <svg
          key={`f${i}`}
          className="absolute"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: f.s,
            height: f.s,
            transform: "translate(-50%, -50%)",
            animation: `twinkle ${5 + i}s ease-in-out ${i * 1.3}s infinite`,
            ["--tw-min" as string]: "0.25",
            ["--tw-max" as string]: "0.95",
          } as React.CSSProperties}
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 0 L13.6 10.4 L24 12 L13.6 13.6 L12 24 L10.4 13.6 L0 12 L10.4 10.4 Z"
            fill="rgba(207,233,255,0.9)"
          />
        </svg>
      ))}
    </div>
  );
}
