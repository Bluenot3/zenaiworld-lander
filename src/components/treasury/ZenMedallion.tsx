import { useMemo } from "react";

interface ZenMedallionProps {
  className?: string;
  size?: number;
  /** glyph in center: "zen", "node", "shield", "verify" */
  glyph?: "zen" | "node" | "shield" | "verify";
  spin?: boolean;
}

/**
 * ZenMedallion — original ornamental seal / rosette inspired by treasury
 * medallions and credential badges. Abstract, non-official.
 */
export function ZenMedallion({
  className = "",
  size = 200,
  glyph = "zen",
  spin = false,
}: ZenMedallionProps) {
  const c = size / 2;

  const rosette = useMemo(() => {
    const petals = 48;
    const r1 = size * 0.46;
    const r2 = size * 0.4;
    let d = "";
    for (let i = 0; i <= petals; i++) {
      const a = (i / petals) * Math.PI * 2;
      const wobble = i % 2 === 0 ? r1 : r2;
      const x = c + Math.cos(a) * wobble;
      const y = c + Math.sin(a) * wobble;
      d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    return d + "Z";
  }, [size, c]);

  const teeth = useMemo(() => {
    const n = 72;
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      const inner = size * 0.34;
      const outer = size * 0.385;
      return {
        x1: c + Math.cos(a) * inner,
        y1: c + Math.sin(a) * inner,
        x2: c + Math.cos(a) * outer,
        y2: c + Math.sin(a) * outer,
      };
    });
  }, [size, c]);

  return (
    <svg
      className={`${className} ${spin ? "animate-spin-slow" : ""}`}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="zm-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c2782e" />
          <stop offset="0.5" stopColor="#e3b955" />
          <stop offset="1" stopColor="#f4eed8" />
        </linearGradient>
        <linearGradient id="zm-emerald" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38b96a" />
          <stop offset="0.5" stopColor="#b6d44a" />
          <stop offset="1" stopColor="#e3b955" />
        </linearGradient>
      </defs>

      <path d={rosette} stroke="url(#zm-gold)" strokeWidth="0.8" opacity="0.55" />
      <circle cx={c} cy={c} r={size * 0.42} stroke="url(#zm-gold)" strokeWidth="1" opacity="0.7" />
      <circle cx={c} cy={c} r={size * 0.39} stroke="url(#zm-gold)" strokeWidth="0.5" opacity="0.45" />
      {teeth.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="url(#zm-gold)" strokeWidth="0.8" opacity="0.5" />
      ))}
      <circle cx={c} cy={c} r={size * 0.3} stroke="url(#zm-emerald)" strokeWidth="0.8" opacity="0.6" />

      {/* Center glyph */}
      <g stroke="url(#zm-emerald)" strokeWidth={size * 0.012} strokeLinecap="round" strokeLinejoin="round" fill="none">
        {glyph === "zen" && (
          <>
            <path d={`M${c - size * 0.1} ${c - size * 0.12} H${c + size * 0.1} L${c - size * 0.1} ${c + size * 0.12} H${c + size * 0.1}`} />
          </>
        )}
        {glyph === "node" && (
          <>
            <circle cx={c} cy={c} r={size * 0.05} fill="url(#zm-emerald)" stroke="none" />
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const a = (i / 6) * Math.PI * 2;
              return (
                <g key={i}>
                  <line x1={c} y1={c} x2={c + Math.cos(a) * size * 0.18} y2={c + Math.sin(a) * size * 0.18} />
                  <circle cx={c + Math.cos(a) * size * 0.18} cy={c + Math.sin(a) * size * 0.18} r={size * 0.022} fill="url(#zm-gold)" stroke="none" />
                </g>
              );
            })}
          </>
        )}
        {glyph === "shield" && (
          <path d={`M${c} ${c - size * 0.16} L${c + size * 0.12} ${c - size * 0.08} V${c + size * 0.04} Q${c + size * 0.12} ${c + size * 0.16} ${c} ${c + size * 0.2} Q${c - size * 0.12} ${c + size * 0.16} ${c - size * 0.12} ${c + size * 0.04} V${c - size * 0.08} Z`} />
        )}
        {glyph === "verify" && (
          <path d={`M${c - size * 0.1} ${c} L${c - size * 0.02} ${c + size * 0.09} L${c + size * 0.12} ${c - size * 0.11}`} />
        )}
      </g>
    </svg>
  );
}
