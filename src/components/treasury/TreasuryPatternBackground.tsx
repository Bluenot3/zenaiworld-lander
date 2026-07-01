import { GuillocheOverlay } from "./GuillocheOverlay";
import { EngineTurnedField } from "./EngineTurnedField";
import { SecurityLinePattern } from "./SecurityLinePattern";
import { StarField } from "./StarField";
import { FederalSeal } from "./FederalSeal";
import guillocheSeal from "@/assets/guilloche-seal.png";

interface TreasuryPatternBackgroundProps {
  className?: string;
  /** intensity preset */
  variant?: "hero" | "section" | "subtle";
  /** show a centered guilloche watermark */
  watermark?: boolean;
  /** overlay a restrained starfield cosmos */
  stars?: boolean;
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
  stars,
}: TreasuryPatternBackgroundProps) {
  const hero = variant === "hero";
  const showStars = stars ?? hero;
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: hero
            ? "radial-gradient(130% 90% at 50% -10%, rgba(69,220,174,0.20), transparent 55%), radial-gradient(80% 70% at 82% 22%, rgba(149,232,255,0.18), transparent 55%), radial-gradient(80% 70% at 14% 78%, rgba(246,150,79,0.14), transparent 60%), linear-gradient(165deg, rgba(14,44,52,0.42) 0%, rgba(8,25,30,0.68) 82%)"
            : "radial-gradient(90% 70% at 80% 0%, rgba(149,232,255,0.10), transparent 55%), radial-gradient(80% 70% at 12% 90%, rgba(69,220,174,0.10), transparent 58%), linear-gradient(165deg, rgba(12,38,48,0.34) 0%, rgba(8,25,30,0.56) 92%)",
        }}
      />

      {/* cosmos */}
      {showStars && <StarField count={hero ? 110 : 70} density={hero ? "normal" : "sparse"} />}

      {/* engine-turned woven band — top */}
      <EngineTurnedField
        gradient="currency"
        opacity={hero ? 0.4 : 0.24}
        lines={hero ? 56 : 42}
        className="absolute -top-10 left-0 h-[58%] w-full"
      />
      {/* engine-turned woven band — bottom, mirrored (warm gold tone) */}
      <EngineTurnedField
        gradient="currency"
        opacity={hero ? 0.22 : 0.12}
        lines={46}
        amplitude={0.2}
        className="absolute -bottom-10 left-0 h-[58%] w-full -scale-y-100"
      />

      {/* radial engraving waves */}
      <SecurityLinePattern
        variant="wave"
        color="#f3d172"
        opacity={hero ? 0.18 : 0.11}
        className="absolute -right-1/4 -top-1/3 h-[150%] w-[150%]"
      />

      {/* fine ornamental grid */}
      <SecurityLinePattern variant="grid" color="#d8c486" opacity={0.04} className="absolute inset-0 h-full w-full" />

      {/* large crisp guilloche seal watermark (static — no spin) */}
      {watermark && (
        <>
          <img
            src={guillocheSeal}
            alt=""
            aria-hidden="true"
            width={1024}
            height={1024}
            className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
            style={{
              width: hero ? "780px" : "560px",
              height: hero ? "780px" : "560px",
              opacity: hero ? 0.42 : 0.2,
            }}
          />
          {/* official federal / treasury seal watermark */}
          <FederalSeal
            size={hero ? 640 : 460}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
            opacity={hero ? 0.3 : 0.16}
          />
          <GuillocheOverlay
            gradient="holo"
            className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2"
            rings={5}
            opacity={hero ? 0.34 : 0.16}
            weight={0.9}
          />
        </>
      )}


      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(125% 125% at 50% 45%, transparent 62%, rgba(6,18,22,0.72) 100%)" }}
      />
    </div>
  );
}
