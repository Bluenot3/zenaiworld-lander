import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* ------------------------------------------------------------------ *
 * Solar / lunar position math (compact SunCalc-derived implementation)
 * ------------------------------------------------------------------ */
const RAD = Math.PI / 180;
const DAY_MS = 86400000;
const J1970 = 2440588;
const J2000 = 2451545;
const E = RAD * 23.4397; // obliquity of the Earth

const toJulian = (d: Date) => d.valueOf() / DAY_MS - 0.5 + J1970;
const toDays = (d: Date) => toJulian(d) - J2000;

const rightAscension = (l: number, b: number) =>
  Math.atan2(Math.sin(l) * Math.cos(E) - Math.tan(b) * Math.sin(E), Math.cos(l));
const declination = (l: number, b: number) =>
  Math.asin(Math.sin(b) * Math.cos(E) + Math.cos(b) * Math.sin(E) * Math.sin(l));
const azimuth = (H: number, phi: number, dec: number) =>
  Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi));
const altitude = (H: number, phi: number, dec: number) =>
  Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
const siderealTime = (d: number, lw: number) => RAD * (280.16 + 360.9856235 * d) - lw;

const solarMeanAnomaly = (d: number) => RAD * (357.5291 + 0.98560028 * d);
const eclipticLongitude = (M: number) => {
  const C = RAD * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
  const P = RAD * 102.9372;
  return M + C + P + Math.PI;
};
const sunCoords = (d: number) => {
  const M = solarMeanAnomaly(d);
  const L = eclipticLongitude(M);
  return { dec: declination(L, 0), ra: rightAscension(L, 0) };
};
const moonCoords = (d: number) => {
  const L = RAD * (218.316 + 13.176396 * d);
  const M = RAD * (134.963 + 13.064993 * d);
  const F = RAD * (93.272 + 13.22935 * d);
  const l = L + RAD * 6.289 * Math.sin(M);
  const b = RAD * 5.128 * Math.sin(F);
  return { ra: rightAscension(l, b), dec: declination(l, b) };
};

function getSunPosition(date: Date, lat: number, lng: number) {
  const lw = RAD * -lng;
  const phi = RAD * lat;
  const d = toDays(date);
  const c = sunCoords(d);
  const H = siderealTime(d, lw) - c.ra;
  return { azimuth: azimuth(H, phi, c.dec), altitude: altitude(H, phi, c.dec) };
}
function getMoonPosition(date: Date, lat: number, lng: number) {
  const lw = RAD * -lng;
  const phi = RAD * lat;
  const d = toDays(date);
  const c = moonCoords(d);
  const H = siderealTime(d, lw) - c.ra;
  return { azimuth: azimuth(H, phi, c.dec), altitude: altitude(H, phi, c.dec) };
}

/* ------------------------------------------------------------------ *
 * Color helpers
 * ------------------------------------------------------------------ */
type RGB = [number, number, number];
const hex = (h: string): RGB => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];
const mix = (a: RGB, b: RGB, t: number): RGB => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];
const css = (c: RGB, alpha = 1) =>
  `rgba(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])}, ${alpha})`;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const smooth = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

/* ------------------------------------------------------------------ *
 * Sky palettes (ZEN treasury, time-aware)
 * ------------------------------------------------------------------ */
const DAY = { top: hex("#0f4f74"), mid: hex("#2f8fb0"), horizon: hex("#aee6e4") };
const GOLD = { top: hex("#243a63"), mid: hex("#e98a4e"), horizon: hex("#ffd79a") };
const NIGHT = { top: hex("#03070d"), mid: hex("#061018"), horizon: hex("#0c2530") };

export type Weather = "clear" | "cloudy" | "rain" | "snow" | "aurora";
export type SkyState = ReturnType<typeof computeSky>;

