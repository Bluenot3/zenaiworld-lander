import { GuillocheOverlay } from "./GuillocheOverlay";
import { EngineTurnedField } from "./EngineTurnedField";
import { SecurityLinePattern } from "./SecurityLinePattern";

interface TreasuryPatternBackgroundProps {
  className?: string;
  /** intensity preset */
  variant?: "hero" | "section" | "subtle";
  /** show a centered guilloche watermark */
  watermark?: boolean;
}

/**
 * TreasuryPatternBackground — layered currency-grade background system:
 * engine-turned woven bands, dense guilloche rosettes, ornamental grids,
 * color-shifting glow and vignette. Designed to read like the intaglio
 * printing on United States banknotes, reimagined for ZEN.
 */
export function TreasuryPatternBackground({
  className = "",
  variant = "section",
  watermark = true,
}: TreasuryPatternBackgroundProps) {
  const hero = variant === "hero";
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: hero
            ? "radial-gradient(130% 90% at 50% -10%, rgba(56,185,106,0.20), transparent 55%), radial-gradient(80% 70% at 82% 22%, rgba(232,137,58,0.20), transparent 55%), radial-gradient(80% 70% at 14% 78%, rgba(182,212,74,0.16), transparent 60%), linear-gradient(165deg, #11280f 0%, #0a1207 82%)"
            : "radial-gradient(90% 70% at 80% 0%, rgba(232,137,58,0.10), transparent 55%), radial-gradient(80% 70% at 12% 90%, rgba(56,185,106,0.10), transparent 58%), linear-gradient(165deg, #0e210f 0%, #0a1207 92%)",
        }}
      />

      {/* engine-turned woven band — top */}
      <EngineTurnedField
        gradient="currency"
        opacity={hero ? 0.4 : 0.24}
        lines={hero ? 56 : 42}
        className="absolute -top-10 left-0 h-[58%] w-full"
      />
      {/* engine-turned woven band — bottom, mirrored */}
      <EngineTurnedField
        gradient="emerald"
        opacity={hero ? 0.3 : 0.18}
        lines={46}
        amplitude={0.2}
        className="absolute -bottom-10 left-0 h-[58%] w-full -scale-y-100"
      />

      {/* radial engraving waves */}
      <SecurityLinePattern
        variant="wave"
        color="#d6b15e"
        opacity={hero ? 0.16 : 0.1}
        className="absolute -right-1/4 -top-1/3 h-[150%] w-[150%]"
      />

      {/* fine ornamental grid */}
      <SecurityLinePattern variant="grid" color="#00b879" opacity={0.05} className="absolute inset-0 h-full w-full" />

      {/* large color-shifting guilloche rosette */}
      {watermark && (
        <>
          <GuillocheOverlay
            gradient="currency"
            className="absolute left-1/2 top-1/2 h-[860px] w-[860px] -translate-x-1/2 -translate-y-1/2 animate-spin-slow"
            rings={8}
            opacity={hero ? 0.6 : 0.34}
            weight={1.1}
          />
          <GuillocheOverlay
            gradient="holo"
            className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 animate-spin-reverse"
            rings={5}
            opacity={hero ? 0.5 : 0.24}
            weight={0.9}
          />
        </>
      )}

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(125% 125% at 50% 45%, transparent 62%, rgba(5,7,10,0.82) 100%)" }}
      />
    </div>
  );
}
