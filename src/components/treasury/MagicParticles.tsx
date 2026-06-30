import { useMemo } from "react";

interface MagicParticlesProps {
  className?: string;
  /** number of fine particles */
  count?: number;
  /** number of drifting hair-fine lines */
  lines?: number;
  /** overall opacity of the field */
  opacity?: number;
}

/**
 * MagicParticles — a faint, elegant cloud of super-fine rainbow-hued particles
 * and hair-thin drifting lines that read like slow-floating magic dust. Each
 * mote carries a different spectral hue at very low opacity, drifting and
 * twinkling on its own cadence. Deterministic (seeded) so SSR and client match.
 * Purely decorative; never spins, only drifts.
 */
export function MagicParticles({
  className = "",
  count = 70,
  lines = 9,
  opacity = 0.7,
}: MagicParticlesProps) {
  const { motes, threads } = useMemo(() => {
    let seed = 4127;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };

    const motes = Array.from({ length: count }, () => {
      const big = rand() > 0.82;
      return {
        x: rand() * 100,
        y: rand() * 100,
        size: big ? 1.6 + rand() * 1.4 : 0.6 + rand() * 1.0,
        hue: Math.round(rand() * 360),
        dur: 9 + rand() * 14,
        delay: -rand() * 18,
        dx: (rand() - 0.5) * 26,
        dy: -(8 + rand() * 30),
        o: (big ? 0.35 : 0.18) + rand() * 0.28,
      };
    });

    const threads = Array.from({ length: lines }, () => ({
      x: rand() * 100,
      y: rand() * 100,
      len: 40 + rand() * 120,
      angle: rand() * 360,
      hue: Math.round(rand() * 360),
      dur: 16 + rand() * 16,
      delay: -rand() * 20,
      o: 0.1 + rand() * 0.18,
    }));

    return { motes, threads };
  }, [count, lines]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* hair-fine drifting magic lines */}
      {threads.map((t, i) => (
        <span
          key={`t${i}`}
          className="absolute"
          style={
            {
              left: `${t.x}%`,
              top: `${t.y}%`,
              width: `${t.len}px`,
              height: "1px",
              transform: `rotate(${t.angle}deg)`,
              transformOrigin: "left center",
              background: `linear-gradient(90deg, transparent, hsla(${t.hue},90%,75%,${t.o}) 45%, hsla(${(t.hue + 60) % 360},90%,80%,${t.o}) 60%, transparent)`,
              filter: "blur(0.4px)",
              animation: `magic-drift ${t.dur}s ease-in-out ${t.delay}s infinite`,
              ["--mg-dx" as string]: `${(i % 2 ? 1 : -1) * 18}px`,
              ["--mg-dy" as string]: `-22px`,
              ["--mg-o" as string]: String(t.o),
            } as React.CSSProperties
          }
        />
      ))}

      {/* super-fine rainbow particles */}
      {motes.map((m, i) => (
        <span
          key={`m${i}`}
          className="absolute rounded-full"
          style={
            {
              left: `${m.x}%`,
              top: `${m.y}%`,
              width: `${m.size}px`,
              height: `${m.size}px`,
              background: `radial-gradient(circle, hsla(${m.hue},95%,85%,1) 0%, hsla(${m.hue},90%,70%,0.55) 55%, transparent 100%)`,
              boxShadow: `0 0 ${m.size * 3}px hsla(${m.hue},95%,75%,0.7)`,
              animation: `magic-drift ${m.dur}s ease-in-out ${m.delay}s infinite`,
              ["--mg-dx" as string]: `${m.dx}px`,
              ["--mg-dy" as string]: `${m.dy}px`,
              ["--mg-o" as string]: String(m.o),
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
