import { useState } from "react";
import { useSky, type Weather } from "@/hooks/useSky";

const SPEEDS: { label: string; value: number }[] = [
  { label: "Live", value: 1 },
  { label: "5m/s", value: 300 },
  { label: "30m/s", value: 1800 },
  { label: "2h/s", value: 7200 },
];

const WEATHER: { id: Weather; label: string; icon: string }[] = [
  { id: "clear", label: "Clear", icon: "○" },
  { id: "cloudy", label: "Cloudy", icon: "☁" },
  { id: "rain", label: "Rain", icon: "☂" },
  { id: "snow", label: "Snow", icon: "❄" },
  { id: "aurora", label: "Aurora", icon: "✦" },
];

/**
 * SkyControls — a compact, app-style panel that lets you accelerate time,
 * reset to the real local moment, change the weather, and pin the sky to your
 * actual location for an accurate solar arc.
 */
export function SkyControls() {
  const { now, mounted, speed, setSpeed, weather, setWeather, resetToNow, requestLocation, located, sky } =
    useSky();
  const [open, setOpen] = useState(false);

  const time = mounted
    ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  return (
    <div className="fixed left-4 z-50 bottom-[calc(env(safe-area-inset-bottom)+1rem)] md:bottom-6">
      {open ? (
        <div className="glass-panel w-[17rem] rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base leading-none text-zen-gold">{weatherIcon(weather)}</span>
              <div>
                <div className="font-mono text-sm font-semibold text-zen-platinum">{time}</div>
                <div className="micro-label text-zen-gold">{sky.label}</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="tap-target flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-zen-platinum"
              aria-label="Collapse sky controls"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="mt-4 micro-label text-muted-foreground">Time flow</div>
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {SPEEDS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSpeed(s.value)}
                className={`tap-target rounded-lg px-1.5 py-2 text-xs font-medium transition-all ${
                  speed === s.value
                    ? "text-zen-ink"
                    : "text-muted-foreground hover:text-zen-platinum"
                }`}
                style={
                  speed === s.value
                    ? { background: "var(--grad-emerald-gold)" }
                    : { border: "1px solid rgba(127,232,218,0.18)" }
                }
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="mt-4 micro-label text-muted-foreground">Weather</div>
          <div className="mt-2 grid grid-cols-5 gap-1.5">
            {WEATHER.map((w) => (
              <button
                key={w.id}
                onClick={() => setWeather(w.id)}
                title={w.label}
                className={`tap-target flex h-9 items-center justify-center rounded-lg text-sm transition-all ${
                  weather === w.id ? "text-zen-ink" : "text-muted-foreground hover:text-zen-platinum"
                }`}
                style={
                  weather === w.id
                    ? { background: "var(--grad-gold-platinum)" }
                    : { border: "1px solid rgba(127,232,218,0.18)" }
                }
                aria-label={w.label}
              >
                {w.icon}
              </button>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={resetToNow}
              className="tap-target flex-1 rounded-lg px-2 py-2 text-xs font-medium text-zen-platinum transition-colors hover:border-zen-gold/60"
              style={{ border: "1px solid rgba(214,177,94,0.3)" }}
            >
              Now
            </button>
            <button
              onClick={requestLocation}
              className="tap-target flex-1 rounded-lg px-2 py-2 text-xs font-medium text-zen-platinum transition-colors hover:border-zen-gold/60"
              style={{ border: "1px solid rgba(214,177,94,0.3)" }}
            >
              {located ? "Located ✓" : "My sky"}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="glass-panel tap-target flex items-center gap-2.5 rounded-full py-2.5 pl-3 pr-4 shadow-xl"
          aria-label="Open sky controls"
        >
          <span className="text-base leading-none text-zen-gold">{weatherIcon(weather)}</span>
          <span className="font-mono text-sm font-semibold text-zen-platinum">{time}</span>
          <span className="micro-label text-zen-gold">{sky.label}</span>
        </button>
      )}
    </div>
  );
}

function weatherIcon(w: Weather) {
  return WEATHER.find((x) => x.id === w)?.icon ?? "○";
}
