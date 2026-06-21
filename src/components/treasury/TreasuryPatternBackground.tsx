import { GuillocheOverlay } from "./GuillocheOverlay";
import { SecurityLinePattern } from "./SecurityLinePattern";

interface TreasuryPatternBackgroundProps {
  className?: string;
  /** intensity preset */
  variant?: "hero" | "section" | "subtle";
  /** show a centered guilloche watermark */
  watermark?: boolean;
}

/**
 * TreasuryPatternBackground — layered treasury background system combining
 * radial engraving waves, ornamental grids, guilloche watermarks and glow.
 */
export function TreasuryPatternBackground({
  className = "",
  variant = "section",
  watermark = true,
}: TreasuryPatternBackgroundProps) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            variant === "hero"
              ? "radial-gradient(120% 80% at 50% -10%, rgba(0,184,121,0.1), transparent 55%), radial-gradient(90% 70% at 80% 20%, rgba(46,168,255,0.1), transparent 55%), linear-gradient(165deg, #07111f 0%, #05070a 80%)"
              : "linear-gradient(165deg, #060d18 0%, #05070a 90%)",
        }}
      />

      {/* radial engraving waves */}
      <SecurityLinePattern
        variant="wave"
        color="#d6b15e"
        opacity={variant === "hero" ? 0.1 : 0.06}
        className="absolute -right-1/4 -top-1/3 h-[140%] w-[140%] text-zen-gold"
      />

      {/* fine ornamental grid */}
      <SecurityLinePattern
        variant="grid"
        color="#00b879"
        opacity={0.05}
        className="absolute inset-0 h-full w-full"
      />

      {/* micro security lines */}
      <SecurityLinePattern
        variant="lines"
        color="#2ea8ff"
        opacity={0.04}
        className="absolute inset-0 h-full w-full"
      />

      {watermark && (
        <GuillocheOverlay
          className="absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 text-zen-gold"
          color="#d6b15e"
          rings={6}
          opacity={variant === "hero" ? 0.12 : 0.07}
        />
      )}

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(120% 120% at 50% 40%, transparent 55%, rgba(5,7,10,0.85) 100%)" }}
      />
    </div>
  );
}
