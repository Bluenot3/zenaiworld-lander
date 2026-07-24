import { Link } from "@tanstack/react-router";
import { ArrowLeft, Mail } from "lucide-react";
import type { ReactNode } from "react";

import { ZenLogo } from "@/components/treasury/ZenLogo";

const policyLinks = [
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms-and-conditions" },
  { label: "Refunds", href: "/refund-policy" },
  { label: "Accessibility", href: "/accessibility-statement" },
] as const;

interface LegalPageProps {
  title: string;
  summary: string;
  children: ReactNode;
}

export function LegalPage({ title, summary, children }: LegalPageProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zen-ink text-zen-platinum">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 12% 8%, rgba(69,220,174,0.14), transparent 34%), radial-gradient(circle at 88% 20%, rgba(149,232,255,0.12), transparent 30%), radial-gradient(circle at 74% 92%, rgba(243,209,114,0.09), transparent 34%)",
        }}
      />

      <header className="relative z-10 border-b border-zen-holo/15 bg-zen-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            to="/"
            aria-label="ZEN AI Co. home"
            className="inline-flex items-center gap-3 text-zen-platinum transition-opacity hover:opacity-80"
          >
            <ZenLogo variant="mark" size={34} />
            <span className="text-xs font-extrabold tracking-[0.24em]">ZEN AI CO.</span>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-zen-holo/20 px-4 py-2 text-xs font-semibold text-zen-platinum/80 transition hover:border-zen-emerald/55 hover:text-zen-platinum"
          >
            <ArrowLeft aria-hidden="true" size={14} />
            Back to ZEN
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-zen-emerald">
              Legal & support
            </p>
            <nav aria-label="Legal documents" className="mt-5 flex flex-wrap gap-2 lg:flex-col">
              {policyLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={title.startsWith(item.label) ? "page" : undefined}
                  className="rounded-lg border border-zen-holo/10 bg-zen-navy/35 px-3 py-2.5 text-xs font-semibold text-zen-platinum/65 transition hover:border-zen-emerald/40 hover:text-zen-platinum aria-[current=page]:border-zen-emerald/45 aria-[current=page]:bg-zen-treasury/25 aria-[current=page]:text-zen-platinum"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          <article className="min-w-0">
            <div className="border-b border-zen-holo/15 pb-8">
              <h1 className="max-w-3xl text-5xl font-semibold leading-[0.95] text-zen-platinum sm:text-6xl">
                {title}
              </h1>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-zen-platinum/68 sm:text-base">
                {summary}
              </p>
            </div>

            <div className="mt-10 space-y-10">{children}</div>

            <div className="mt-14 flex flex-col gap-5 border-t border-zen-holo/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-zen-emerald">
                  Questions or requests
                </p>
                <a
                  href="mailto:HUXLEY@ZENAI.BIZ"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-zen-platinum transition hover:text-zen-emerald"
                >
                  <Mail aria-hidden="true" size={16} />
                  HUXLEY@ZENAI.BIZ
                </a>
              </div>
              <p className="text-xs text-zen-platinum/45">ZEN AI Co. · zenai.world</p>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}

interface PolicySectionProps {
  number?: number;
  title: string;
  children: ReactNode;
}

export function PolicySection({ number, title, children }: PolicySectionProps) {
  return (
    <section className="scroll-mt-8">
      <div className="flex items-start gap-4">
        {number !== undefined ? (
          <span className="mt-1 font-mono text-xs font-semibold text-zen-emerald">
            {String(number).padStart(2, "0")}
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-semibold text-zen-platinum sm:text-3xl">{title}</h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-zen-platinum/72 sm:text-[15px]">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function PolicyList({ children }: { children: ReactNode }) {
  return <ul className="space-y-2.5 pl-1">{children}</ul>;
}

export function PolicyItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span
        aria-hidden="true"
        className="mt-[0.7rem] h-1 w-1 shrink-0 rounded-full bg-zen-emerald"
      />
      <span>{children}</span>
    </li>
  );
}

export function PolicySubheading({ children }: { children: ReactNode }) {
  return <h3 className="pt-1 text-base font-semibold text-zen-platinum">{children}</h3>;
}
