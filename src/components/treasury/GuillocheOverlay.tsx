import { useId, useMemo } from "react";

interface GuillocheOverlayProps {
  className?: string;
  /** stroke color (ignored when gradient is set) */
  color?: string;
  /** number of concentric guilloche rings */
  rings?: number;
  opacity?: number;
  size?: number;
  /** currency-style color-shift gradient stroke */
  gradient?: "gold" | "emerald" | "holo" | "currency" | "none";
  /** base stroke weight */
  weight?: number;
}

const gradientStops: Record<string, [string, string, string]> = {
  gold: ["#9f7a2e", "#d6b15e", "#e8e2d0"],
  emerald: ["#063b2b", "#00b879", "#7de7ff"],
  holo: ["#2ea8ff", "#7de7ff", "#e8e2d0"],
  currency: ["#b9803a", "#00b879", "#2ea8ff"],
};

/**
 * GuillocheOverlay — currency-grade spirograph (hypotrochoid + epitrochoid)
 * rose engraving inspired by banknote anti-counterfeit guilloche. Multiple
 * interleaved curves per ring create dense moiré rosettes. Fully math-generated.
 */
export function GuillocheOverlay({
  className = "",
  color = "currentColor",
  rings = 5,
  opacity = 0.5,
  size = 600,
  gradient = "none",
  weight = 0.5,
}: GuillocheOverlayProps) {
  const gid = useId().replace(/[:]/g, "");

  const paths = useMemo(() => {
    const cx = size / 2;
    const cy = size / 2;
    const out: { d: string; w: number; o: number }[] = [];

    for (let ring = 0; ring < rings; ring++) {
      const baseR = (size / 2.15) * (1 - ring * 0.115);
      // two interleaved curves per ring: a hypotrochoid and a tighter petal rose
      const variants = [
        { R: baseR, r: baseR * (0.26 + ring * 0.04), d: baseR * (0.6 - ring * 0.03), revs: 7, sign: 1 },
        { R: baseR * 0.98, r: baseR * (0.18 + ring * 0.03), d: baseR * (0.5 - ring * 0.02), revs: 11, sign: -1 },
      ];

      variants.forEach((v, vi) => {
        const steps = 900;
        let pathData = "";
        for (let i = 0; i <= steps; i++) {
          const t = (i / steps) * Math.PI * 2 * v.revs;
          const k = (v.R - v.r) / v.r;
          const x = cx + (v.R - v.r) * Math.cos(t) + v.sign * v.d * Math.cos(k * t);
          const y = cy + (v.R - v.r) * Math.sin(t) - v.d * Math.sin(k * t);
          pathData += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)} `;
        }
        out.push({ d: pathData, w: weight * (vi === 0 ? 1 : 0.7), o: 0.6 - ring * 0.06 - vi * 0.08 });
      });
    }
    return out;
  }, [rings, size, weight]);

  const stroke = gradient !== "none" ? `url(#guil-${gid})` : color;
  const stops = gradient !== "none" ? gradientStops[gradient] : null;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-hidden="true"
      style={{ opacity }}
    >
      {stops && (
        <defs>
          <linearGradient id={`guil-${gid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={stops[0]} />
            <stop offset="0.5" stopColor={stops[1]} />
            <stop offset="1" stopColor={stops[2]} />
          </linearGradient>
        </defs>
      )}
      {paths.map((p, i) => (
        <path key={i} d={p.d} stroke={stroke} strokeWidth={p.w} strokeOpacity={Math.max(0.12, p.o)} />
      ))}
    </svg>
  );
}
