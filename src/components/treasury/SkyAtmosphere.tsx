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
    "radial-gradient(140% 100% at 72% 4%, rgba(255,231,182,0.62), transparent 46%)," +
    "radial-gradient(130% 96% at 18% 96%, rgba(246,150,79,0.44), transparent 56%)," +
    "radial-gradient(110% 80% at 50% 40%, rgba(127,232,218,0.16), transparent 60%)," +
    "linear-gradient(168deg, #10303f 0%, #234c5c 30%, #5c7566 58%, #c39463 84%, #e8b878 100%)",
  day:
    "radial-gradient(140% 96% at 80% 0%, rgba(255,248,228,0.6), transparent 46%)," +
    "radial-gradient(120% 90% at 16% 12%, rgba(149,232,255,0.5), transparent 52%)," +
    "radial-gradient(130% 110% at 50% 122%, rgba(127,232,218,0.34), transparent 60%)," +
    "linear-gradient(176deg, #2f9dc4 0%, #57bfc4 26%, #9adcc9 54%, #d8ecc0 78%, #f6ecca 100%)",
  dusk:
    "radial-gradient(140% 100% at 28% 2%, rgba(126,176,210,0.5), transparent 48%)," +
    "radial-gradient(140% 100% at 80% 98%, rgba(246,110,79,0.55), transparent 56%)," +
    "radial-gradient(110% 80% at 55% 46%, rgba(170,120,190,0.28), transparent 62%)," +
    "linear-gradient(172deg, #14284a 0%, #3c3a63 34%, #7a4d69 64%, #c46a4f 88%, #e88a4e 100%)",
  night:
    "radial-gradient(150% 100% at 78% 2%, rgba(120,190,235,0.18), transparent 50%)," +
    "radial-gradient(130% 100% at 14% 98%, rgba(69,220,174,0.14), transparent 54%)," +
    "radial-gradient(120% 90% at 50% 44%, rgba(40,60,110,0.4), transparent 66%)," +
    "linear-gradient(168deg, #030614 0%, #06121f 34%, #0a2030 66%, #071726 88%, #040b16 100%)",
};

