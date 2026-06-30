import { createFileRoute } from "@tanstack/react-router";
import { TreasuryPatternBackground } from "@/components/treasury/TreasuryPatternBackground";
import { HolographicSecurityStrip } from "@/components/treasury/HolographicSecurityStrip";
import { ZenMedallion } from "@/components/treasury/ZenMedallion";
import { CertificateFrame } from "@/components/treasury/CertificateFrame";
import { OrnamentalCard } from "@/components/treasury/OrnamentalCard";
import { PremiumPathCard } from "@/components/treasury/PremiumPathCard";
import { CredentialBadge } from "@/components/treasury/CredentialBadge";
import { SovereignCTASection } from "@/components/treasury/SovereignCTASection";
import { GuillocheOverlay } from "@/components/treasury/GuillocheOverlay";
import { MicroprintBorder } from "@/components/treasury/MicroprintBorder";
import { AuroraHorizon } from "@/components/treasury/AuroraHorizon";
import heroBg from "@/assets/treasury-hero-bg.jpg";
import guillocheSeal from "@/assets/guilloche-seal.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZEN — Sovereign AI Treasury & Credentialing Platform" },
      {
        name: "description",
        content:
          "Treasury-grade infrastructure for AI literacy, Arsenal automation, and verifiable Web3 credentials — built to institutional standard.",
      },
      { property: "og:title", content: "ZEN — Sovereign AI Treasury & Credentialing" },
      {
        property: "og:description",
        content:
          "Where AI literacy, Arsenal automation, and Web3 credentials converge on treasury-grade infrastructure.",
      },
    ],
  }),
  component: Index,
});

/* ---------- Inline icons (consistent weight) ---------- */
const Icon = {
  business: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M5 21V8l7-4 7 4v13M9 21v-6h6v6" />
    </svg>
  ),
  program: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
    </svg>
  ),
  learn: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6l9-3 9 3-9 3-9-3zM6 9.5V15c0 1.5 2.7 3 6 3s6-1.5 6-3V9.5M21 9v5" />
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
};

