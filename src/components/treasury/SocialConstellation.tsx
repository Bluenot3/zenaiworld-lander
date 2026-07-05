import type { ReactNode } from "react";
import { EngravedBorder } from "./CertificateFrame";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

/* ---------- Brand glyphs (uniform 24x24, currentColor) ---------- */
const G = {
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 5.6L20 10l-5.6 2.4L12 18l-2.4-5.6L4 10l5.6-2.4z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.53 3H20.5l-6.49 7.41L21.75 21h-6.02l-4.7-6.15L5.6 21H2.62l6.94-7.93L2.25 3h6.17l4.25 5.62L17.53 3zm-1.06 16.2h1.65L7.6 4.72H5.83L16.47 19.2z" />
    </svg>
  ),
  telegram: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.94 4.3 18.6 20.05c-.25 1.11-.92 1.38-1.86.86l-5.14-3.79-2.48 2.39c-.28.28-.5.5-1.03.5l.37-5.23L18 6.15c.42-.37-.09-.58-.65-.21L6.15 12.9l-5.06-1.58c-1.1-.34-1.12-1.1.23-1.63l19.77-7.62c.92-.34 1.72.21 1.42 1.63z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 12s0-3.2-.41-4.74a2.5 2.5 0 0 0-1.76-1.76C19.28 5.09 12 5.09 12 5.09s-7.28 0-8.83.41A2.5 2.5 0 0 0 1.41 7.26 26 26 0 0 0 1 12a26 26 0 0 0 .41 4.74 2.5 2.5 0 0 0 1.76 1.76c1.55.41 8.83.41 8.83.41s7.28 0 8.83-.41a2.5 2.5 0 0 0 1.76-1.76C23 15.2 23 12 23 12zM9.75 15.02V8.98L15.5 12z" />
    </svg>
  ),
  discord: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.54 5.34A16.3 16.3 0 0 0 15.4 4.1l-.2.42a12.3 12.3 0 0 1 3.66 1.86A15.6 15.6 0 0 0 12 5.34a15.6 15.6 0 0 0-6.86 1.04 12.3 12.3 0 0 1 3.66-1.86l-.2-.42A16.3 16.3 0 0 0 4.46 5.34C1.9 9.13 1.2 12.83 1.55 16.48a16.5 16.5 0 0 0 5.04 2.56l.4-.68a10.8 10.8 0 0 1-1.72-.82l.42-.32a11.8 11.8 0 0 0 10.62 0l.42.32c-.55.32-1.13.6-1.72.82l.4.68a16.5 16.5 0 0 0 5.04-2.56c.4-4.24-.68-7.9-2.93-11.14zM8.68 14.2c-.98 0-1.79-.9-1.79-2s.79-2 1.79-2 1.8.9 1.79 2c0 1.1-.79 2-1.79 2zm6.64 0c-.98 0-1.79-.9-1.79-2s.79-2 1.79-2 1.8.9 1.79 2c0 1.1-.79 2-1.79 2z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.64h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75V21h-4v-5.2c0-1.24-.02-2.84-1.9-2.84-1.9 0-2.2 1.36-2.2 2.75V21h-4z" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 3c.3 2.2 1.6 3.9 3.9 4.2v2.6c-1.4.1-2.7-.3-3.9-1v5.9c0 3.5-2.6 5.8-5.8 5.8a5.6 5.6 0 0 1-5.6-5.6c0-3.4 3-6 6.4-5.5v2.8c-.4-.1-.8-.2-1.2-.2a2.8 2.8 0 0 0 0 5.6 2.7 2.7 0 0 0 2.8-2.8V3z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.07 0l2-2a5 5 0 0 0-7.07-7.07l-1.5 1.5M14 11a5 5 0 0 0-7.07 0l-2 2a5 5 0 0 0 7.07 7.07l1.5-1.5" />
    </svg>
  ),
  chain: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2zM12 7l4 2.2v4.6L12 16l-4-2.2V9.2L12 7z" />
    </svg>
  ),
};

