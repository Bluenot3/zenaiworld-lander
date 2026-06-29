interface AuroraHorizonProps {
  className?: string;
  /** intensity of the luminous dawn */
  intensity?: "soft" | "bright";
}

/**
 * AuroraHorizon — a luminous holographic dawn. Volumetric soft clouds and an
 * opalescent sunrise core that brighten the center while the edges stay
 * treasury-deep, fusing the cosmos (images 1 & 3) with the endless-sky
 * possibility (image 2). Pure CSS, no images, fully responsive.
 */
export function AuroraHorizon({ className = "", intensity = "soft" }: AuroraHorizonProps) {
  const bright = intensity === "bright";
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* deep base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 120%, rgba(8,25,30,0) 30%, #08191e 78%), linear-gradient(180deg, #0a2129 0%, #0c2a31 45%, #08191e 100%)",
        }}
      />

      {/* opalescent sunrise core */}
      <div
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "140%",
          height: "120%",
          background: bright
            ? "radial-gradient(closest-side, rgba(255,247,224,0.55), rgba(149,232,255,0.30) 35%, rgba(127,232,218,0.18) 55%, transparent 72%)"
            : "radial-gradient(closest-side, rgba(255,247,224,0.38), rgba(149,232,255,0.22) 38%, rgba(127,232,218,0.12) 58%, transparent 74%)",
          animation: "aurora-drift 16s ease-in-out infinite",
        }}
      />

      {/* drifting cloud banks */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(40% 26% at 22% 38%, rgba(255,255,255,0.18), transparent 70%), radial-gradient(46% 30% at 78% 32%, rgba(207,233,255,0.16), transparent 72%), radial-gradient(50% 30% at 50% 58%, rgba(255,243,196,0.14), transparent 72%)",
          filter: "blur(8px)",
          animation: "cloud-drift 22s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(36% 22% at 64% 50%, rgba(255,255,255,0.12), transparent 70%), radial-gradient(40% 24% at 30% 64%, rgba(216,255,233,0.12), transparent 72%)",
          filter: "blur(14px)",
          animation: "cloud-drift 30s ease-in-out infinite alternate-reverse",
        }}
      />

      {/* holographic horizon sheen */}
      <div
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 foil-surface opacity-50"
      />

      {/* edge vignette to fuse with treasury sections */}
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(130% 130% at 50% 45%, transparent 55%, rgba(6,18,22,0.85) 100%)" }}
      />
    </div>
  );
}
