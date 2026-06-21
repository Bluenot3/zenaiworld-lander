import type { ReactNode } from "react";

interface EngravedBorderProps {
  className?: string;
  color?: string;
  /** show ornamental corner flourishes */
  corners?: boolean;
}

/**
 * EngravedBorder — fine-line decorative frame with corner flourishes,
 * inspired by turn-of-the-century certificates and bearer bonds.
 */
export function EngravedBorder({
  className = "",
  color = "rgba(214,177,94,0.55)",
  corners = true,
}: EngravedBorderProps) {
  const Corner = ({ style }: { style: React.CSSProperties }) => (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none" className="absolute" style={style} aria-hidden="true">
      <path d="M2 44V14C2 7.4 7.4 2 14 2H44" stroke={color} strokeWidth="1" />
      <path d="M8 44V18C8 12.5 12.5 8 18 8H44" stroke={color} strokeWidth="0.5" opacity="0.6" />
      <circle cx="14" cy="14" r="2.4" stroke={color} strokeWidth="0.8" />
      <circle cx="14" cy="14" r="0.9" fill={color} />
    </svg>
  );

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <div className="absolute inset-[10px] rounded-[inherit] border" style={{ borderColor: color, opacity: 0.5 }} />
      <div className="absolute inset-[14px] rounded-[inherit] border" style={{ borderColor: color, opacity: 0.25 }} />
      {corners && (
        <>
          <Corner style={{ top: 6, left: 6 }} />
          <Corner style={{ top: 6, right: 6, transform: "scaleX(-1)" }} />
          <Corner style={{ bottom: 6, left: 6, transform: "scaleY(-1)" }} />
          <Corner style={{ bottom: 6, right: 6, transform: "scale(-1,-1)" }} />
        </>
      )}
    </div>
  );
}

interface CertificateFrameProps {
  children: ReactNode;
  className?: string;
}

/**
 * CertificateFrame — certificate-grade ornamental container: layered dark glass,
 * engraved border, corner flourishes, inner glow, metallic edging.
 */
export function CertificateFrame({ children, className = "" }: CertificateFrameProps) {
  return (
    <div className={`relative cert-surface rounded-xl ${className}`} style={{ boxShadow: "var(--shadow-cert)" }}>
      {/* metallic top edge */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(214,177,94,0.7), transparent)" }}
      />
      <EngravedBorder />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
