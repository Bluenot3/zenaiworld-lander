import { useEffect, useRef, useState } from "react";
import { StarField } from "./StarField";
import { useTimeOfDay, type SkyPhase } from "@/hooks/useTimeOfDay";

interface SkyAtmosphereProps {
  className?: string;
  /** fixed to the viewport (spans the entire page) or absolute to a section */
  fixed?: boolean;
  /** force a phase (for the cinematic possibility section) instead of clock */
  phase?: SkyPhase;
  /** dial the overall presence up or down */
  intensity?: "ambient" | "feature";
}

/* ---- per-phase sky gradients (kept inside the ZEN luminous palette) ---- */
const SKY: Record<SkyPhase, string> = {
  dawn:
    "radial-gradient(120% 95% at 70% 8%, rgba(255,228,178,0.55), transparent 52%)," +
    "radial-gradient(120% 90% at 20% 92%, rgba(246,150,79,0.40), transparent 58%)," +
    "linear-gradient(170deg, #16384a 0%, #2b5563 34%, #6f7e6e 64%, #d9a36a 100%)",
  day:
    "radial-gradient(120% 90% at 78% 4%, rgba(255,246,224,0.55), transparent 50%)," +
    "radial-gradient(110% 85% at 18% 14%, rgba(149,232,255,0.45), transparent 55%)," +
    "radial-gradient(120% 100% at 50% 120%, rgba(127,232,218,0.30), transparent 62%)," +
    "linear-gradient(175deg, #3aa9c9 0%, #62c6c2 30%, #aee3cf 60%, #f3e7c4 100%)",
  dusk:
    "radial-gradient(120% 95% at 30% 6%, rgba(126,176,210,0.45), transparent 52%)," +
    "radial-gradient(130% 95% at 78% 96%, rgba(246,120,79,0.50), transparent 58%)," +
    "linear-gradient(172deg, #1b2f4d 0%, #4a3f63 38%, #9a5a64 70%, #e08a4e 100%)",
  night:
    "radial-gradient(120% 90% at 78% 6%, rgba(149,232,255,0.16), transparent 54%)," +
    "radial-gradient(110% 90% at 16% 96%, rgba(69,220,174,0.12), transparent 58%)," +
    "radial-gradient(90% 80% at 50% 50%, rgba(46,64,96,0.35), transparent 70%)," +
    "linear-gradient(170deg, #050a16 0%, #081826 42%, #0a2230 78%, #06141c 100%)",
};

/**
 * SkyAtmosphere — a living, time-of-day sky that spans the entire page.
 * It reads the visitor's local clock to shift between dawn, day, dusk and a
 * sweeping starry night. Night brings a deep cosmos, drifting cloud banks and
 * occasional thunderstorms with forked lightning. Purely decorative.
 */
