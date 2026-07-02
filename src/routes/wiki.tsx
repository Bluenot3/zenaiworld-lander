import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ZenLogo } from "@/components/treasury/ZenLogo";
import { TreasuryPatternBackground } from "@/components/treasury/TreasuryPatternBackground";

export const Route = createFileRoute("/wiki")({
  head: () => ({
    meta: [
      { title: "ZEN Knowledge Base — AI Literacy, Arsenal & Web3 Credentials" },
      {
        name: "description",
        content:
          "The complete ZEN AI Co. knowledge base: programs, playbooks, website source, integrations, and operating docs — all in one treasury-grade platform.",
      },
      { property: "og:title", content: "ZEN Knowledge Base" },
      {
        property: "og:description",
        content: "The complete ZEN AI Co. operating knowledge, transferred into the ZEN platform.",
      },
    ],
  }),
  component: WikiLayout,
});

function WikiLayout() {
  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 z-0">
        <TreasuryPatternBackground variant="section" />
      </div>

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="glass-panel border-x-0 border-t-0">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link to="/" className="flex items-center gap-3">
              <ZenLogo variant="icon" size={34} glow />
              <span className="font-display text-lg font-semibold tracking-wide text-zen-platinum">
                ZEN Knowledge Base
              </span>
            </Link>
            <Link
              to="/"
              className="text-sm text-muted-foreground transition-colors hover:text-zen-platinum"
            >
              ← Home
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-16">
        <Outlet />
      </main>
    </div>
  );
}
