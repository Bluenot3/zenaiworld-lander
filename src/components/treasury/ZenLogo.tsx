import zenLogoMark from "@/assets/zen-logo-mark.png.asset.json";
import zenMarkWhite from "@/assets/zen-mark-white.png";

interface ZenLogoProps {
  /** "icon" = premium metallic app-icon mark, "mark" = flat white engraved Z */
  variant?: "icon" | "mark";
  size?: number;
  className?: string;
  /** subtle floating glow ring behind the metallic icon */
  glow?: boolean;
}

/**
 * ZenLogo — the official ZEN AI Co. brand mark. The "icon" variant renders the
 * dimensional metallic app icon inside a treasury-grade rounded chassis; the
 * "mark" variant is the flat engraved Z for tight/monochrome placements.
 */
export function ZenLogo({
  variant = "icon",
  size = 40,
  className = "",
  glow = false,
}: ZenLogoProps) {
  if (variant === "mark") {
    return (
      <img
        src={zenMarkWhite}
        alt="ZEN AI Co."
        width={size}
        height={size}
        className={`object-contain ${className}`}
        style={{ width: size, height: size }}
        loading="eager"
        decoding="async"
      />
    );
  }

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-[26%]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(149,232,255,0.55), rgba(69,220,174,0.22) 55%, transparent 78%)",
            filter: "blur(10px)",
            transform: "scale(1.35)",
          }}
        />
      )}
      <img
        src={zenLogoMark.url}
        alt="ZEN AI Co."
        width={size}
        height={size}
        className="h-full w-full rounded-[24%] object-cover"
        style={{
          boxShadow:
            "0 6px 22px -8px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(149,232,255,0.14)",
        }}
        loading="eager"
        decoding="async"
      />
    </span>
  );
}