/**
 * SkyAtmosphere — a living, time-of-day sky that spans the entire page and is
 * now the dominant visual layer. It reads the visitor's local clock to shift
 * between dawn, day, dusk and a sweeping starry night. Night brings a deep
 * cosmos with parallax star fields, flowing aurora curtains, drifting meteors,
 * cloud banks and occasional thunderstorms. Purely decorative.
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

  // gentle scroll parallax — only meaningful when fixed to the viewport
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!fixed) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || 0;
        rootRef.current?.style.setProperty("--sky-scroll", String(y));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [fixed]);

  return (
    <div
      ref={rootRef}
      className={`${pos} inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
      style={{ zIndex: 0 }}
    >
      {/* base sky — cross-fades when phase changes */}
      <div
        key={phase}
        className="absolute inset-0 animate-fade-in"
        style={{ background: SKY[phase], transition: "opacity 1.4s ease" }}
      />

      {/* atmospheric horizon bloom (warm at day/dawn, cool at night) */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background: isNight
            ? "radial-gradient(120% 100% at 50% 120%, rgba(69,220,174,0.16), rgba(46,64,110,0.14) 40%, transparent 72%)"
            : "radial-gradient(120% 100% at 50% 120%, rgba(255,236,180,0.35), rgba(127,232,218,0.20) 42%, transparent 74%)",
          mixBlendMode: "screen",
        }}
      />

      {/* cosmos at night */}
      {isNight && (
        <>
          {/* far, dense parallax star layer */}
          <div
            className="absolute inset-0"
            style={{
              transform:
                "translateY(calc(var(--sky-scroll, 0) * 0.018px))",
              animation: "drift-slow 60s ease-in-out infinite alternate",
            }}
          >
            <StarField count={feature ? 260 : 200} feature={false} density="dense" className="opacity-70" />
          </div>
          {/* near, brighter star layer with sovereign stars */}
          <div
            className="absolute inset-0"
            style={{ transform: "translateY(calc(var(--sky-scroll, 0) * 0.045px))" }}
          >
            <StarField count={feature ? 150 : 110} density={feature ? "dense" : "normal"} className="opacity-95" />
          </div>

          {/* milky-way nebula band with slow bloom */}
          <div
            className="absolute inset-0 mix-blend-screen"
            style={{
              background:
                "radial-gradient(70% 34% at 64% 26%, rgba(149,232,255,0.14), transparent 70%)," +
                "radial-gradient(60% 30% at 30% 62%, rgba(170,150,255,0.13), transparent 72%)," +
                "radial-gradient(46% 22% at 48% 44%, rgba(127,232,218,0.10), transparent 74%)",
              filter: "blur(8px)",
              animation: "nebula-pulse 18s ease-in-out infinite",
            }}
          />

          {/* flowing aurora curtains */}
          <AuroraCurtains feature={feature} />

          {/* drifting meteors */}
          <Meteors feature={feature} />
        </>
      )}

      {/* sun / moon body */}
      <CelestialBody phase={phase} />

      {/* drifting cloud banks (denser + whiter by day, wispy/dark by night) */}
      <CloudLayers night={isNight} feature={feature} />

      {/* occasional thunderstorms — only at night */}
      {isNight && <ThunderStorm feature={feature} />}

      {/* light legibility scrim — kept restrained so the sky dominates */}
      <div
        className="absolute inset-0"
        style={{
          background: isNight
            ? "radial-gradient(150% 130% at 50% 42%, transparent 62%, rgba(4,10,20,0.52) 100%), linear-gradient(180deg, rgba(4,10,20,0.16) 0%, transparent 30%, transparent 70%, rgba(4,10,20,0.34) 100%)"
            : "radial-gradient(155% 140% at 50% 40%, transparent 58%, rgba(7,22,30,0.40) 100%), linear-gradient(180deg, rgba(7,22,30,0.18) 0%, transparent 34%, transparent 66%, rgba(7,22,30,0.36) 100%)",
        }}
      />
    </div>
  );
}

