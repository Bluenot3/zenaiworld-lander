import { useMemo } from "react";
import { useSky } from "@/hooks/useSky";
import { StarField } from "./StarField";

/**
 * LivingSky — a single fixed, full-viewport sky that sits behind the entire
 * page. It renders the real local time of day: an accurate sun/moon arc,
 * a sky gradient that transitions dawn → day → dusk → night, stars that
 * emerge after sunset, an aurora at deep night, and oversized cloud banks
 * that drift across — and overlap — every section as you scroll. Weather and
 * a time-acceleration control let the whole scene speed through a day.
 */
export function LivingSky() {
  const { sky, weather, mounted } = useSky();

  // deterministic oversized cloud banks (span well beyond the viewport so
  // they bleed across every section as they cross)
  const clouds = useMemo(() => {
    let seed = 7321;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    return Array.from({ length: 7 }, (_, i) => ({
      top: 4 + rand() * 70,
      w: 46 + rand() * 46, // vw
      h: 18 + rand() * 22, // vh
      dur: 70 + rand() * 90,
      delay: -rand() * 120,
      blur: 26 + rand() * 40,
      dir: i % 2 === 0 ? 1 : -1,
      o: 0.5 + rand() * 0.5,
    }));
  }, []);

  if (!mounted) {
    // stable, content-free placeholder for SSR/first paint
    return <div className="fixed inset-0 -z-10" style={{ background: "#08191e" }} aria-hidden="true" />;
  }

  const { dayFactor, starOpacity, sun, moon } = sky;
  const overcast = weather === "cloudy" || weather === "rain" || weather === "snow";

  // cloud tint: bright in day, grey-blue at dusk, faint slate at night
  const cloudLight = Math.round(150 + dayFactor * 95);
  const cloudTint = `rgba(${cloudLight}, ${cloudLight + 6}, ${Math.round(cloudLight + 14)}, `;
  const baseCloudOpacity = (overcast ? 0.85 : 0.4) * (0.4 + dayFactor * 0.6) + 0.08;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* sky gradient */}
      <div
        className="absolute inset-0"
        style={{ background: sky.gradient, transition: "background 1.1s linear" }}
      />

      {/* stars + aurora at night */}
      <div className="absolute inset-0" style={{ opacity: starOpacity, transition: "opacity 1.4s linear" }}>
        <StarField count={150} density="dense" feature />
      </div>
      {(weather === "aurora" || starOpacity > 0.5) && (
        <div
          className="absolute inset-x-0 top-0 h-[60%]"
          style={{
            background: "var(--grad-aurora)",
            opacity: (weather === "aurora" ? 0.5 : 0.18) * starOpacity,
            mixBlendMode: "screen",
            filter: "blur(26px)",
            animation: "aurora-drift 18s ease-in-out infinite",
            transition: "opacity 1.4s linear",
          }}
        />
      )}

      {/* sun: warm glow + crisp disc, positioned on its real arc */}
      {sun.visible && (
        <>
          <div
            className="absolute"
            style={{
              left: `${sun.x}%`,
              top: `${sun.y}%`,
              width: "70vw",
              height: "70vw",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(closest-side, rgba(255,247,224,0.55), rgba(246,150,79,0.28) 32%, transparent 68%)",
              mixBlendMode: "screen",
              filter: "blur(4px)",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              left: `${sun.x}%`,
              top: `${sun.y}%`,
              width: "84px",
              height: "84px",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, #fffdf4 0%, #fff0c4 45%, #f7c976 72%, rgba(246,150,79,0) 100%)",
              boxShadow: "0 0 90px 28px rgba(255,228,160,0.55)",
            }}
          />
        </>
      )}

      {/* moon */}
      {moon.opacity > 0.02 && (
        <div
          className="absolute rounded-full"
          style={{
            left: `${moon.x}%`,
            top: `${moon.y}%`,
            width: "58px",
            height: "58px",
            transform: "translate(-50%, -50%)",
            opacity: moon.opacity,
            background:
              "radial-gradient(circle at 38% 36%, #fdfdff 0%, #dfe7f2 52%, #aab6c8 100%)",
            boxShadow: "0 0 50px 14px rgba(207,233,255,0.4)",
          }}
        />
      )}

      {/* drifting oversized cloud banks — overlap across the whole screen */}
      {clouds.map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${c.top}%`,
            left: 0,
            width: `${c.w}vw`,
            height: `${c.h}vh`,
            opacity: clamp01(baseCloudOpacity * c.o),
            filter: `blur(${c.blur}px)`,
            background: `radial-gradient(60% 60% at 50% 50%, ${cloudTint}0.9), ${cloudTint}0.45) 45%, transparent 72%)`,
            mixBlendMode: dayFactor > 0.4 ? "screen" : "soft-light",
            animation: `sky-cloud ${c.dur}s linear ${c.delay}s infinite`,
            ["--sky-dir" as string]: String(c.dir),
            willChange: "transform",
          }}
        />
      ))}

      {/* rain */}
      {weather === "rain" && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(102deg, rgba(190,225,235,0.0) 0px, rgba(190,225,235,0.0) 6px, rgba(200,232,240,0.30) 6px, rgba(200,232,240,0.30) 7px)",
            backgroundSize: "100% 22px",
            animation: "sky-rain 0.5s linear infinite",
            opacity: 0.5,
          }}
        />
      )}

      {/* snow */}
      {weather === "snow" && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(2px 2px at 20% 10%, #fff, transparent), radial-gradient(2px 2px at 60% 30%, #fff, transparent), radial-gradient(2px 2px at 80% 50%, #eef, transparent), radial-gradient(1.5px 1.5px at 40% 70%, #fff, transparent), radial-gradient(2px 2px at 10% 85%, #eef, transparent)",
            backgroundSize: "320px 320px",
            animation: "sky-snow 9s linear infinite",
            opacity: 0.7,
          }}
        />
      )}

      {/* bottom vignette so content keeps its treasury weight */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(135% 120% at 50% 6%, transparent 52%, rgba(6,18,22,0.6) 100%), linear-gradient(180deg, transparent 60%, rgba(6,18,22,0.45) 100%)",
        }}
      />
    </div>
  );
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
