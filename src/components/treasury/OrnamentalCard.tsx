import type { ReactNode } from "react";
import { EngravedBorder } from "./CertificateFrame";
import { GuillocheOverlay } from "./GuillocheOverlay";

interface OrnamentalCardProps {
  children: ReactNode;
  className?: string;
  /** show faint guilloche watermark inside */
  watermark?: boolean;
  accent?: "gold" | "emerald" | "holo";
}

const accentMap = {
  gold: "rgba(214,177,94,0.55)",
  emerald: "rgba(0,184,121,0.5)",
  holo: "rgba(46,168,255,0.5)",
};

/**
 * OrnamentalCard — premium engraved card with layered dark glass, fine-line
 * frame, corner flourishes and optional guilloche watermark. Not a plain card.
 */
export function OrnamentalCard({
  children,
  className = "",
  watermark = true,
  accent = "gold",
}: OrnamentalCardProps) {
  return (
    <div className={`group relative overflow-hidden rounded-xl cert-surface hover-lift ${className}`}>
      {/* top metallic edge */}
      <div
        className="absolute inset-x-6 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accentMap[accent]}, transparent)` }}
      />
      <EngravedBorder color={accentMap[accent]} />

      {/* border light sweep on hover */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
        <div
          className="absolute -inset-y-10 -left-1/3 w-1/3 animate-sweep"
          style={{ background: "linear-gradient(90deg, transparent, rgba(248,247,242,0.08), transparent)" }}
        />
      </div>

      {watermark && (
        <GuillocheOverlay
          className="absolute -bottom-24 -right-24 h-72 w-72 opacity-[0.06] transition-opacity duration-700 group-hover:opacity-[0.12]"
          color={accent === "emerald" ? "#00b879" : accent === "holo" ? "#2ea8ff" : "#d6b15e"}
          rings={4}
          opacity={1}
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
