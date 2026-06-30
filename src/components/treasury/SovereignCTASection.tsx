import { CertificateFrame } from "./CertificateFrame";
import { TreasuryPatternBackground } from "./TreasuryPatternBackground";
import { HolographicSecurityStrip } from "./HolographicSecurityStrip";
import { ZenMedallion } from "./ZenMedallion";
import { CredentialBadge } from "./CredentialBadge";

/**
 * SovereignCTASection — final treasury-grade call to action with certificate
 * framing, holographic strip and engraved medallion.
 */
export function SovereignCTASection() {
  return (
    <section className="relative overflow-hidden px-6 py-28 md:py-36">
      <TreasuryPatternBackground variant="hero" />
      <div className="relative z-10 mx-auto max-w-5xl">
        <CertificateFrame className="overflow-hidden">
          <div className="relative grid gap-10 p-10 md:grid-cols-[1.4fr_1fr] md:p-16">
            <div>
              <CredentialBadge label="Charter Access · Cohort MMXXVI" tone="holo" />
              <h2 className="mt-6 text-4xl font-medium leading-[1.05] text-zen-platinum md:text-5xl">
                Take your seat in the{" "}
                <span className="text-engrave">sovereign intelligence</span> era.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                Issue verifiable credentials, deploy Arsenal automations, and certify AI
                literacy across your organization — on infrastructure built to institutional
                standard.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="#apply"
                  className="group inline-flex items-center gap-2 rounded-lg px-7 py-3.5 text-sm font-semibold text-zen-ink transition-all hover:brightness-110"
                  style={{ background: "var(--grad-gold-platinum)", boxShadow: "var(--glow-gold)" }}
                >
                  Request Charter Access
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
                <a
                  href="#programs"
                  className="inline-flex items-center gap-2 rounded-lg border px-7 py-3.5 text-sm font-medium text-zen-platinum transition-colors hover:border-zen-gold/60"
                  style={{ borderColor: "rgba(214,177,94,0.3)" }}
                >
                  Explore Programs
                </a>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="absolute right-2 top-1/2 hidden h-72 -translate-y-1/2 md:block">
                <HolographicSecurityStrip orientation="diagonal" width={48} className="h-72 rounded-full" />
              </div>
              <ZenMedallion size={220} glyph="verify" className="opacity-90 drop-shadow-[0_0_36px_rgba(182,212,74,0.3)]" />
            </div>
          </div>
        </CertificateFrame>
      </div>
    </section>
  );
}
