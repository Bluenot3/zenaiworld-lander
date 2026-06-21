interface SecurityLinePatternProps {
  className?: string;
  color?: string;
  opacity?: number;
  /** "wave" radial engraving, "grid" fine ornamental grid, "lines" parallel micro-lines */
  variant?: "wave" | "grid" | "lines";
}

/**
 * SecurityLinePattern — fine engraved line textures used as background layers.
 * Pure SVG, original abstract security-line language.
 */
export function SecurityLinePattern({
  className = "",
  color = "currentColor",
  opacity = 0.18,
  variant = "wave",
}: SecurityLinePatternProps) {
  if (variant === "grid") {
    return (
      <svg className={className} aria-hidden="true" style={{ opacity }}>
        <defs>
          <pattern id="zen-fine-grid" width="36" height="36" patternUnits="userSpaceOnUse">
            <path d="M36 0H0V36" fill="none" stroke={color} strokeWidth="0.4" />
            <circle cx="0" cy="0" r="0.9" fill={color} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#zen-fine-grid)" />
      </svg>
    );
  }

  if (variant === "lines") {
    return (
      <svg className={className} aria-hidden="true" style={{ opacity }}>
        <defs>
          <pattern id="zen-micro-lines" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="7" stroke={color} strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#zen-micro-lines)" />
      </svg>
    );
  }

  // wave — concentric radial engraving
  const rings = Array.from({ length: 60 }, (_, i) => 14 + i * 13);
  return (
    <svg className={className} viewBox="0 0 800 800" aria-hidden="true" style={{ opacity }}>
      <g transform="translate(400 400)">
        {rings.map((r, i) => (
          <ellipse
            key={i}
            rx={r}
            ry={r * 0.62}
            fill="none"
            stroke={color}
            strokeWidth={0.4}
            transform={`rotate(${i * 1.4})`}
          />
        ))}
      </g>
    </svg>
  );
}
