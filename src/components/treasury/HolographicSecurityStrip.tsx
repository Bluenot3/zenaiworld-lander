interface HolographicSecurityStripProps {
  className?: string;
  orientation?: "vertical" | "diagonal";
  width?: number;
}

/**
 * HolographicSecurityStrip — luminous credential ribbon inspired by modern
 * banknote security strips, reimagined as a futuristic ZEN element.
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
      {/* base holo gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(46,168,255,0.05), rgba(46,168,255,0.35) 28%, rgba(125,231,255,0.5) 50%, rgba(232,226,208,0.32) 72%, rgba(46,168,255,0.05))",
          mixBlendMode: "screen",
        }}
      />
      {/* engraved micro lines on strip */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, transparent 0 5px, rgba(232,226,208,0.25) 5px 6px)",
        }}
      />
      {/* breathing glow */}
      <div className="absolute inset-0 animate-breathe" style={{ background: "radial-gradient(60% 40% at 50% 50%, rgba(125,231,255,0.5), transparent 70%)" }} />
      {/* shimmer sweep */}
      <div
        className="absolute -inset-y-10 left-0 w-1/2 animate-shimmer"
        style={{
          background:
            "linear-gradient(180deg, transparent, rgba(248,247,242,0.55), transparent)",
          filter: "blur(6px)",
        }}
      />
      {/* edge highlights */}
      <div className="absolute inset-y-0 left-0 w-px" style={{ background: "rgba(125,231,255,0.6)" }} />
      <div className="absolute inset-y-0 right-0 w-px" style={{ background: "rgba(214,177,94,0.5)" }} />
    </div>
  );
}
