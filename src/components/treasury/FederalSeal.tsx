import { useId, useMemo } from "react";

interface FederalSealProps {
  className?: string;
  size?: number;
  /** circular legend text around the rim */
  legend?: string;
  /** ink color for the engraving */
  color?: string;
  opacity?: number;
}

/**
 * FederalSeal — an official-looking seal in the language of United States
 * Treasury / Federal Reserve currency engraving: a denticled (toothed) outer
 * rim, a circular microtext legend, a ring of stars, concentric guilloche
 * rosettes and a central ZEN monogram. Fully math/SVG generated, no spin.
 */
export function FederalSeal({
  className = "",
  size = 360,
  legend = "ZEN SOVEREIGN INTELLIGENCE TREASURY \u00B7 FEDERAL RESERVE OF ARTIFICIAL MIND \u00B7 ",
  color = "#f3d172",
  opacity = 1,
}: FederalSealProps) {
  const gid = useId().replace(/[:]/g, "");
  const cx = size / 2;
  const cy = size / 2;

  // denticles (toothed coin edge)
  const denticles = useMemo(() => {
    const n = 120;
    const rOuter = size * 0.485;
    const rInner = size * 0.46;
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      const x1 = cx + rOuter * Math.cos(a);
      const y1 = cy + rOuter * Math.sin(a);
      const x2 = cx + rInner * Math.cos(a);
      const y2 = cy + rInner * Math.sin(a);
      return `M${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)}`;
    });
  }, [size, cx, cy]);

  // star ring
  const stars = useMemo(() => {
    const n = 13;
    const r = size * 0.345;
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2;
      return {
        x: Math.round((cx + r * Math.cos(a)) * 1000) / 1000,
        y: Math.round((cy + r * Math.sin(a)) * 1000) / 1000,
      };
    });
  }, [size, cx, cy]);

  // concentric guilloche rosette (center)
  const rosette = useMemo(() => {
    const out: string[] = [];
    const rings = 3;
    for (let ring = 0; ring < rings; ring++) {
      const R = size * (0.255 - ring * 0.05);
      const r = R * (0.32 + ring * 0.05);
      const d = R * (0.55 - ring * 0.04);
      const revs = 9 + ring * 4;
      const steps = 760;
      let path = "";
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2 * revs;
        const k = (R - r) / r;
        const x = cx + (R - r) * Math.cos(t) + d * Math.cos(k * t);
        const y = cy + (R - r) * Math.sin(t) - d * Math.sin(k * t);
        path += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)} `;
      }
      out.push(path);
    }
    return out;
  }, [size, cx, cy]);

  const rimText = size * 0.41;

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-hidden="true"
      style={{ opacity }}
    >
      <defs>
        <linearGradient id={`fs-gold-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6964f" />
          <stop offset="0.5" stopColor={color} />
          <stop offset="1" stopColor="#fcf6e6" />
        </linearGradient>
        <path
          id={`fs-rim-${gid}`}
          d={`M ${cx} ${cy} m -${rimText} 0 a ${rimText} ${rimText} 0 1 1 ${rimText * 2} 0 a ${rimText} ${rimText} 0 1 1 -${rimText * 2} 0`}
        />
      </defs>

      {/* outer rings */}
      <circle cx={cx} cy={cy} r={size * 0.485} stroke={`url(#fs-gold-${gid})`} strokeWidth={2.6} strokeOpacity={1} />
      <circle cx={cx} cy={cy} r={size * 0.455} stroke={`url(#fs-gold-${gid})`} strokeWidth={1.3} strokeOpacity={0.85} />

      {/* denticles */}
      {denticles.map((d, i) => (
        <path key={i} d={d} stroke={`url(#fs-gold-${gid})`} strokeWidth={1.6} strokeOpacity={0.7} />
      ))}

      {/* circular microtext legend */}
      <text
        fontFamily="'JetBrains Mono', monospace"
        fontSize={size * 0.03}
        letterSpacing={size * 0.006}
        fill={color}
        fillOpacity={0.95}
      >
        <textPath href={`#fs-rim-${gid}`} startOffset="0">
          {legend.repeat(3)}
        </textPath>
      </text>

      {/* inner boundary for star ring */}
      <circle cx={cx} cy={cy} r={size * 0.375} stroke={`url(#fs-gold-${gid})`} strokeWidth={1} strokeOpacity={0.65} />

      {/* star ring */}
      {stars.map((s, i) => (
        <path
          key={`s${i}`}
          d={`M${s.x} ${s.y - size * 0.018} L${s.x + size * 0.0055} ${s.y - size * 0.0055} L${s.x + size * 0.018} ${s.y} L${s.x + size * 0.0055} ${s.y + size * 0.0055} L${s.x} ${s.y + size * 0.018} L${s.x - size * 0.0055} ${s.y + size * 0.0055} L${s.x - size * 0.018} ${s.y} L${s.x - size * 0.0055} ${s.y - size * 0.0055} Z`}
          fill={color}
          fillOpacity={0.9}
        />
      ))}

      {/* center guilloche rosette */}
      {rosette.map((d, i) => (
        <path key={`r${i}`} d={d} stroke={`url(#fs-gold-${gid})`} strokeWidth={0.9} strokeOpacity={0.7 - i * 0.1} />
      ))}


      {/* center monogram */}
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Cormorant Garamond', serif"
        fontWeight={600}
        fontSize={size * 0.12}
        fill={`url(#fs-gold-${gid})`}
      >
        Z
      </text>
    </svg>
  );
}
