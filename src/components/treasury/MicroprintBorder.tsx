interface MicroprintBorderProps {
  className?: string;
  text?: string;
  color?: string;
  opacity?: number;
}

/**
 * MicroprintBorder — repeated micro-text strip evoking the microprinting used
 * as a security feature across United States currency. Decorative only.
 */
export function MicroprintBorder({
  className = "",
  text = "ZEN · SOVEREIGN INTELLIGENCE TREASURY · VERIFIED ON-CHAIN · ",
  color = "rgba(214,177,94,0.5)",
  opacity = 0.5,
}: MicroprintBorderProps) {
  const line = text.repeat(8);
  return (
    <div
      className={`pointer-events-none select-none overflow-hidden whitespace-nowrap font-mono ${className}`}
      style={{
        opacity,
        color,
        fontSize: "7px",
        letterSpacing: "0.18em",
        lineHeight: 1,
      }}
      aria-hidden="true"
    >
      {line}
    </div>
  );
}
