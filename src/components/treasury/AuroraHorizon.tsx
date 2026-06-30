import skyImg from "@/assets/endless-sky.jpg";

interface AuroraHorizonProps {
  className?: string;
  /** intensity of the luminous dawn */
  intensity?: "soft" | "bright";
}

/**
 * AuroraHorizon — a luminous holographic dawn built on a cinematic dawn-sky
 * photograph, fused with volumetric CSS clouds and an opalescent sunrise core.
 * The edges fade to treasury-deep so it blends with the surrounding sections,
 * fusing the cosmos (images 1 & 3) with the endless-sky possibility (image 2).
 */
export function AuroraHorizon({ className = "", intensity = "soft" }: AuroraHorizonProps) {
  const bright = intensity === "bright";
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* cinematic dawn sky photograph */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${skyImg})`,
          opacity: bright ? 0.92 : 0.7,
          animation: "cloud-drift 40s ease-in-out infinite alternate",
          transformOrigin: "center",
        }}
      />
      {/* tone-mapping wash to fuse the sky into the ZEN palette */}
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          background:
            "linear-gradient(180deg, rgba(149,232,255,0.35) 0%, rgba(127,232,218,0.18) 40%, rgba(246,150,79,0.20) 100%)",
        }}
      />
      {/* deep base fade at the edges so sections blend seamlessly */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 38%, transparent 30%, rgba(8,25,30,0.55) 78%, #08191e 100%), linear-gradient(180deg, rgba(8,25,30,0.45) 0%, transparent 30%, transparent 62%, rgba(8,25,30,0.85) 100%)",
        }}
      />

      {/* opalescent sunrise core */}
      <div
        className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "140%",
          height: "120%",
          background: bright
            ? "radial-gradient(closest-side, rgba(255,250,235,0.72), rgba(180,238,255,0.40) 34%, rgba(140,236,222,0.22) 56%, transparent 74%)"
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