/* ---------------- celestial body ---------------- */
function CelestialBody({ phase }: { phase: SkyPhase }) {
  const night = phase === "night";
  const warm = phase === "dawn" || phase === "dusk";
  const size = night ? 150 : 200;
  return (
    <div
      className="absolute"
      style={{
        left: night ? "78%" : "76%",
        top: night ? "13%" : warm ? "22%" : "11%",
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        animation: "breathe 10s ease-in-out infinite",
      }}
    >
      {/* wide outer glow */}
      <div
        className="absolute rounded-full"
        style={{
          inset: "-70%",
          background: night
            ? "radial-gradient(circle, rgba(190,220,255,0.30) 0%, rgba(120,180,235,0.12) 34%, transparent 68%)"
            : warm
              ? "radial-gradient(circle, rgba(255,224,170,0.55) 0%, rgba(246,150,79,0.24) 32%, transparent 68%)"
              : "radial-gradient(circle, rgba(255,250,235,0.6) 0%, rgba(255,232,160,0.28) 30%, transparent 68%)",
          filter: "blur(10px)",
        }}
      />

      {/* rotating corona rays (day / dawn / dusk) */}
      {!night && (
        <div
          className="absolute rounded-full mix-blend-screen"
          style={{
            inset: "-40%",
            background: warm
              ? "conic-gradient(from 0deg, transparent 0deg, rgba(255,210,150,0.35) 8deg, transparent 16deg, transparent 30deg, rgba(255,224,170,0.28) 38deg, transparent 46deg)"
              : "conic-gradient(from 0deg, transparent 0deg, rgba(255,248,220,0.4) 7deg, transparent 15deg, transparent 30deg, rgba(255,240,190,0.3) 37deg, transparent 45deg)",
            filter: "blur(3px)",
            opacity: 0.7,
            animation: "corona-spin 120s linear infinite",
          }}
        />
      )}

      {/* inner halo */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: night
            ? "radial-gradient(circle, rgba(214,233,255,0.55) 0%, rgba(149,232,255,0.18) 40%, transparent 72%)"
            : warm
              ? "radial-gradient(circle, rgba(255,236,196,0.9) 0%, rgba(246,150,79,0.4) 34%, transparent 72%)"
              : "radial-gradient(circle, rgba(255,250,235,0.95) 0%, rgba(255,236,170,0.45) 32%, transparent 72%)",
          filter: "blur(5px)",
        }}
      />

      {/* core disc */}
      <div
        className="absolute rounded-full overflow-hidden"
        style={{
          inset: night ? "30%" : "36%",
          background: night
            ? "radial-gradient(circle at 38% 32%, #fdfeff 0%, #dfeaf4 46%, #b3c3d3 78%, #97a8ba 100%)"
            : "radial-gradient(circle at 40% 34%, #fffdf6 0%, #ffeec0 55%, #f9cf7c 100%)",
          boxShadow: night
            ? "0 0 34px rgba(200,224,255,0.6), inset -8px -8px 20px rgba(90,110,140,0.4)"
            : "0 0 60px rgba(255,224,150,0.75)",
        }}
      >
        {/* moon maria (surface seas) + terminator shadow */}
        {night && (
          <>
            <span className="absolute rounded-full" style={{ left: "22%", top: "28%", width: "34%", height: "30%", background: "radial-gradient(circle, rgba(120,140,168,0.5), transparent 70%)" }} />
            <span className="absolute rounded-full" style={{ left: "52%", top: "48%", width: "28%", height: "26%", background: "radial-gradient(circle, rgba(120,140,168,0.42), transparent 70%)" }} />
            <span className="absolute rounded-full" style={{ left: "40%", top: "20%", width: "16%", height: "16%", background: "radial-gradient(circle, rgba(120,140,168,0.36), transparent 72%)" }} />
            <span className="absolute rounded-full" style={{ left: "30%", top: "60%", width: "12%", height: "12%", background: "radial-gradient(circle, rgba(120,140,168,0.34), transparent 72%)" }} />
            {/* soft terminator so it reads spherical */}
            <span className="absolute inset-0" style={{ background: "radial-gradient(circle at 72% 68%, transparent 40%, rgba(20,32,54,0.55) 100%)" }} />
          </>
        )}
      </div>

      {/* crisp rim ring */}
      <div
        className="absolute rounded-full"
        style={{
          inset: night ? "28%" : "34%",
          border: night ? "1px solid rgba(214,233,255,0.4)" : "1px solid rgba(255,244,206,0.5)",
        }}
      />
    </div>
  );
}

/* ---------------- aurora curtains ---------------- */
function AuroraCurtains({ feature }: { feature: boolean }) {
  const bands = [
    { top: "6%", h: "62%", hueA: "149,232,255", hueB: "127,232,218", dur: 22, delay: 0, blur: 26, o: feature ? 0.5 : 0.36 },
    { top: "0%", h: "70%", hueA: "127,232,218", hueB: "212,236,128", dur: 28, delay: -6, blur: 34, o: feature ? 0.4 : 0.28 },
    { top: "12%", h: "54%", hueA: "120,190,235", hueB: "170,150,255", dur: 34, delay: -12, blur: 30, o: feature ? 0.34 : 0.22 },
  ];
  return (
    <div className="absolute inset-0 mix-blend-screen">
      {bands.map((b, i) => (
        <div
          key={i}
          className="absolute inset-x-0"
          style={{
            top: b.top,
            height: b.h,
            opacity: b.o,
            filter: `blur(${b.blur}px)`,
            background: `linear-gradient(92deg, transparent 0%, rgba(${b.hueA},0.0) 8%, rgba(${b.hueA},0.55) 26%, rgba(${b.hueB},0.6) 46%, rgba(${b.hueA},0.4) 66%, rgba(${b.hueB},0.0) 88%, transparent 100%)`,
            WebkitMaskImage:
              "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)",
            maskImage:
              "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)",
            animation: `aurora-ribbon ${b.dur}s ease-in-out ${b.delay}s infinite`,
            transformOrigin: "top center",
          }}
        />
      ))}
    </div>
  );
}