interface Social {
  label: string;
  handle: string;
  href: string;
  icon: ReactNode;
}

const SOCIALS: Social[] = [
  { label: "ZEN AI World", handle: "zenai.world", href: "https://www.zenai.world/", icon: G.globe },
  { label: "Arsenal", handle: "arsenal.world", href: "https://arsenal.world", icon: G.spark },
  { label: "X · ZEN AI", handle: "@ZEN_AGI", href: "https://x.com/ZEN_AGI", icon: G.x },
  { label: "X · Millennial AI", handle: "@MillennialAGI", href: "https://x.com/MillennialAGI", icon: G.x },
  { label: "Telegram", handle: "@ZENOAI", href: "https://t.me/ZENOAI", icon: G.telegram },
  { label: "YouTube", handle: "@ZENAIML", href: "https://www.youtube.com/@ZENAIML", icon: G.youtube },
  { label: "Discord", handle: "Community", href: "https://discord.gg/qbKgCc46Ym", icon: G.discord },
  { label: "Instagram", handle: "@0xvvs1", href: "https://www.instagram.com/0xvvs1/", icon: G.instagram },
  { label: "LinkedIn", handle: "ZEN AI Co.", href: "https://www.linkedin.com/company/z3nai/", icon: G.linkedin },
  { label: "TikTok", handle: "@milennialai", href: "https://www.tiktok.com/@milennialai", icon: G.tiktok },
  { label: "Facebook", handle: "PHLY6", href: "https://www.facebook.com/PHLY6Entertainment", icon: G.facebook },
  { label: "GitHub", handle: "Bluenot3", href: "https://github.com/Bluenot3", icon: G.github },
  { label: "Linq", handle: "Link Hub", href: "https://linqapp.com/zenai?r=link", icon: G.link },
  { label: "Mining Node", handle: "Blockchain", href: "https://t.me/herewalletbot/app?startapp=4226714-village-100650", icon: G.chain },
];

/**
 * SocialConstellation — a compact, currency-grade grid of engraved social
 * medallions. Each tile is an ornamental cartouche with a brand glyph that
 * ignites in gold on hover. Reads like a plate of treasury seals.
 */
export function SocialConstellation({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <div className="mb-6 flex items-center gap-3">
        <span className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(214,177,94,0.4))" }} />
        <span className="micro-label whitespace-nowrap text-zen-gold">The Sovereign Network</span>
        <span className="h-px flex-1" style={{ background: "linear-gradient(90deg, rgba(214,177,94,0.4), transparent)" }} />
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {SOCIALS.map((s) => (
          <a
            key={s.label}
            href={s.href}
            {...ext}
            aria-label={s.label}
            className="group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-3 transition-all duration-300 hover:-translate-y-0.5 xl:flex-col xl:items-center xl:gap-2 xl:py-4 xl:text-center"
            style={{
              background: "linear-gradient(160deg, rgba(20,44,50,0.55), rgba(9,24,29,0.7))",
              border: "1px solid rgba(214,177,94,0.16)",
            }}
          >
            {/* gold ignition wash */}
            <span
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{ background: "radial-gradient(120% 90% at 50% 0%, rgba(227,185,85,0.14), transparent 70%)" }}
            />
            <EngravedBorder color="rgba(214,177,94,0.28)" corners={false} />

            <span
              className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-zen-gold transition-all duration-300 group-hover:scale-110 [&_svg]:h-5 [&_svg]:w-5"
              style={{ background: "rgba(214,177,94,0.08)", border: "1px solid rgba(214,177,94,0.2)" }}
            >
              {s.icon}
            </span>
            <span className="relative z-10 min-w-0 xl:mt-0.5">
              <span className="block truncate text-[13px] font-medium text-zen-platinum">{s.label}</span>
              <span className="block truncate font-mono text-[10px] tracking-wider text-muted-foreground">{s.handle}</span>
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
