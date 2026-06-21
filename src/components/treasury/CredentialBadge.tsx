interface CredentialBadgeProps {
  label: string;
  className?: string;
  tone?: "emerald" | "gold" | "holo";
}

/**
 * CredentialBadge — small certificate-style verification chip.
 */
export function CredentialBadge({ label, className = "", tone = "gold" }: CredentialBadgeProps) {
  const tones = {
    emerald: { dot: "#00b879", border: "rgba(0,184,121,0.35)", text: "text-zen-emerald" },
    gold: { dot: "#d6b15e", border: "rgba(214,177,94,0.35)", text: "text-zen-gold" },
    holo: { dot: "#2ea8ff", border: "rgba(46,168,255,0.4)", text: "text-zen-holo" },
  } as const;
  const t = tones[tone];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 micro-label ${t.text} ${className}`}
      style={{ border: `1px solid ${t.border}`, background: "rgba(8,16,28,0.6)" }}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: t.dot }} />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: t.dot }} />
      </span>
      {label}
    </span>
  );
}