export function computeSky(now: Date, lat: number, lng: number) {
  const sun = getSunPosition(now, lat, lng);
  const moon = getMoonPosition(now, lat, lng);
  const altDeg = (sun.altitude * 180) / Math.PI;

  // rising vs setting (for label)
  const later = getSunPosition(new Date(now.getTime() + 6e5), lat, lng);
  const rising = later.altitude > sun.altitude;

  const dayBase = smooth(-6, 6, altDeg); // 0 night → 1 day
  // golden bell, peaks at the horizon
  const goldW = Math.exp(-((altDeg - 0) ** 2) / (2 * 6 * 6)) * 0.85;

  const blend = (d: RGB, g: RGB, n: RGB) => {
    let c = mix(n, d, dayBase);
    c = mix(c, g, goldW);
    return c;
  };
  const top = blend(DAY.top, GOLD.top, NIGHT.top);
  const mid = blend(DAY.mid, GOLD.mid, NIGHT.mid);
  const horizon = blend(DAY.horizon, GOLD.horizon, NIGHT.horizon);
  const ground = mix(horizon, NIGHT.top, 0.55);

  const gradient = `linear-gradient(180deg, ${css(top)} 0%, ${css(mid)} 46%, ${css(
    horizon,
  )} 80%, ${css(ground)} 100%)`;

  // sun screen position
  const sunX = clamp(50 + (sun.azimuth / (Math.PI / 2)) * 50, -8, 108);
  const sunY = 80 - clamp(altDeg, -6, 75) / 75 * 72;
  const sunVisible = altDeg > -3;

  const moonAltDeg = (moon.altitude * 180) / Math.PI;
  const moonX = clamp(50 + (moon.azimuth / (Math.PI / 2)) * 50, -8, 108);
  const moonY = 80 - clamp(moonAltDeg, -6, 75) / 75 * 72;
  const moonOpacity = clamp(smooth(-4, 6, moonAltDeg) * (1 - dayBase * 0.7), 0, 0.95);

  const starOpacity = 1 - smooth(-12, -2, altDeg);

  let label = "Night";
  if (altDeg > 6) label = "Daylight";
  else if (altDeg > -0.8) label = rising ? "Sunrise" : "Sunset";
  else if (altDeg > -6) label = rising ? "Dawn" : "Dusk";
  else if (altDeg > -12) label = "Twilight";

  return {
    gradient,
    altitude: altDeg,
    dayFactor: dayBase,
    goldFactor: goldW,
    starOpacity,
    label,
    sun: { x: sunX, y: sunY, visible: sunVisible },
    moon: { x: moonX, y: moonY, opacity: moonOpacity },
  };
}

/* ------------------------------------------------------------------ *
 * Context / provider
 * ------------------------------------------------------------------ */
interface SkyContextValue {
  now: Date;
  mounted: boolean;
  speed: number;
  setSpeed: (s: number) => void;
  weather: Weather;
  setWeather: (w: Weather) => void;
  coords: { lat: number; lng: number };
  located: boolean;
  requestLocation: () => void;
  resetToNow: () => void;
  sky: SkyState;
}

const SkyContext = createContext<SkyContextValue | null>(null);

// Estimate longitude from the user's timezone offset; default a temperate
// latitude. Real coordinates can be requested for an accurate solar arc.
function estimateCoords() {
  const offsetMin = -new Date().getTimezoneOffset(); // east-positive
  return { lat: 39, lng: clamp(offsetMin / 4, -179, 179) };
}

export function SkyProvider({ children }: { children: ReactNode }) {
  const [now, setNow] = useState<Date>(() => new Date());
  const [speed, setSpeed] = useState(1);
  const [weather, setWeather] = useState<Weather>("clear");
  const [coords, setCoords] = useState(() => estimateCoords());
  const [located, setLocated] = useState(false);
  const [mounted, setMounted] = useState(false);

  const virtualRef = useRef<Date>(new Date());
  const lastRealRef = useRef<number>(0);
  const lastCommitRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);
    virtualRef.current = new Date();
    setNow(new Date());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    lastRealRef.current = performance.now();
    let raf = 0;
    const loop = (t: number) => {
      const dt = t - lastRealRef.current;
      lastRealRef.current = t;
      virtualRef.current = new Date(virtualRef.current.getTime() + dt * speed);
      const commitEvery = speed > 1 ? 60 : 1000;
      if (t - lastCommitRef.current >= commitEvery) {
        lastCommitRef.current = t;
        setNow(new Date(virtualRef.current));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [mounted, speed]);

  const resetToNow = () => {
    virtualRef.current = new Date();
    setSpeed(1);
    setNow(new Date());
  };

  const requestLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocated(true);
      },
      () => setLocated(false),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 6e5 },
    );
  };

  const sky = useMemo(() => computeSky(now, coords.lat, coords.lng), [now, coords]);

  const value: SkyContextValue = {
    now,
    mounted,
    speed,
    setSpeed,
    weather,
    setWeather,
    coords,
    located,
    requestLocation,
    resetToNow,
    sky,
  };

  return <SkyContext.Provider value={value}>{children}</SkyContext.Provider>;
}

export function useSky() {
  const ctx = useContext(SkyContext);
  if (!ctx) throw new Error("useSky must be used within <SkyProvider>");
  return ctx;
}
