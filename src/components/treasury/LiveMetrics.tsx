import { useCountUp } from "@/hooks/useCountUp";
import { useInView } from "@/hooks/useInView";
import { GuillocheOverlay } from "@/components/treasury/GuillocheOverlay";

interface Metric {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  sub: string;
}

/* Headline metrics carried over from zenai.world */
const METRICS: Metric[] = [
  { value: 21.4, decimals: 1, suffix: "M", label: "Generations", sub: "AI outputs created across ZEN" },
  { value: 34.2, decimals: 1, suffix: "K", label: "Members", sub: "Operators & builders worldwide" },
  { value: 150, suffix: "%", label: "Enrollment Surge", sub: "Month-over-month growth" },
  { value: 96, suffix: "%", label: "Completion Rate", sub: "Program completion" },
  { value: 5, suffix: "x", label: "ROI", sub: "Community engagement return" },
  { value: 6, suffix: "+", label: "Countries", sub: "Global cohorts reached" },
];

function formatValue(v: number, m: Metric) {
  const n = m.decimals ? v.toFixed(m.decimals) : Math.round(v).toString();
  return `${m.prefix ?? ""}${n}${m.suffix ?? ""}`;
}

function MetricTile({ m, delay }: { m: Metric; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const v = useCountUp(m.value, inView, 1900);
  return (
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1"
      style={{
        border: "1px solid rgba(214,177,94,0.18)",
        background:
          "linear-gradient(160deg, rgba(16,42,50,0.72), rgba(9,24,30,0.9))",
        boxShadow: "0 24px 60px -40px rgba(0,0,0,0.9)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <GuillocheOverlay
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 text-zen-gold opacity-0 transition-opacity duration-500 group-hover:opacity-30"
        color="#f3d172"
        rings={4}
        opacity={0.4}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(214,177,94,0.6), transparent)" }}
      />
      <div className="relative font-display text-4xl font-semibold tracking-tight text-currency md:text-5xl">
        {formatValue(v, m)}
      </div>
      <div className="relative mt-3 text-sm font-semibold text-zen-platinum">{m.label}</div>
      <div className="relative mt-1 text-xs leading-relaxed text-muted-foreground">{m.sub}</div>
    </div>
  );
}

/**
 * LiveMetrics — the ZEN proof-of-scale board. Numbers ease up from zero as
 * they scroll into view, in animated currency-gradient type. Data mirrors
 * zenai.world's headline traction figures.
 */
export function LiveMetrics() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
      {METRICS.map((m, i) => (
        <MetricTile key={m.label} m={m} delay={(i % 3) * 90} />
      ))}
    </div>
  );
}
