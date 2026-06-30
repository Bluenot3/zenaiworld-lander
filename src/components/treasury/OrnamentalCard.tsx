import type { ReactNode } from "react";
import { EngravedBorder } from "./CertificateFrame";
import guillocheSeal from "@/assets/guilloche-seal.png";

interface OrnamentalCardProps {
  children: ReactNode;
  className?: string;
  /** show faint guilloche watermark inside */
  watermark?: boolean;
  accent?: "gold" | "emerald" | "holo";
}

const accentMap = {
  gold: "rgba(227,185,85,0.55)",
  emerald: "rgba(56,185,106,0.5)",
  holo: "rgba(182,212,74,0.5)",
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
        <img
          src={guillocheSeal}
          alt=""
          aria-hidden="true"
          width={1024}
          height={1024}
          loading="lazy"
          className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 max-w-none animate-spin-slow opacity-[0.08] mix-blend-screen transition-opacity duration-700 group-hover:opacity-[0.16]"
        />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
