import { useMemo } from "react";

interface GuillocheOverlayProps {
  className?: string;
  /** stroke color */
  color?: string;
  /** number of concentric guilloche rings */
  rings?: number;
  opacity?: number;
  size?: number;
}

/**
 * GuillocheOverlay — original spirograph (hypotrochoid) line engraving,
 * inspired by currency anti-counterfeit security patterns. Fully generated
 * with math, no copied imagery.
 */
export function GuillocheOverlay({
  className = "",
  color = "currentColor",
  rings = 5,
  opacity = 0.5,
  size = 600,
}: GuillocheOverlayProps) {
  const paths = useMemo(() => {
    const cx = size / 2;
    const cy = size / 2;
    const out: string[] = [];

    for (let ring = 0; ring < rings; ring++) {
      const baseR = (size / 2.4) * (1 - ring * 0.12);
      const R = baseR;
      const r = baseR * (0.28 + ring * 0.05);
      const d = baseR * (0.62 - ring * 0.03);
      const steps = 720;
      let pathData = "";

      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2 * 7; // multiple revolutions for density
        const k = (R - r) / r;
        const x = cx + (R - r) * Math.cos(t) + d * Math.cos(k * t);
        const y = cy + (R - r) * Math.sin(t) - d * Math.sin(k * t);
        pathData += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)} `;
      }
      out.push(pathData);
    }
    return out;
  }, [rings, size]);

  return (
    <svg
      className={className}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-hidden="true"
      style={{ opacity }}
    >
      {paths.map((d, i) => (
        <path
          key={i}
          d={d}
          stroke={color}
          strokeWidth={0.4}
          strokeOpacity={0.55 - i * 0.06}
        />
      ))}
    </svg>
  );
}
