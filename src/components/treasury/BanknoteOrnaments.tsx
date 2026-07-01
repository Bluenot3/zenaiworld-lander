import { useId } from "react";

/**
 * NoteNumeral — an engraved corner denomination cartouche in the language of
 * United States Federal Reserve notes: a value glyph set inside a fine
 * guilloche rosette medallion. Decorative only.
 */
export function NoteNumeral({
  value = "Z",
  size = 96,
  color = "#f3d172",
  className = "",
  opacity = 0.9,
}: {
  value?: string;
  size?: number;
  color?: string;
  className?: string;
  opacity?: number;
}) {
  const gid = useId().replace(/[:]/g, "");
  const cx = size / 2;
  const cy = size / 2;
  // fine radial guilloche petals
  const petals = 48;
  const rings = [0.46, 0.4, 0.33];

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
        <linearGradient id={`nn-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6964f" />
          <stop offset="0.5" stopColor={color} />
          <stop offset="1" stopColor="#fcf6e6" />
        </linearGradient>
      </defs>

      {/* medallion rings */}
      {rings.map((r, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={size * r}
          stroke={`url(#nn-${gid})`}
          strokeWidth={i === 0 ? 1.4 : 0.7}
          strokeOpacity={0.8 - i * 0.15}
        />
      ))}

      {/* radial petal engraving */}
      {Array.from({ length: petals }, (_, i) => {
        const a = (i / petals) * Math.PI * 2;
        const r1 = size * 0.4;
        const r2 = size * 0.46;
        const x1 = cx + r1 * Math.cos(a);
        const y1 = cy + r1 * Math.sin(a);
        const x2 = cx + r2 * Math.cos(a);
        const y2 = cy + r2 * Math.sin(a);
        return (
          <path
            key={`p${i}`}
            d={`M${x1.toFixed(2)} ${y1.toFixed(2)} L${x2.toFixed(2)} ${y2.toFixed(2)}`}
            stroke={`url(#nn-${gid})`}
            strokeWidth={0.7}
            strokeOpacity={0.55}
          />
        );
      })}

      {/* value glyph */}
      <text
        x={cx}
        y={cy + 1}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="'Cormorant Garamond', serif"
        fontWeight={600}
        fontSize={size * 0.34}
        fill={`url(#nn-${gid})`}
      >
        {value}
      </text>
    </svg>
  );
}

/**
 * SerialStrip — a treasury serial-number style strip (letter-prefix, digits,
 * block letter) rendered in engraving mono, evoking the printed serials on
 * banknotes. Decorative only.
 */
export function SerialStrip({
  serial = "ZEN · A 00000001 K · SERIES MMXXVI",
  className = "",
  color = "rgba(243,209,114,0.75)",
}: {
  serial?: string;
  className?: string;
  color?: string;
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 font-mono uppercase ${className}`}
      style={{
        color,
        fontSize: "0.62rem",
        letterSpacing: "0.32em",
      }}
      aria-hidden="true"
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: "var(--grad-gold-platinum)" }}
      />
      {serial}
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: "var(--grad-gold-platinum)" }}
      />
    </div>
  );
}

/**
 * NoteCornerFrame — places four engraved denomination cartouches in the
 * corners of a container, the way currency denominations sit on a banknote.
 */
export function NoteCornerFrame({
  value = "Z",
  size = 72,
  className = "",
  inset = 18,
  opacity = 0.5,
}: {
  value?: string;
  size?: number;
  className?: string;
  inset?: number;
  opacity?: number;
}) {
  const positions = [
    { top: inset, left: inset },
    { top: inset, right: inset },
    { bottom: inset, left: inset },
    { bottom: inset, right: inset },
  ];
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    >
      {positions.map((pos, i) => (
        <NoteNumeral
          key={i}
          value={value}
          size={size}
          opacity={opacity}
          className="absolute mix-blend-screen"
          // @ts-expect-error style positions
          style={pos}
        />
      ))}
    </div>
  );
}