const NAV = ["Platform", "Programs", "Credentials", "Arsenal", "Proof"];

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="glass-panel border-x-0 border-t-0">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href="/" className="flex items-center gap-3">
            <ZenMedallion size={34} glyph="zen" />
            <span className="font-display text-xl font-semibold tracking-wide text-zen-platinum">
              ZEN
            </span>
            <span className="ml-1 hidden micro-label text-muted-foreground sm:inline">Treasury</span>
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <a key={n} href={`#${n.toLowerCase()}`} className="text-sm text-muted-foreground transition-colors hover:text-zen-platinum">
                {n}
              </a>
            ))}
          </nav>
          <a
            href="#apply"
            className="rounded-lg px-5 py-2 text-sm font-semibold text-zen-ink transition-all hover:brightness-110"
            style={{ background: "var(--grad-gold-platinum)" }}
          >
            Request Access
          </a>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-20">
      <TreasuryPatternBackground variant="hero" />

      {/* currency-grade gold engraving photograph — the centerpiece texture */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroBg})`,
          opacity: 0.55,
          maskImage: "radial-gradient(120% 100% at 78% 40%, black 30%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(120% 100% at 78% 40%, black 30%, transparent 85%)",
        }}
        aria-hidden="true"
      />
      {/* warm glow that ties the engraving to the palette */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: "radial-gradient(70% 60% at 80% 30%, rgba(246,150,79,0.18), transparent 60%)" }}
        aria-hidden="true"
      />

      {/* legibility scrim behind copy */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-full md:w-3/5"
        style={{ background: "linear-gradient(90deg, rgba(8,25,30,0.95) 0%, rgba(8,25,30,0.74) 48%, transparent 100%)" }}
        aria-hidden="true"
      />

      {/* holographic strips */}
      <HolographicSecurityStrip className="absolute left-[18%] top-0 z-[2] h-full opacity-70" width={44} />
      <HolographicSecurityStrip className="absolute right-[14%] top-0 z-[2] h-full opacity-50" orientation="diagonal" width={30} />


      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left: copy */}
        <div className="animate-rise">
          <CredentialBadge label="Sovereign Intelligence Infrastructure" tone="emerald" />
          <h1 className="mt-7 text-5xl font-medium leading-[1.02] text-zen-platinum md:text-7xl">
            The treasury of{" "}
            <span className="text-foil font-display">artificial</span>
            <br />
            <span className="text-currency">intelligence.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
            ZEN unifies AI literacy, Arsenal automation, and verifiable Web3 credentials on a
            single, institution-grade platform — engineered with the rigor of a sovereign treasury.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#apply"
              className="inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold text-zen-ink transition-all hover:brightness-110"
              style={{ background: "var(--grad-emerald-gold)", boxShadow: "var(--shadow-emerald)" }}
            >
              Enter the Treasury
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <a
              href="#programs"
              className="inline-flex items-center gap-2 rounded-lg border px-7 py-3.5 text-sm font-medium text-zen-platinum transition-colors hover:border-zen-gold/60"
              style={{ borderColor: "rgba(214,177,94,0.3)" }}
            >
              View Programs
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4">
            {[
              ["1.2M+", "Credentials issued"],
              ["120+", "AI models integrated"],
              ["99.9%", "Verification uptime"],
            ].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-2xl font-semibold text-engrave">{n}</div>
                <div className="micro-label mt-1 text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: floating certificate interface */}
        <div className="relative animate-float">
          {/* currency-grade guilloche rosette behind the certificate */}
          <GuillocheOverlay
            gradient="currency"
            className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 animate-spin-slow"
            rings={7}
            opacity={0.7}
            weight={1.1}
          />
          <GuillocheOverlay
            gradient="holo"
            className="absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 animate-spin-reverse"
            rings={4}
            opacity={0.5}
            weight={0.9}
          />
          <CertificateFrame>
            <div className="p-7">
              <div className="flex items-center justify-between">
                <div>
                  <div className="micro-label text-muted-foreground">Certificate of</div>
                  <div className="font-display text-2xl font-semibold text-zen-platinum">AI Literacy</div>
                </div>
                <ZenMedallion size={74} glyph="verify" spin />
              </div>

              <div className="my-6 h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(214,177,94,0.5), transparent)" }} />

              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ["Holder", "Sovereign Member"],
                  ["Tier", "Charter · Class I"],
                  ["Ledger", "0xZEN…a91f"],
                  ["Status", "Verified On-Chain"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg p-3" style={{ background: "rgba(8,16,8,0.5)", border: "1px solid rgba(227,185,85,0.14)" }}>
                    <div className="micro-label text-muted-foreground">{k}</div>
                    <div className="mt-1 font-medium text-zen-platinum">{v}</div>
                  </div>
                ))}
              </div>

              <div className="relative mt-6 overflow-hidden rounded-lg p-4" style={{ background: "rgba(8,16,8,0.55)", border: "1px solid rgba(182,212,74,0.22)" }}>
                <GuillocheOverlay className="absolute -right-10 -top-10 h-40 w-40 text-zen-holo" color="#7fe8da" rings={4} opacity={0.2} />
                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="micro-label text-zen-holo">Security Seal</div>
                    <div className="mt-1 font-mono text-xs text-muted-foreground">SHA-256 · ZEN-CERT-2026</div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full text-zen-holo" style={{ border: "1px solid rgba(182,212,74,0.42)" }}>
                    {Icon.verify}
                  </div>
                </div>
              </div>
            </div>
          </CertificateFrame>

          {/* floating mini medallion */}
          <div className="absolute -bottom-8 -left-8 hidden md:block">
            <div className="glass-panel rounded-xl p-4">
              <ZenMedallion size={56} glyph="node" />
            </div>
          </div>
        </div>
      </div>

      {/* microprint security line */}
      <div className="absolute inset-x-0 bottom-6 z-10 mx-auto max-w-7xl px-6">
        <MicroprintBorder className="w-full" />
      </div>
    </section>
  );
}

const PATHS = [
  {
    index: "PATH · I",
    subtitle: "For Operators",
    title: "SmartBusiness",
    description:
      "Deploy Arsenal automations across your operations. Orchestrate AI workflows, agents, and revenue systems on treasury-grade rails.",
    cta: "Open SmartBusiness",
    icon: Icon.business,
    accent: "gold" as const,
  },
  {
    index: "PATH · II",
    subtitle: "For Builders",
    title: "ZEN Programs",
    description:
      "Structured tracks across AI literacy, automation, and sovereign infrastructure — each concluding with a verifiable on-chain credential.",
    cta: "Browse Programs",
    icon: Icon.program,
    accent: "emerald" as const,
  },
  {
    index: "PATH · III",
    subtitle: "For Members",
    title: "Learn & Accomplish",
    description:
      "Earn credentials that compound. Track accomplishments, mint proof, and build a sovereign record of mastery recognized everywhere.",
    cta: "Start Learning",
    icon: Icon.learn,
    accent: "holo" as const,
  },
];

function Paths() {
  return (
    <section id="platform" className="relative px-6 py-24 md:py-32">
      <TreasuryPatternBackground variant="section" watermark={false} />
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionHeading
          label="Three Sovereign Paths"
          title="One platform. Three ways to enter."
          desc="Choose your charter. Every path runs on the same treasury-grade credential and automation infrastructure."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PATHS.map((p) => (
            <PremiumPathCard key={p.title} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ label, title, desc }: { label: string; title: string; desc?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="mx-auto mb-5 flex items-center justify-center gap-3">
        <span className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, rgba(214,177,94,0.6))" }} />
        <span className="micro-label text-zen-gold">{label}</span>
        <span className="h-px w-10" style={{ background: "linear-gradient(90deg, rgba(214,177,94,0.6), transparent)" }} />
      </div>
      <h2 className="text-4xl font-medium leading-tight text-zen-platinum md:text-5xl">{title}</h2>
      {desc && <p className="mt-5 text-base leading-relaxed text-muted-foreground">{desc}</p>}
    </div>
  );
}

const PROGRAMS = [
  { tag: "FOUNDATION", title: "AI Literacy Charter", desc: "Master the language, capabilities, and limits of modern AI systems.", weeks: "6 weeks", tone: "emerald" as const, glyph: "shield" as const },
  { tag: "AUTOMATION", title: "Arsenal Operator", desc: "Build and ship autonomous agent fleets and revenue workflows.", weeks: "8 weeks", tone: "gold" as const, glyph: "node" as const },
  { tag: "INFRASTRUCTURE", title: "Sovereign Architect", desc: "Design Web3 credentialing and treasury-grade AI infrastructure.", weeks: "10 weeks", tone: "holo" as const, glyph: "verify" as const },
];

function FeaturedPrograms() {
  return (
    <section id="programs" className="relative px-6 py-24 md:py-32">
      <TreasuryPatternBackground variant="section" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionHeading
          label="Featured Programs"
          title="Credentialed mastery, by design."
          desc="Each program concludes with a verifiable, on-chain ZEN credential — engraved, sealed, and globally recognized."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {PROGRAMS.map((p) => (
            <OrnamentalCard key={p.title} accent={p.tone}>
              <div className="flex h-full flex-col p-7">
                <div className="flex items-start justify-between">
                  <ZenMedallion size={64} glyph={p.glyph} />
                  <CredentialBadge label={p.weeks} tone={p.tone} />
                </div>
                <p className="mt-6 micro-label text-muted-foreground">{p.tag}</p>
                <h3 className="mt-2 text-2xl font-medium text-zen-platinum">{p.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                <div className="mt-6 flex items-center justify-between border-t pt-5" style={{ borderColor: "rgba(214,177,94,0.14)" }}>
                  <span className="micro-label text-zen-gold">Issues Credential</span>
                  <span className="text-zen-platinum">{Icon.verify}</span>
                </div>
              </div>
            </OrnamentalCard>
          ))}
        </div>
      </div>
    </section>
  );
}

const PROOF = [
  ["1.2M", "Credentials Minted", "On-chain & verifiable"],
  ["31K", "Active Builders", "Across 90+ nations"],
  ["120+", "Models Integrated", "Frontier AI coverage"],
  ["99.9%", "Ledger Uptime", "Treasury-grade SLA"],
];

function Proof() {
  return (
    <section id="proof" className="relative px-6 py-24 md:py-32">
      <TreasuryPatternBackground variant="subtle" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <SectionHeading label="Proof of Sovereignty" title="Verified at scale." />
        <div className="mt-14">
          <CertificateFrame>
            <div className="grid gap-px p-px md:grid-cols-4" style={{ background: "rgba(214,177,94,0.1)" }}>
              {PROOF.map(([n, l, s], i) => (
                <div key={l} className="cert-surface relative overflow-hidden p-8 text-center">
                  {i === 1 && <GuillocheOverlay className="absolute inset-0 m-auto h-48 w-48 text-zen-emerald" color="#45dcae" rings={4} opacity={0.08} />}
                  <div className="relative font-display text-4xl font-semibold text-engrave md:text-5xl">{n}</div>
                  <div className="relative mt-2 text-sm font-medium text-zen-platinum">{l}</div>
                  <div className="relative mt-1 micro-label text-muted-foreground">{s}</div>
                </div>
              ))}
            </div>
          </CertificateFrame>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t px-6 py-16" style={{ borderColor: "rgba(214,177,94,0.14)" }}>
      <TreasuryPatternBackground variant="subtle" watermark={false} />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col items-start justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <ZenMedallion size={36} glyph="zen" />
              <span className="font-display text-xl font-semibold text-zen-platinum">ZEN Treasury</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Treasury-grade infrastructure for the sovereign intelligence era. AI literacy,
              Arsenal automation, and verifiable Web3 credentials.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-16 gap-y-8 sm:grid-cols-3">
            {[
              ["Platform", ["SmartBusiness", "ZEN Programs", "Credentials", "Arsenal"]],
              ["Company", ["Charter", "Governance", "Proof", "Careers"]],
              ["Legal", ["Terms", "Privacy", "Security", "Disclosures"]],
            ].map(([h, items]) => (
              <div key={h as string}>
                <div className="micro-label text-zen-gold">{h as string}</div>
                <ul className="mt-4 space-y-3">
                  {(items as string[]).map((it) => (
                    <li key={it}>
                      <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-zen-platinum">{it}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs text-muted-foreground md:flex-row" style={{ borderColor: "rgba(214,177,94,0.12)" }}>
          <span className="font-mono tracking-wider">© MMXXVI ZEN · SOVEREIGN INTELLIGENCE TREASURY</span>
          <span className="font-mono">Abstract design — not affiliated with any government entity.</span>
        </div>
      </div>
    </footer>
  );
}

const POSSIBILITY = [
  { title: "Agent Builder", desc: "Build intelligent agents in minutes, not months.", icon: Icon.node },
  { title: "Mission Control", desc: "Orchestrate every flow, in real time.", icon: Icon.program },
  { title: "Night Shift", desc: "Operations keep running while the world sleeps.", icon: Icon.verify },
  { title: "Z-Engine", desc: "Create, refine, publish — from idea to impact.", icon: Icon.business },
  { title: "Business Spaces", desc: "Organize teams, clients and projects with clarity.", icon: Icon.learn },
  { title: "Research", desc: "Search smarter. Find what matters.", icon: Icon.verify },
];

function PossibilitySection() {
  return (
    <section id="possibility" className="relative overflow-hidden px-6 py-28 md:py-40">
      <AuroraHorizon intensity="bright" />
      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <div className="mx-auto mb-6 flex items-center justify-center gap-3">
          <span className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, rgba(255,247,224,0.7))" }} />
          <span className="micro-label text-zen-platinum/80">Endless Possibility</span>
          <span className="h-px w-10" style={{ background: "linear-gradient(90deg, rgba(255,247,224,0.7), transparent)" }} />
        </div>
        <h2 className="mx-auto max-w-4xl text-5xl font-medium leading-[1.0] text-zen-platinum md:text-7xl">
          <span className="text-foil font-display">Unlimited power.</span>
          <br />
          One conversation away.
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed" style={{ color: "rgba(231,243,243,0.78)" }}>
          Command your entire operation by text. Every agent, flow and credential —
          coordinated from a single luminous control surface.
        </p>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POSSIBILITY.map((p, i) => (
            <div
              key={p.title}
              className="glass-tile tap-target group flex items-start gap-4 rounded-2xl p-5 text-left transition-transform duration-500 hover:-translate-y-1.5"
              style={{ animation: `rise 0.7s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both` }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-zen-ink"
                style={{ background: "var(--grad-gold-platinum)", boxShadow: "0 8px 24px -10px rgba(0,0,0,0.6)" }}
              >
                {p.icon}
              </div>
              <div>
                <div className="font-display text-lg font-semibold text-zen-platinum">{p.title}</div>
                <div className="mt-1 text-sm leading-relaxed" style={{ color: "rgba(231,243,243,0.72)" }}>
                  {p.desc}
                </div>
              </div>
              <svg className="ml-auto mt-1 shrink-0 opacity-50 transition-all group-hover:translate-x-0.5 group-hover:opacity-90" width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" aria-hidden="true" style={{ color: "rgba(231,243,243,0.85)" }}>
                <path d="M3 8h10M9 4l4 4-4 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          ))}
        </div>

        <div className="mt-12 inline-flex items-center gap-3 rounded-full px-5 py-2.5 glass-tile">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zen-emerald opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-zen-emerald" />
          </span>
          <span className="micro-label text-zen-platinum/85">Weekend Mode · Focus · Freedom · Flow</span>
        </div>
      </div>
    </section>
  );
}

/* App-style sticky action bar — gives the platform native-iOS parity on mobile */
function MobileActionBar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="glass-panel border-x-0 border-b-0 px-4 pb-3 pt-3">
        <div className="flex items-center gap-3">
          <a
            href="#apply"
            className="tap-target flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-zen-ink active:brightness-95"
            style={{ background: "var(--grad-emerald-gold)", boxShadow: "var(--shadow-emerald)" }}
          >
            Enter the Treasury
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#programs"
            className="tap-target flex items-center justify-center rounded-xl border px-5 py-3.5 text-sm font-medium text-zen-platinum active:bg-white/5"
            style={{ borderColor: "rgba(214,177,94,0.3)" }}
          >
            Programs
          </a>
        </div>
      </div>
    </div>
  );
}

function Index() {
  return (
    <main className="relative min-h-screen bg-background">
      <Nav />
      <Hero />
      <Paths />
      <PossibilitySection />
      <FeaturedPrograms />
      <Proof />
      <SovereignCTASection />
      <Footer />
      <div className="h-20 md:hidden" />
      <MobileActionBar />
    </main>
  );
}