export function SkyAtmosphere({
  className = "",
  fixed = true,
  phase: forced,
  intensity = "ambient",
}: SkyAtmosphereProps) {
  const clock = useTimeOfDay();
  const phase = forced ?? clock.phase;
  const isNight = phase === "night";
  const feature = intensity === "feature";

  const pos = fixed ? "fixed" : "absolute";

  return (
    <div
      className={`${pos} inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {/* base sky — cross-fades when phase changes */}
      <div
        key={phase}
        className="absolute inset-0 animate-fade-in"
        style={{ background: SKY[phase], transition: "opacity 1.2s ease" }}
      />

      {/* sun / moon body */}
      <CelestialBody phase={phase} />

      {/* cosmos at night */}
      {isNight && (
        <>
          <StarField
            count={feature ? 200 : 150}
            density={feature ? "dense" : "normal"}
            className="opacity-90"
          />
          {/* faint milky-way nebula band */}
          <div
            className="absolute inset-0 mix-blend-screen"
            style={{
              background:
                "radial-gradient(60% 30% at 64% 30%, rgba(149,232,255,0.10), transparent 70%)," +
                "radial-gradient(50% 26% at 30% 64%, rgba(170,150,255,0.10), transparent 72%)",
              filter: "blur(6px)",
            }}
          />
        </>
      )}

      {/* drifting cloud banks (denser + whiter by day, wispy/dark by night) */}
      <CloudLayers night={isNight} feature={feature} />

      {/* occasional thunderstorms — only at night */}
      {isNight && <ThunderStorm feature={feature} />}

      {/* legibility scrim so content stays readable over any sky */}
      <div
        className="absolute inset-0"
        style={{
          background: isNight
            ? "radial-gradient(135% 120% at 50% 40%, transparent 52%, rgba(5,12,20,0.74) 100%), linear-gradient(180deg, rgba(5,12,20,0.30) 0%, transparent 26%, transparent 64%, rgba(5,12,20,0.55) 100%)"
            : "radial-gradient(140% 130% at 50% 36%, transparent 46%, rgba(7,22,30,0.62) 100%), linear-gradient(180deg, rgba(7,22,30,0.34) 0%, transparent 30%, transparent 60%, rgba(7,22,30,0.58) 100%)",
        }}
      />
    </div>
  );
}

/* ---------------- celestial body ---------------- */
function CelestialBody({ phase }: { phase: SkyPhase }) {
  const night = phase === "night";
  const warm = phase === "dawn" || phase === "dusk";
  return (
    <div
      className="absolute"
      style={{
        left: night ? "76%" : "74%",
        top: night ? "12%" : warm ? "20%" : "10%",
        width: night ? 120 : 180,
        height: night ? 120 : 180,
        transform: "translate(-50%, -50%)",
        animation: "breathe 9s ease-in-out infinite",
      }}
    >
      {/* glow halo */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: night
            ? "radial-gradient(circle, rgba(214,233,255,0.55) 0%, rgba(149,232,255,0.20) 36%, transparent 70%)"
            : warm
              ? "radial-gradient(circle, rgba(255,236,196,0.9) 0%, rgba(246,150,79,0.45) 32%, transparent 70%)"
              : "radial-gradient(circle, rgba(255,250,235,0.95) 0%, rgba(255,236,170,0.5) 30%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />
      {/* core disc */}
      <div
        className="absolute rounded-full"
        style={{
          inset: night ? "34%" : "38%",
          background: night
            ? "radial-gradient(circle at 38% 34%, #fdfdff 0%, #d7e6f2 52%, #aebccb 100%)"
            : "radial-gradient(circle at 40% 36%, #fffaf0 0%, #ffe9b8 60%, #f6c878 100%)",
          boxShadow: night
            ? "0 0 30px rgba(200,224,255,0.6)"
            : "0 0 50px rgba(255,224,150,0.7)",
        }}
      />
      {/* moon craters */}
      {night && (
        <>
          <span className="absolute rounded-full" style={{ left: "44%", top: "42%", width: 9, height: 9, background: "rgba(150,168,190,0.55)" }} />
          <span className="absolute rounded-full" style={{ left: "54%", top: "54%", width: 6, height: 6, background: "rgba(150,168,190,0.5)" }} />
          <span className="absolute rounded-full" style={{ left: "50%", top: "38%", width: 4, height: 4, background: "rgba(150,168,190,0.45)" }} />
        </>
      )}
    </div>
  );
}

/* ---------------- cloud layers ---------------- */
function CloudLayers({ night, feature }: { night: boolean; feature: boolean }) {
  const base = night ? 0.16 : 0.5;
  const mult = feature ? 1.25 : 1;
  const tint = night ? "rgba(180,205,230," : "rgba(255,255,255,";
  const warmTint = night ? "rgba(120,150,190," : "rgba(255,243,205,";
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(34% 20% at 22% 26%, ${tint}${base * mult}), transparent 70%),` +
            `radial-gradient(40% 24% at 76% 20%, ${tint}${base * 0.85 * mult}), transparent 72%),` +
            `radial-gradient(46% 26% at 50% 40%, ${warmTint}${base * 0.7 * mult}), transparent 72%)`,
          filter: "blur(10px)",
          animation: "cloud-drift 26s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            `radial-gradient(30% 18% at 64% 52%, ${tint}${base * 0.7 * mult}), transparent 70%),` +
            `radial-gradient(36% 20% at 28% 66%, ${tint}${base * 0.6 * mult}), transparent 72%),` +
            `radial-gradient(30% 18% at 88% 70%, ${warmTint}${base * 0.5 * mult}), transparent 72%)`,
          filter: "blur(16px)",
          animation: "cloud-drift 38s ease-in-out infinite alternate-reverse",
        }}
      />
    </>
  );
}

/* ---------------- thunderstorm ---------------- */
interface Strike {
  id: number;
  x: number;
  path: string;
  double: boolean;
}

function makeBoltPath(x: number): string {
  // a jagged forked bolt descending from the cloud line
  let seed = Math.floor(x * 1000) + 7;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  let px = x;
  let py = 4;
  let d = `M ${px.toFixed(1)} ${py}`;
  const steps = 6 + Math.floor(rand() * 3);
  for (let i = 0; i < steps; i++) {
    px += (rand() - 0.5) * 9;
    py += (38 / steps) * (0.7 + rand() * 0.6);
    d += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
  }
  return d;
}

function ThunderStorm({ feature }: { feature: boolean }) {
  const [strike, setStrike] = useState<Strike | null>(null);
  const counter = useRef(0);

  useEffect(() => {
    let timeout: number;
    const schedule = () => {
      // storms are occasional: 14–40s between bouts (more frequent in feature mode)
      const wait = (feature ? 9000 : 14000) + Math.random() * (feature ? 16000 : 26000);
      timeout = window.setTimeout(() => {
        const x = 12 + Math.random() * 76;
        counter.current += 1;
        setStrike({
          id: counter.current,
          x,
          path: makeBoltPath(x),
          double: Math.random() > 0.55,
        });
        window.setTimeout(() => setStrike(null), 1400);
        schedule();
      }, wait);
    };
    schedule();
    return () => window.clearTimeout(timeout);
  }, [feature]);

  if (!strike) return null;

  return (
    <div key={strike.id} className="absolute inset-0">
      {/* whole-sky flash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at " +
            strike.x +
            "% 0%, rgba(214,233,255,0.6), rgba(149,232,255,0.18) 40%, transparent 72%)",
          animation: `lightning-flash 1.4s ease-out ${strike.double ? "" : ""}`,
          mixBlendMode: "screen",
        }}
      />
      {/* forked bolt */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        style={{ animation: "bolt-strike 1.4s ease-out" }}
      >
        <path
          d={strike.path}
          fill="none"
          stroke="rgba(229,242,255,0.95)"
          strokeWidth="0.35"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: "drop-shadow(0 0 1.4px rgba(160,210,255,0.95))" }}
        />
      </svg>
    </div>
  );
}
