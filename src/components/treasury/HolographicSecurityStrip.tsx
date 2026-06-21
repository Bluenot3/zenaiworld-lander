interface HolographicSecurityStripProps {
  className?: string;
  orientation?: "vertical" | "diagonal";
  width?: number;
}

/**
 * HolographicSecurityStrip — luminous 3D security ribbon inspired by the
 * color-shifting woven ribbon on modern United States banknotes. Layered
 * holographic gradient, repeated micro-glyph motifs, shimmer sweep and
 * breathing glow, reimagined as a futuristic ZEN credential element.
 */
export function HolographicSecurityStrip({
  className = "",
  orientation = "vertical",
  width = 64,
}: HolographicSecurityStripProps) {
  const rotate = orientation === "diagonal" ? "rotate(8deg)" : "none";

  return (
    <div
      className={`pointer-events-none relative overflow-hidden ${className}`}
      style={{ width, transform: rotate }}
      aria-hidden="true"
    >
      {/* base holo gradient — sky blue → teal-green → lime → gold color shift */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(149,232,255,0.30) 0%, rgba(127,232,218,0.46) 24%, rgba(69,220,174,0.52) 48%, rgba(212,236,128,0.48) 72%, rgba(243,209,114,0.30) 100%)",
          mixBlendMode: "screen",
        }}
      />
      {/* woven 3D ribbon facets */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "repeating-linear-gradient(115deg, transparent 0 6px, rgba(248,247,242,0.22) 6px 7px, transparent 7px 13px)",
        }}
      />
      {/* engraved micro lines */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0 5px, rgba(232,226,208,0.28) 5px 6px)",
        }}
      />
      {/* repeated micro-glyph motifs (the ribbon's moving icons) */}
      <div className="absolute inset-0 flex flex-col items-center justify-around opacity-60">
        {Array.from({ length: 9 }).map((_, i) => (
          <svg key={i} width={Math.min(width * 0.5, 22)} height={Math.min(width * 0.5, 22)} viewBox="0 0 24 24" fill="none">
            <path
              d="M7 6h10L7 18h10"
              stroke="rgba(248,247,242,0.7)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>
      {/* breathing glow */}
      <div className="absolute inset-0 animate-breathe" style={{ background: "radial-gradient(60% 40% at 50% 50%, rgba(149,232,255,0.5), transparent 70%)" }} />
      {/* shimmer sweep */}
      <div
        className="absolute -inset-y-10 left-0 w-1/2 animate-shimmer"
        style={{ background: "linear-gradient(180deg, transparent, rgba(248,247,242,0.6), transparent)", filter: "blur(6px)" }}
      />
      {/* edge highlights */}
      <div className="absolute inset-y-0 left-0 w-px" style={{ background: "rgba(149,232,255,0.65)" }} />
      <div className="absolute inset-y-0 right-0 w-px" style={{ background: "rgba(243,209,114,0.55)" }} />
    </div>
  );
}
