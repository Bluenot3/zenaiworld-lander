import { useId, useMemo } from "react";

interface EngineTurnedFieldProps {
  className?: string;
  color?: string;
  opacity?: number;
  /** number of woven lines */
  lines?: number;
  /** wave amplitude as fraction of height */
  amplitude?: number;
  /** currency-style color-shift gradient stroke */
  gradient?: "gold" | "emerald" | "holo" | "currency" | "none";
  width?: number;
  height?: number;
}

const stopsMap: Record<string, [string, string, string]> = {
  gold: ["#c2782e", "#e3b955", "#f4eed8"],
  emerald: ["#15401f", "#38b96a", "#b6d44a"],
  holo: ["#b6d44a", "#d9e87f", "#f4eed8"],
  currency: ["#c2632a", "#e3b955", "#38b96a"],
};

/**
 * EngineTurnedField — woven "engine-turned" guilloche band: parallel lines
 * modulated by superimposed sine waves, producing the interlaced ribbon
 * texture seen across United States currency backgrounds. Pure SVG.
 */
export function EngineTurnedField({
  className = "",
  color = "currentColor",
  opacity = 0.18,
  lines = 46,
  amplitude = 0.16,
  gradient = "none",
  width = 1200,
  height = 520,
}: EngineTurnedFieldProps) {
  const gid = useId().replace(/[:]/g, "");

  const paths = useMemo(() => {
    const out: string[] = [];
    const steps = 240;
    const amp = height * amplitude;
    for (let li = 0; li < lines; li++) {
      const baseY = (li / (lines - 1)) * height;
      const phase = (li / lines) * Math.PI * 2;
      let d = "";
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * width;
        const u = (i / steps) * Math.PI * 2;
        // superimposed waves create the woven moiré
        const y =
          baseY +
          amp * Math.sin(u * 3 + phase) * 0.55 +
          amp * Math.sin(u * 7 - phase * 1.4) * 0.3 +
          amp * Math.sin(u * 13 + phase * 0.6) * 0.15;
        d += `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)} `;
      }
      out.push(d);
    }
    return out;
  }, [lines, amplitude, width, height]);

  const stroke = gradient !== "none" ? `url(#etf-${gid})` : color;
  const stops = gradient !== "none" ? stopsMap[gradient] : null;

  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      style={{ opacity }}
    >
      {stops && (
        <defs>
          <linearGradient id={`etf-${gid}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={stops[0]} />
            <stop offset="0.5" stopColor={stops[1]} />
            <stop offset="1" stopColor={stops[2]} />
          </linearGradient>
        </defs>
      )}
      {paths.map((d, i) => (
        <path key={i} d={d} stroke={stroke} strokeWidth={0.9} strokeOpacity={0.9} />
      ))}
    </svg>
  );
}
