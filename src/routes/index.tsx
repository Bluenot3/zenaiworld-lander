import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTimeOfDay } from "@/hooks/useTimeOfDay";
import { TreasuryPatternBackground } from "@/components/treasury/TreasuryPatternBackground";
import { HolographicSecurityStrip } from "@/components/treasury/HolographicSecurityStrip";
import { ZenMedallion } from "@/components/treasury/ZenMedallion";
import { CertificateFrame } from "@/components/treasury/CertificateFrame";
import { OrnamentalCard } from "@/components/treasury/OrnamentalCard";
import { CredentialBadge } from "@/components/treasury/CredentialBadge";
import { GuillocheOverlay } from "@/components/treasury/GuillocheOverlay";
import { MicroprintBorder } from "@/components/treasury/MicroprintBorder";
import { AuroraHorizon } from "@/components/treasury/AuroraHorizon";
import { SkyAtmosphere } from "@/components/treasury/SkyAtmosphere";
import { MagicParticles } from "@/components/treasury/MagicParticles";
import { FederalSeal } from "@/components/treasury/FederalSeal";
import { ZenLogo } from "@/components/treasury/ZenLogo";
import { NoteNumeral, SerialStrip, NoteCornerFrame } from "@/components/treasury/BanknoteOrnaments";
import { LiveMetrics } from "@/components/treasury/LiveMetrics";
import { SocialConstellation } from "@/components/treasury/SocialConstellation";
import { useInView } from "@/hooks/useInView";
import heroBg from "@/assets/treasury-hero-bg.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "ZEN AI Co. | AI Literacy, Arsenal Automation, and Verified AI Credentials",
      },
      {
        name: "description",
        content:
          "ZEN AI Co. builds AI literacy, automation, and credential infrastructure through AI Pioneer, Arsenal, ZEN Vanguard, AI Arena, and blockchain-verified Zen Cards.",
      },
      {
        property: "og:title",
        content:
          "ZEN AI Co. | AI Literacy, Arsenal Automation & Verified AI Credentials",
      },
      {
        property: "og:description",
        content:
          "Learn AI. Build systems. Verify capability. The literacy, automation, and credential infrastructure for the AI era.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

/* ---------- External link helper ---------- */
const ARSENAL = "https://qubit.earth";
const AIPIONEER = "https://aipioneer.zen.ai/";
const MAILTO = "mailto:ZENAI.BIZ";
const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

/* ---------- Inline icons (consistent weight) ---------- */
const Icon = {
  arsenal: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3 5 5 1-3.5 4 1 6L12 19l-5.5 -1 1-6L4 8l5-1z" />
    </svg>
  ),
  pioneer: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6l9-3 9 3-9 3-9-3zM6 9.5V15c0 1.5 2.7 3 6 3s6-1.5 6-3V9.5M21 9v5" />
    </svg>
  ),
  vanguard: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  homeschool: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6" />
    </svg>
  ),
  trainer: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="7" r="3" /><path d="M3 21v-1a6 6 0 0 1 12 0v1M16 3.5a3 3 0 0 1 0 7M21 21v-1a6 6 0 0 0-4-5.6" />
    </svg>
  ),
  cards: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h4" />
    </svg>
  ),
  arena: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  ),
  weekly: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h12a2 2 0 0 1 2 2v12a2 2 0 0 0 2 2H6a2 2 0 0 1-2-2z" /><path d="M8 8h6M8 12h6M8 16h3" />
    </svg>
  ),
  verify: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12l2 2 4-4M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
    </svg>
  ),
  node: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><circle cx="12" cy="18" r="2" />
      <path d="M7.7 7.5l2.6 9M16.3 7.5l-2.6 9M8 6h8" />
    </svg>
  ),
  globe: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  ),
  arrow: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const NAV = [
  { label: "Proof", href: "#metrics" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Arsenal", href: "#arsenal" },
  { label: "AI Pioneer", href: "#pioneer" },
  { label: "Programs", href: "#programs" },
  { label: "Command Center", href: "#command" },
];

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="glass-panel border-x-0 border-t-0">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href="#top" className="flex items-center gap-3">
            <ZenLogo variant="icon" size={38} glow />
            <span className="font-display text-xl font-semibold tracking-wide text-zen-platinum">
              ZEN AI Co.
            </span>
          </a>
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV.map((n) => (
              <a key={n.label} href={n.href} className="text-sm text-muted-foreground transition-colors hover:text-zen-platinum">
                {n.label}
              </a>
            ))}
            <Link to="/wiki" className="text-sm text-zen-gold transition-colors hover:brightness-110">
              Knowledge Base
            </Link>
          </nav>
          <a
            href={ARSENAL}
            {...ext}
            className="rounded-lg px-5 py-2 text-sm font-semibold text-zen-ink transition-all hover:brightness-110"
            style={{ background: "var(--grad-gold-platinum)" }}
          >
            Launch Arsenal
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-20">
      <TreasuryPatternBackground variant="hero" />

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBg})`,
          opacity: 0.32,
          maskImage:
            "radial-gradient(120% 110% at 78% 38%, black 8%, rgba(0,0,0,0.28) 50%, transparent 84%)",
          WebkitMaskImage:
            "radial-gradient(120% 110% at 78% 38%, black 8%, rgba(0,0,0,0.28) 50%, transparent 84%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: "radial-gradient(70% 60% at 75% 32%, rgba(246,150,79,0.20), transparent 60%)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[2] md:hidden"
        style={{ background: "linear-gradient(180deg, rgba(8,25,30,0.82) 0%, rgba(8,25,30,0.42) 46%, rgba(8,25,30,0.78) 100%)" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[2] hidden w-3/5 md:block"
        style={{ background: "linear-gradient(90deg, rgba(8,25,30,0.94) 0%, rgba(8,25,30,0.70) 48%, transparent 100%)" }}
        aria-hidden="true"
      />

      <HolographicSecurityStrip className="absolute left-[18%] top-0 z-[2] h-full opacity-70" width={44} />
      <HolographicSecurityStrip className="absolute right-[14%] top-0 z-[2] h-full opacity-50" orientation="diagonal" width={30} />
      <MagicParticles className="z-[3]" count={84} lines={11} opacity={0.8} />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: copy */}
        <div className="animate-rise">
          <div className="mb-6 flex items-center gap-4">
            <ZenLogo variant="icon" size={68} glow />
            <div className="flex flex-col">
              <span className="font-display text-2xl font-semibold leading-none text-zen-platinum">ZEN AI Co.</span>
              <SerialStrip className="mt-2" serial="EST. MMXXIII · SOVEREIGN AI TREASURY" />
            </div>
          </div>
          <CredentialBadge label="Learn AI · Build Systems · Verify Capability" tone="emerald" />
          <h1 className="mt-7 text-4xl font-medium leading-[1.04] text-zen-platinum md:text-6xl">
            AI Literacy Was the Beginning.
            <br />
            <span className="text-currency font-display">Execution Is the Infrastructure.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
            ZEN AI Co. turns artificial intelligence into real capability: youth AI literacy,
            Arsenal-powered agents and automations, professional AI operator training, global
            cohorts, and blockchain-verified proof of work.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={ARSENAL}
              {...ext}
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-zen-ink transition-all hover:brightness-110"
              style={{ background: "var(--grad-emerald-gold)", boxShadow: "var(--shadow-emerald)" }}
            >
              Launch Arsenal {Icon.arrow}
            </a>
            <a
              href={AIPIONEER}
              {...ext}
              className="inline-flex items-center gap-2 rounded-lg border px-6 py-3.5 text-sm font-medium text-zen-platinum transition-colors hover:border-zen-gold/60"
              style={{ borderColor: "rgba(214,177,94,0.3)" }}
            >
              Explore AI Pioneer
            </a>
            <a
              href="#ecosystem"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-3.5 text-sm font-medium text-muted-foreground transition-colors hover:text-zen-platinum"
            >
              View Ecosystem
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
            {[
              ["2023", "First U.S. youth AI literacy program"],
              ["11–18", "Builders shipping real AI"],
              ["6+", "Countries reached"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-2xl font-semibold text-engrave">{n}</div>
                <div className="micro-label mt-1 text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: command interface */}
        <div className="relative animate-float">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[820px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(closest-side, rgba(6,18,22,0.86) 38%, rgba(6,18,22,0.55) 60%, transparent 78%)" }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.56] opacity-60 sm:scale-90 sm:opacity-85 lg:scale-100 lg:opacity-95"
            aria-hidden="true"
          >
            <FederalSeal size={780} />
          </div>

          <CertificateFrame>
            <NoteCornerFrame value="Z" size={54} inset={14} opacity={0.32} />
            <div className="p-7">
              <div className="flex items-center justify-between">
                <div>
                  <div className="micro-label text-muted-foreground">ZEN Command Interface</div>
                  <div className="font-display text-2xl font-semibold text-zen-platinum">Capability Stack</div>
                </div>
                <ZenMedallion size={64} glyph="verify" />
              </div>

              <div className="my-6 h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(214,177,94,0.5), transparent)" }} />

              <div className="space-y-2.5">
                {[
                  ["Execution core", "Arsenal — agents & automations"],
                  ["Literacy layer", "AI Pioneer — youth build & deploy"],
                  ["Proof layer", "Zen Cards — blockchain-verified"],
                  ["Model layer", "AI Arena — access & comparison"],
                  ["Expansion layer", "South Africa · global nodes"],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between rounded-lg px-3.5 py-2.5"
                    style={{ background: "rgba(8,16,8,0.5)", border: "1px solid rgba(227,185,85,0.14)" }}
                  >
                    <span className="micro-label text-zen-gold">{k}</span>
                    <span className="text-sm font-medium text-zen-platinum">{v}</span>
                  </div>
                ))}
              </div>

              <div className="relative mt-6 overflow-hidden rounded-lg p-4" style={{ background: "rgba(8,16,8,0.55)", border: "1px solid rgba(182,212,74,0.22)" }}>
                <GuillocheOverlay className="absolute -right-10 -top-10 h-40 w-40 text-zen-holo" color="#7fe8da" rings={4} opacity={0.2} />
                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="micro-label text-zen-holo">Verified Capability</div>
                    <div className="mt-1 font-mono text-xs text-muted-foreground">ZEN-CARD · ON-CHAIN PROOF</div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-zen-holo" style={{ border: "1px solid rgba(182,212,74,0.42)" }}>
                    {Icon.verify}
                  </div>
                </div>
              </div>
            </div>
          </CertificateFrame>

          <div className="absolute -bottom-8 -left-8 hidden md:block">
            <div className="glass-panel rounded-xl p-4">
              <ZenMedallion size={56} glyph="node" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10 mx-auto max-w-7xl px-6">
        <MicroprintBorder className="w-full" />
      </div>
    </section>
  );
}

/* ---------- Proof ribbon ---------- */
const PROOF_CHIPS = [
  "First youth AI literacy program in U.S. history",
  "Started late 2023",
  "3rd Annual AI Pioneer Program",
  "Ages 11–18",
  "Students build & deploy real AI apps",
  "6+ countries reached",
  "South Africa · inaugural Africa rollout",
  "Arsenal execution layer",
  "Blockchain-verified Zen Cards",
];

function ProofRibbon() {
  return (
    <section className="relative border-y px-6 py-5" style={{ borderColor: "rgba(214,177,94,0.14)" }}>
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: "linear-gradient(90deg, rgba(8,25,30,0.9), transparent 12%, transparent 88%, rgba(8,25,30,0.9))" }}
        aria-hidden="true"
      />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2.5">
        {PROOF_CHIPS.map((c) => (
          <span
            key={c}
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted-foreground"
            style={{ border: "1px solid rgba(127,232,218,0.18)", background: "rgba(8,16,8,0.45)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--grad-emerald-gold)" }} />
            {c}
          </span>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({ label, title, desc, align = "center" }: { label: string; title: string; desc?: string; align?: "center" | "left" }) {
  const center = align === "center";
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(26px)",
        transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <div className={`mb-5 flex items-center gap-3 ${center ? "justify-center" : ""}`}>
        <span className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, rgba(214,177,94,0.6))" }} />
        <span className="micro-label text-zen-gold">{label}</span>
        <span className="h-px w-10" style={{ background: "linear-gradient(90deg, rgba(214,177,94,0.6), transparent)" }} />
      </div>
      <h2 className="text-3xl font-medium leading-tight text-zen-platinum sm:text-4xl md:text-5xl">{title}</h2>
      {desc && <p className="mt-5 text-base leading-relaxed text-muted-foreground">{desc}</p>}
    </div>
  );
}

/* ---------- Proof of scale (metrics) ---------- */
function MetricsSection() {
  return (
    <section id="metrics" className="relative px-6 py-20 md:py-28">
      <TreasuryPatternBackground variant="veil" watermark={false} />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-40 bg-gradient-to-b from-[rgba(6,18,22,0.55)] to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-[rgba(6,18,22,0.55)] to-transparent" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <SectionHeading
          label="Proof of Scale"
          title="Traction you can measure. Momentum you can feel."
          desc="Real usage across the ZEN ecosystem — generations shipped, operators onboarded, and outcomes verified."
        />
        <div className="mt-12">
          <LiveMetrics />
        </div>
      </div>
    </section>
  );
}

/* ---------- Ecosystem ---------- */
const ECOSYSTEM = [
  { title: "Arsenal", value: "Agents, workflows & business systems", icon: Icon.arsenal, href: ARSENAL, accent: "gold" as const, cta: "Launch", external: true },
  { title: "AI Pioneer", value: "Youth build-and-deploy AI literacy", icon: Icon.pioneer, href: AIPIONEER, accent: "emerald" as const, cta: "Explore", external: true },
  { title: "ZEN Vanguard", value: "Adult AI operator training", icon: Icon.vanguard, href: "#programs", accent: "holo" as const, cta: "Learn more" },
  { title: "Homeschool Kit", value: "Family & micro-school AI curriculum", icon: Icon.homeschool, href: "#programs", accent: "gold" as const, cta: "Learn more" },
  { title: "Train-the-Trainer", value: "Certified facilitators & regional scale", icon: Icon.trainer, href: "#programs", accent: "emerald" as const, cta: "Learn more" },
  { title: "Zen Cards", value: "Verified credentials & proof of work", icon: Icon.cards, href: "https://www.zenai.world/legacydossier", accent: "holo" as const, cta: "Verify", external: true },
  { title: "AI Arena", value: "Model comparison & AI access", icon: Icon.arena, href: "https://zenarena.ai/", accent: "gold" as const, cta: "Enter", external: true },
  { title: "ZEN Weekly", value: "Intelligence, media & trend tracking", icon: Icon.weekly, href: "https://www.zenai.world/media", accent: "emerald" as const, cta: "Read", external: true },
];

function Ecosystem() {
  return (
    <section id="ecosystem" className="relative px-6 py-24 md:py-28">
      <TreasuryPatternBackground variant="section" watermark={false} />
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionHeading
          label="The ZEN Ecosystem"
          title="One command center. Every layer of capability."
          desc="Move from passive AI use into verified capability — learning, building, deploying, automating, showcasing, and proving real work."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ECOSYSTEM.map((c) => (
            <OrnamentalCard key={c.title} accent={c.accent} watermark={false}>
              <a
                href={c.href}
                {...(c.external ? ext : {})}
                className="flex h-full flex-col p-6"
              >
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-lg text-zen-platinum"
                  style={{ border: "1px solid rgba(227,185,85,0.3)", background: "rgba(8,16,8,0.6)" }}
                >
                  {c.icon}
                </div>
                <h3 className="mt-5 text-lg font-medium text-zen-platinum">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{c.value}</p>
                <div className="mt-5 flex items-center gap-2 text-sm font-medium text-zen-gold transition-transform duration-300 group-hover:translate-x-1">
                  {c.cta} {Icon.arrow}
                </div>
              </a>
            </OrnamentalCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Arsenal spotlight ---------- */
const ARSENAL_CHIPS = [
  "Agent Builder", "Business Spaces", "Workflow Automation", "Knowledge Vaults",
  "Model Routing", "Dashboards", "Messaging Channels", "Marketplace",
  "Custom Apps", "Automation Audits",
];

function ArsenalSpotlight() {
  return (
    <section id="arsenal" className="relative px-6 py-24 md:py-28">
      <TreasuryPatternBackground variant="subtle" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <CertificateFrame className="overflow-hidden">
          <NoteCornerFrame value="Z" size={68} inset={20} opacity={0.28} />
          <div className="grid gap-10 p-8 md:p-14 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <CredentialBadge label="Execution Engine" tone="gold" />
              <h2 className="mt-6 text-3xl font-medium leading-[1.08] text-zen-platinum md:text-4xl">
                Arsenal is where AI literacy becomes{" "}
                <span className="text-engrave">operational power.</span>
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
                Build agents, launch workflows, manage knowledge, create dashboards, connect tools,
                route models, and turn repeated work into AI-powered systems.
              </p>
              <a
                href={ARSENAL}
                {...ext}
                className="mt-8 inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-zen-ink transition-all hover:brightness-110"
                style={{ background: "var(--grad-gold-platinum)", boxShadow: "var(--glow-gold)" }}
              >
                Launch Arsenal {Icon.arrow}
              </a>
            </div>

            <div className="relative rounded-xl p-5" style={{ background: "rgba(8,16,8,0.5)", border: "1px solid rgba(214,177,94,0.16)" }}>
              <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "rgba(214,177,94,0.12)" }}>
                <span className="micro-label text-zen-holo">Arsenal Console</span>
                <span className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-zen-emerald/70" />
                  <span className="h-2 w-2 rounded-full bg-zen-gold/70" />
                  <span className="h-2 w-2 rounded-full bg-zen-holo/70" />
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                {ARSENAL_CHIPS.map((chip) => (
                  <div
                    key={chip}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-zen-platinum transition-colors hover:border-zen-gold/50"
                    style={{ border: "1px solid rgba(127,232,218,0.16)", background: "rgba(8,16,8,0.4)" }}
                  >
                    <span className="text-zen-gold">{Icon.node}</span>
                    {chip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CertificateFrame>
      </div>
    </section>
  );
}

/* ---------- AI Pioneer proof ---------- */
const PIONEER_BULLETS = [
  "Foundations of AI & creativity",
  "Agents, prompts, APIs & model behavior",
  "Hugging Face / Google AI Studio / Gradio workflows",
  "Portfolio & showcase outcomes",
  "Responsible AI & safety",
  "Certificate + Zen Card credential path",
];

function PioneerSection() {
  return (
    <section id="pioneer" className="relative px-6 py-24 md:py-28">
      <TreasuryPatternBackground variant="section" watermark={false} />
      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1fr]">
        <div>
          <SectionHeading
            align="left"
            label="Flagship Youth Program"
            title="The first youth AI literacy program in U.S. history."
          />
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            AI Pioneer is ZEN's flagship youth program for ages 11–18. Students learn AI by building,
            deploying, documenting, and showcasing real AI projects.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={AIPIONEER} {...ext} className="inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-zen-ink transition-all hover:brightness-110" style={{ background: "var(--grad-emerald-gold)", boxShadow: "var(--shadow-emerald)" }}>
              Explore AI Pioneer {Icon.arrow}
            </a>
            <a href="https://www.zenai.world/ailiteracyyouth" {...ext} className="inline-flex items-center gap-2 rounded-lg border px-6 py-3.5 text-sm font-medium text-zen-platinum transition-colors hover:border-zen-gold/60" style={{ borderColor: "rgba(214,177,94,0.3)" }}>
              Youth AI Literacy
            </a>
          </div>
        </div>

        <OrnamentalCard accent="emerald">
          <div className="p-7">
            <div className="flex items-center justify-between">
              <ZenMedallion size={60} glyph="shield" />
              <CredentialBadge label="3rd Annual Cohort" tone="emerald" />
            </div>
            <ul className="mt-6 space-y-3">
              {PIONEER_BULLETS.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-zen-platinum">
                  <span className="mt-0.5 shrink-0 text-zen-emerald">{Icon.verify}</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </OrnamentalCard>
      </div>
    </section>
  );
}

/* ---------- Programs tabs ---------- */
const PROGRAMS = [
  { name: "AI Pioneer Program", audience: "Youth ages 11–18", outcome: "Public AI project + showcase portfolio", credential: "ZEN AI Pioneer Certificate + Zen Card", href: AIPIONEER, external: true },
  { name: "ZEN Vanguard", audience: "Adults & professionals", outcome: "Operational AI workflows & deployed systems", credential: "ZEN AI Operator Certificate + Zen Card", href: MAILTO },
  { name: "Homeschool Kit", audience: "Families, micro-schools & pods", outcome: "Guided at-home AI curriculum & projects", credential: "Completion Certificate + Zen Card path", href: MAILTO },
  { name: "Blockchain Literacy", audience: "Builders & credential holders", outcome: "Verifiable on-chain proof-of-work fluency", credential: "Blockchain Literacy Zen Card", href: MAILTO },
  { name: "Train-the-Trainer", audience: "Educators & facilitators", outcome: "Certified capacity to run ZEN cohorts", credential: "ZEN Certified Facilitator + Zen Card", href: MAILTO },
  { name: "Zen Cards", audience: "All ZEN members", outcome: "Blockchain-verified proof of skill & projects", credential: "Portable on-chain credential", href: "https://www.zenai.world/legacydossier", external: true },
];

function Programs() {
  const [active, setActive] = useState(0);
  const p = PROGRAMS[active];
  return (
    <section id="programs" className="relative px-6 py-24 md:py-28">
      <TreasuryPatternBackground variant="veil" watermark={false} />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-40 bg-gradient-to-b from-[rgba(6,18,22,0.55)] to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-[rgba(6,18,22,0.55)] to-transparent" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionHeading
          label="Programs"
          title="Structured paths. Verifiable outcomes."
          desc="Every track ends in a credential — audience, outcome, and proof, by design."
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-wrap gap-2 lg:flex-col">
            {PROGRAMS.map((prog, i) => (
              <button
                key={prog.name}
                onClick={() => setActive(i)}
                className="tap-target flex items-center justify-between gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition-all"
                style={{
                  border: `1px solid ${active === i ? "rgba(214,177,94,0.5)" : "rgba(127,232,218,0.14)"}`,
                  background: active === i ? "rgba(214,177,94,0.1)" : "rgba(8,16,8,0.4)",
                  color: active === i ? "var(--zen-platinum)" : "var(--muted-foreground)",
                }}
              >
                {prog.name}
                {active === i && <span className="text-zen-gold">{Icon.arrow}</span>}
              </button>
            ))}
          </div>

          <CertificateFrame>
            <div className="p-8 md:p-10">
              <h3 className="font-display text-2xl font-semibold text-zen-platinum">{p.name}</h3>
              <div className="mt-6 space-y-4">
                {[
                  ["Audience", p.audience],
                  ["Outcome", p.outcome],
                  ["Credential", p.credential],
                ].map(([k, v]) => (
                  <div key={k} className="border-b pb-4" style={{ borderColor: "rgba(214,177,94,0.12)" }}>
                    <div className="micro-label text-zen-gold">{k}</div>
                    <div className="mt-1.5 text-base text-zen-platinum">{v}</div>
                  </div>
                ))}
              </div>
              <a
                href={p.href}
                {...(p.external ? ext : {})}
                className="mt-7 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-zen-ink transition-all hover:brightness-110"
                style={{ background: "var(--grad-emerald-gold)" }}
              >
                {p.external ? "Explore Program" : "Request Access"} {Icon.arrow}
              </a>
            </div>
          </CertificateFrame>
        </div>
      </div>
    </section>
  );
}

/* ---------- Global expansion ---------- */
const GLOBAL_CHIPS = [
  "Johannesburg + Cape Town",
  "~1,100 initial student target",
  "3 partner organizations",
  "English + Zulu localization",
  "Build → Deploy → Showcase → Certificate",
];

function GlobalExpansion() {
  const { isNight } = useTimeOfDay();
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 py-28 md:py-36">
      {/* the living sky is the hero of this section — cinematic, feature-grade */}
      <SkyAtmosphere fixed={false} intensity="feature" />
      {/* the bright dawn horizon only complements day/dusk — night keeps its true cosmos */}
      {!isNight && (
        <AuroraHorizon intensity="bright" className="opacity-45 mix-blend-screen" />
      )}
      <MagicParticles className="z-[2]" count={70} lines={9} opacity={0.6} />


      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="relative mx-auto max-w-3xl text-center">
          {/* soft legibility aura so the copy stays crisp over any sky phase */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[130%] w-[128%] -translate-x-1/2 -translate-y-1/2"
            style={{ background: "radial-gradient(60% 55% at 50% 50%, rgba(5,12,20,0.42), transparent 72%)", filter: "blur(20px)" }}
            aria-hidden="true"
          />
          <span className="micro-label text-foil">Endless Possibility · Global Expansion</span>
          <h2 className="mt-6 text-4xl font-medium leading-[1.05] text-zen-platinum md:text-6xl" style={{ textShadow: "0 2px 24px rgba(4,10,20,0.5)" }}>
            A living sky over an{" "}
            <span className="text-foil">endless</span> horizon of capability.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zen-platinum md:text-lg" style={{ textShadow: "0 1px 12px rgba(4,10,20,0.55)" }}>
            The ZEN sky shifts with your local time — luminous dawns, bright days, burning
            dusks, and sweeping starfields with aurora and meteors after dark. AI literacy
            infrastructure is going global, and the horizon keeps expanding.
          </p>
        </div>


        {/* floating glass tiles suspended in the sky */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GLOBAL_CHIPS.map((c, i) => (
            <div
              key={c}
              className="animate-float rounded-2xl border px-6 py-6 backdrop-blur-xl"
              style={{
                borderColor: "rgba(149,232,255,0.24)",
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.10), rgba(8,20,28,0.28))",
                boxShadow: "0 18px 50px -20px rgba(0,0,0,0.6)",
                animationDelay: `${i * 0.6}s`,
              }}
            >
              <span className="text-zen-gold">{Icon.globe}</span>
              <p className="mt-3 text-sm font-medium leading-snug text-zen-platinum">{c}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <a
            href={MAILTO}
            className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold text-zen-ink transition-all hover:brightness-110"
            style={{ background: "var(--grad-gold-platinum)" }}
          >
            Partner With ZEN {Icon.arrow}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Business solutions ---------- */
const BUSINESS_CHIPS = [
  "Custom AI Agents", "Workflow Automation", "Internal Knowledge Assistants",
  "Customer Support AI", "Program Dashboards", "Grant/Sponsorship Automation",
  "Education Cohort Systems", "Business Spaces", "Automation Audits",
];

function BusinessSolutions() {
  return (
    <section className="relative px-6 py-24 md:py-28">
      <TreasuryPatternBackground variant="section" watermark={false} />
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionHeading
          label="Business Solutions"
          title="AI literacy becomes automation. Automation becomes economic output."
          desc="ZEN helps founders, businesses, schools, nonprofits, and teams turn repeated work into agents, workflows, dashboards, knowledge systems, and custom AI apps."
        />
        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BUSINESS_CHIPS.map((c) => (
            <div
              key={c}
              className="group flex items-center gap-3 rounded-xl px-5 py-4 text-sm font-medium text-zen-platinum transition-all hover:-translate-y-0.5"
              style={{ border: "1px solid rgba(127,232,218,0.16)", background: "rgba(8,16,8,0.4)" }}
            >
              <span className="text-zen-gold transition-transform group-hover:scale-110">{Icon.node}</span>
              {c}
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href={MAILTO} className="inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-zen-ink transition-all hover:brightness-110" style={{ background: "var(--grad-emerald-gold)" }}>
            Build With ZEN {Icon.arrow}
          </a>
          <a href={ARSENAL} {...ext} className="inline-flex items-center gap-2 rounded-lg border px-6 py-3.5 text-sm font-medium text-zen-platinum transition-colors hover:border-zen-gold/60" style={{ borderColor: "rgba(214,177,94,0.3)" }}>
            Launch Arsenal
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Command Center link hub ---------- */
const LINK_GROUPS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Build",
    links: [
      { label: "Arsenal", href: "https://qubit.earth" },
      { label: "AI Arena", href: "https://us.zenai.biz/" },
      { label: "ZEN Arena", href: "https://zenarena.ai/" },
      { label: "Tools", href: "https://www.zenai.world/tools" },
      { label: "ZEN Pen", href: "https://www.zenai.world/zen-pen" },
      { label: "Vibe Book", href: "https://www.zenai.world/vibe-book" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "AI Pioneer", href: "https://aipioneer.zen.ai/" },
      { label: "AI Literacy Youth", href: "https://www.zenai.world/ailiteracyyouth" },
      { label: "Challenges", href: "https://www.zenai.world/challenges" },
      { label: "AI Literacy Report", href: "https://www.perplexity.ai/page/ai-literacy-initiatives-report-kk1_esVDR8iJEQChSlXc0g" },
    ],
  },
  {
    heading: "Verify",
    links: [
      { label: "Legacy Dossier", href: "https://www.zenai.world/legacydossier" },
      { label: "Leaderboard", href: "https://www.zenai.world/leaderboard" },
    ],
  },
  {
    heading: "Media",
    links: [
      { label: "Blog", href: "https://www.zenai.world/blog" },
      { label: "Media", href: "https://www.zenai.world/media" },
      { label: "YouTube", href: "https://www.youtube.com/@ZENAIML" },
      { label: "X", href: "https://x.com/ZEN_AGI" },
      { label: "LinkedIn", href: "https://www.linkedin.com/company/z3nai" },
    ],
  },
  {
    heading: "Community",
    links: [
      { label: "Groups", href: "https://www.zenai.world/groups" },
      { label: "Telegram", href: "https://t.me/ZENOAI" },
      { label: "Discord", href: "https://discord.gg/qbKgCc46Ym" },
      { label: "Instagram", href: "https://www.instagram.com/0xvvs1" },
      { label: "TikTok", href: "https://www.tiktok.com/@milennialai" },
      { label: "GitHub", href: "https://github.com/Bluenot3" },
      { label: "Linq", href: "https://linqapp.com/zenai?r=link" },
    ],
  },
  {
    heading: "Legal / Contact",
    links: [
      { label: "Email", href: MAILTO },
      { label: "Privacy", href: "https://www.zenai.world/privacy-policy" },
      { label: "Terms", href: "https://www.zenai.world/terms-and-conditions" },
      { label: "Pricing", href: "https://www.zenai.world/pricing" },
    ],
  },
];

function CommandCenter() {
  return (
    <section id="command" className="relative px-6 py-24 md:py-28">
      <TreasuryPatternBackground variant="veil" watermark={false} />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-40 bg-gradient-to-b from-[rgba(6,18,22,0.55)] to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-[rgba(6,18,22,0.55)] to-transparent" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionHeading
          label="ZEN Command Center"
          title="Every ZEN destination, one panel."
          desc="Build, learn, verify, and connect — the full ecosystem without the clutter."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {LINK_GROUPS.map((g) => (
            <OrnamentalCard key={g.heading} accent="holo" watermark={false}>
              <div className="p-6">
                <div className="micro-label text-zen-gold">{g.heading}</div>
                <ul className="mt-4 space-y-2.5">
                  {g.links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        {...(l.href.startsWith("mailto:") ? {} : ext)}
                        className="group flex items-center justify-between text-sm text-muted-foreground transition-colors hover:text-zen-platinum"
                      >
                        {l.label}
                        <span className="opacity-0 transition-opacity group-hover:opacity-70">{Icon.arrow}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </OrnamentalCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
function FinalCTA() {
  const { isNight } = useTimeOfDay();
  return (
    <section id="apply" className="relative flex min-h-[85vh] items-center overflow-hidden px-6 py-28 md:py-36">
      {/* the living sky becomes the stage for the closing statement */}
      <SkyAtmosphere fixed={false} intensity="feature" />
      {!isNight && (
        <AuroraHorizon intensity="bright" className="opacity-40 mix-blend-screen" />
      )}
      <MagicParticles className="z-[2]" count={64} lines={9} opacity={0.7} />
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* legibility aura so copy stays crisp over any sky phase */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[150%] w-[135%] -translate-x-1/2 -translate-y-1/2"
          style={{ background: "radial-gradient(60% 55% at 50% 50%, rgba(5,12,20,0.46), transparent 74%)", filter: "blur(24px)" }}
          aria-hidden="true"
        />
        <span className="micro-label text-foil">The ZEN Horizon</span>
        <h2 className="mt-6 text-4xl font-medium leading-[1.05] text-zen-platinum md:text-6xl" style={{ textShadow: "0 2px 26px rgba(4,10,20,0.55)" }}>
          The future belongs to builders who can{" "}
          <span className="text-currency font-display">prove what they built.</span>
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href={ARSENAL} {...ext} className="inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-zen-ink transition-all hover:brightness-110" style={{ background: "var(--grad-gold-platinum)", boxShadow: "var(--glow-gold)" }}>
            Launch Arsenal {Icon.arrow}
          </a>
          <a href={AIPIONEER} {...ext} className="inline-flex items-center gap-2 rounded-lg border px-6 py-3.5 text-sm font-medium text-zen-platinum transition-colors hover:border-zen-gold/60" style={{ borderColor: "rgba(214,177,94,0.3)" }}>
            Explore AI Pioneer
          </a>
          <a href={MAILTO} className="inline-flex items-center gap-2 rounded-lg border px-6 py-3.5 text-sm font-medium text-zen-platinum transition-colors hover:border-zen-gold/60" style={{ borderColor: "rgba(214,177,94,0.3)" }}>
            Partner With ZEN
          </a>
          <a href="#command" className="inline-flex items-center gap-2 rounded-lg px-5 py-3.5 text-sm font-medium text-zen-platinum/80 transition-colors hover:text-zen-platinum">
            View All Links
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="relative overflow-hidden border-t px-6 py-14" style={{ borderColor: "rgba(214,177,94,0.14)" }}>
      <TreasuryPatternBackground variant="veil" watermark={false} />
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Socials constellation — the centerpiece */}
        <SocialConstellation />

        {/* Compact identity + nav row */}
        <div className="mt-12 flex flex-col gap-8 border-t pt-10 md:flex-row md:items-start md:justify-between" style={{ borderColor: "rgba(214,177,94,0.12)" }}>
          <div className="max-w-xs">
            <div className="flex items-center gap-3">
              <ZenLogo variant="icon" size={36} glow />
              <span className="font-display text-lg font-semibold text-zen-platinum">ZEN AI Co.</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              AI literacy, automation, and credential infrastructure for the AI era.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-x-10 gap-y-6">
            {[
              ["Build", [["Arsenal", ARSENAL], ["AI Arena", "https://zenarena.ai/"], ["Tools", "https://www.zenai.world/tools"]]],
              ["Learn", [["AI Pioneer", AIPIONEER], ["Youth Literacy", "https://www.zenai.world/ailiteracyyouth"], ["Challenges", "https://www.zenai.world/challenges"]]],
              ["Company", [["Pricing", "https://www.zenai.world/pricing"], ["Privacy", "https://www.zenai.world/privacy-policy"], ["Terms", "https://www.zenai.world/terms-and-conditions"], ["Contact", MAILTO]]],
            ].map(([h, items]) => (
              <div key={h as string}>
                <div className="micro-label text-zen-gold">{h as string}</div>
                <ul className="mt-3 space-y-2.5">
                  {(items as string[][]).map(([label, href]) => (
                    <li key={label}>
                      <a href={href} {...(href.startsWith("mailto:") ? {} : ext)} className="text-sm text-muted-foreground transition-colors hover:text-zen-platinum">{label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <SerialStrip serial="ZEN · A 00000001 K · SERIES MMXXVI · VERIFIED ON-CHAIN" />
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground md:flex-row">
          <span className="font-mono tracking-wider">© MMXXVI ZEN AI CO.</span>
          <span className="font-mono tracking-wider">SAM.gov ready · UEI: UPQGSDYW9K16</span>
        </div>
      </div>
    </footer>
  );
}

/* App-style sticky action bar — native-iOS parity on mobile */
function MobileActionBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="glass-panel border-x-0 border-b-0 px-4 pb-3 pt-3">
        <div className="flex items-center gap-3">
          <a
            href={ARSENAL}
            {...ext}
            className="tap-target flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-zen-ink active:brightness-95"
            style={{ background: "var(--grad-emerald-gold)", boxShadow: "var(--shadow-emerald)" }}
          >
            Launch Arsenal {Icon.arrow}
          </a>
          <a
            href="#ecosystem"
            className="tap-target flex items-center justify-center rounded-xl border px-5 py-3.5 text-sm font-medium text-zen-platinum active:bg-white/5"
            style={{ borderColor: "rgba(214,177,94,0.3)" }}
          >
            Ecosystem
          </a>
        </div>
      </div>
    </div>
  );
}

function Index() {
  return (
    <main className="relative min-h-screen bg-transparent">
      <SkyAtmosphere />
      <Nav />
      <Hero />
      <ProofRibbon />
      <MetricsSection />
      <Ecosystem />
      <ArsenalSpotlight />
      <PioneerSection />
      <Programs />
      <GlobalExpansion />
      <BusinessSolutions />
      <CommandCenter />
      <FinalCTA />
      <Footer />
      <div className="h-20 lg:hidden" />
      <MobileActionBar />
    </main>
  );
}