/* ---------------- meteors ---------------- */
interface Meteor {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  len: number;
  dur: number;
  rot: number;
}

function Meteors({ feature }: { feature: boolean }) {
  const [list, setList] = useState<Meteor[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    let timeout: number;
    const schedule = () => {
      const wait = (feature ? 3500 : 6000) + Math.random() * (feature ? 5000 : 9000);
      timeout = window.setTimeout(() => {
        counter.current += 1;
        const startX = 5 + Math.random() * 80;
        const startY = Math.random() * 34;
        const travel = 380 + Math.random() * 420;
        const angle = 26 + Math.random() * 18; // degrees
        const rad = (angle * Math.PI) / 180;
        const m: Meteor = {
          id: counter.current,
          x: startX,
          y: startY,
          dx: Math.cos(rad) * travel,
          dy: Math.sin(rad) * travel,
          len: 90 + Math.random() * 140,
          dur: 900 + Math.random() * 700,
          rot: angle,
        };
        setList((prev) => [...prev, m]);
        window.setTimeout(() => setList((prev) => prev.filter((x) => x.id !== m.id)), m.dur + 100);
        schedule();
      }, wait);
    };
    schedule();
    return () => window.clearTimeout(timeout);
  }, [feature]);

  return (
    <div className="absolute inset-0">
      {list.map((m) => (
        <span
          key={m.id}
          className="absolute"
          style={
            {
              left: `${m.x}%`,
              top: `${m.y}%`,
              width: `${m.len}px`,
              height: "1.6px",
              borderRadius: "9999px",
              background:
                "linear-gradient(90deg, rgba(255,255,255,0.95), rgba(149,232,255,0.6) 40%, transparent 100%)",
              boxShadow: "0 0 8px rgba(200,232,255,0.85)",
              transform: `rotate(${m.rot}deg)`,
              transformOrigin: "left center",
              animation: `meteor ${m.dur}ms ease-in forwards`,
              ["--mt-dx" as string]: `${m.dx}px`,
              ["--mt-dy" as string]: `${m.dy}px`,
              ["--mt-rot" as string]: `${m.rot}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ---------------- cloud layers ---------------- */
function CloudLayers({ night, feature }: { night: boolean; feature: boolean }) {
  const base = night ? 0.14 : 0.5;
  const mult = feature ? 1.25 : 1;
  const tint = night ? "rgba(150,180,215," : "rgba(255,255,255,";
  const warmTint = night ? "rgba(110,140,185," : "rgba(255,243,205,";
  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          transform: "translateY(calc(var(--sky-scroll, 0) * 0.03px))",
          background:
            `radial-gradient(36% 22% at 20% 24%, ${tint}${base * mult}), transparent 70%),` +
            `radial-gradient(42% 26% at 78% 18%, ${tint}${base * 0.85 * mult}), transparent 72%),` +
            `radial-gradient(48% 28% at 50% 40%, ${warmTint}${base * 0.7 * mult}), transparent 72%)`,
          filter: "blur(12px)",
          animation: "cloud-drift 30s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          transform: "translateY(calc(var(--sky-scroll, 0) * 0.06px))",
          background:
            `radial-gradient(32% 20% at 64% 54%, ${tint}${base * 0.7 * mult}), transparent 70%),` +
            `radial-gradient(38% 22% at 26% 68%, ${tint}${base * 0.6 * mult}), transparent 72%),` +
            `radial-gradient(32% 20% at 88% 72%, ${warmTint}${base * 0.5 * mult}), transparent 72%)`,
          filter: "blur(20px)",
          animation: "cloud-drift 44s ease-in-out infinite alternate-reverse",
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
