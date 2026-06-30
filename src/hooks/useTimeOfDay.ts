import { useEffect, useState } from "react";

export type SkyPhase = "dawn" | "day" | "dusk" | "night";

export interface TimeOfDay {
  phase: SkyPhase;
  isNight: boolean;
  /** local hour (0-23), -1 until resolved on client */
  hour: number;
}

function phaseFromHour(hour: number): SkyPhase {
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 17) return "day";
  if (hour >= 17 && hour < 19) return "dusk";
  return "night";
}

/**
 * useTimeOfDay — resolves the sky phase from the visitor's *local* clock
 * (which reflects their location/timezone). SSR renders a deterministic
 * "day" default, then the client upgrades to the real phase after mount so
 * hydration never mismatches. Re-checks every few minutes so a page left
 * open transitions naturally across dusk into night.
 */
export function useTimeOfDay(): TimeOfDay {
  const [state, setState] = useState<TimeOfDay>({
    phase: "day",
    isNight: false,
    hour: -1,
  });

  useEffect(() => {
    const resolve = () => {
      const hour = new Date().getHours();
      const phase = phaseFromHour(hour);
      setState({ phase, isNight: phase === "night", hour });
    };
    resolve();
    const id = window.setInterval(resolve, 3 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  return state;
}
