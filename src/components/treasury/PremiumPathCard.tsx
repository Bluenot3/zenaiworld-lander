import type { ReactNode } from "react";
import { OrnamentalCard } from "./OrnamentalCard";

interface PremiumPathCardProps {
  index: string;
  title: string;
  subtitle: string;
  description: string;
  cta: string;
  icon: ReactNode;
  accent?: "gold" | "emerald" | "holo";
  className?: string;
}

/**
 * PremiumPathCard — high-conversion path card with credential-style index,
 * engraved icon medallion and certificate framing.
 */
export function PremiumPathCard({
  index,
  title,
  subtitle,
  description,
  cta,
  icon,
  accent = "gold",
  className = "",
}: PremiumPathCardProps) {
  const ring = {
    gold: "rgba(227,185,85,0.4)",
    emerald: "rgba(56,185,106,0.4)",
    holo: "rgba(182,212,74,0.45)",
  }[accent];

  return (
    <OrnamentalCard accent={accent} className={className}>
      <div className="flex h-full flex-col p-7">
        <div className="flex items-center justify-between">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg text-zen-platinum"
            style={{ border: `1px solid ${ring}`, background: "rgba(5,7,10,0.6)" }}
          >
            {icon}
          </div>
          <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground">{index}</span>
        </div>

        <p className="mt-6 micro-label text-muted-foreground">{subtitle}</p>
        <h3 className="mt-2 text-2xl font-medium text-zen-platinum">{title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>

        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-zen-gold transition-transform duration-300 group-hover:translate-x-1">
          {cta}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </OrnamentalCard>
  );
}
