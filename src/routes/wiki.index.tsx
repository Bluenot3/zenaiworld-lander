import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { fetchWikiIndex } from "@/lib/notion.functions";
import type { WikiIndexItem } from "@/lib/notion.server";

const wikiIndexQuery = queryOptions({
  queryKey: ["wiki", "index"],
  queryFn: () => fetchWikiIndex(),
  staleTime: 5 * 60 * 1000,
});

export const Route = createFileRoute("/wiki/")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(wikiIndexQuery);
  },
  component: WikiIndex,
  errorComponent: ({ error }) => (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center text-muted-foreground">
      {error.message}
    </div>
  ),
});

function WikiIndex() {
  const { data } = useSuspenseQuery(wikiIndexQuery);
  const items = data.items ?? [];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="micro-label text-zen-gold">The ZEN Archive</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-zen-platinum sm:text-5xl">
          Everything ZEN, in one platform
        </h1>
        <p className="mt-4 text-muted-foreground">
          Programs, playbooks, website source, integrations, and operating docs — the full
          ZEN AI Co. knowledge base, transferred into the ZEN platform and kept in sync.
        </p>
      </div>

      {data.error ? (
        <AccessNotice message={data.error} />
      ) : items.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">No pages found yet.</p>
      ) : (
        <TagGroups items={items} />
      )}
    </div>
  );
}

function AccessNotice({ message }: { message: string }) {
  const isAccess = /Could not find|object_not_found|not.*shared/i.test(message);
  return (
    <div className="mx-auto mt-14 max-w-2xl rounded-2xl border border-zen-gold/25 bg-zen-gold/[0.05] p-8 text-center">
      <h2 className="font-display text-2xl text-zen-platinum">
        {isAccess ? "One quick authorization step" : "Couldn't load the archive"}
      </h2>
      {isAccess ? (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          The ZEN platform is connected to Notion, but the{" "}
          <span className="text-zen-gold">ZEN AI Co Wiki</span> hasn't been shared with the
          integration yet. In Notion, open the wiki, click{" "}
          <span className="text-zen-platinum">•••  →  Connections</span> and add{" "}
          <span className="text-zen-platinum">“Lovable PROD.”</span> Everything will appear here
          automatically.
        </p>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
}

function TagGroups({ items }: { items: WikiIndexItem[] }) {
  const groups = new Map<string, WikiIndexItem[]>();
  for (const item of items) {
    const keys = item.tags.length ? item.tags : ["General"];
    for (const k of keys) {
      if (!groups.has(k)) groups.set(k, []);
      groups.get(k)!.push(item);
    }
  }
  const sorted = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="mt-14 space-y-14">
      <p className="text-center font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
        {items.length} pages archived
      </p>
      {sorted.map(([tag, tagItems]) => (
        <section key={tag}>
          <div className="mb-5 flex items-center gap-3">
            <h2 className="font-display text-2xl font-semibold text-zen-platinum">{tag}</h2>
            <span className="font-mono text-xs text-muted-foreground/60">
              {tagItems.length}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tagItems.map((item) => (
              <WikiCard key={`${tag}-${item.id}`} item={item} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function WikiCard({ item }: { item: WikiIndexItem }) {
  return (
    <Link
      to="/wiki/$pageId"
      params={{ pageId: item.id }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:-translate-y-0.5 hover:border-zen-gold/30 hover:bg-white/[0.04]"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl leading-none">{item.icon ?? "📄"}</span>
        <h3 className="font-medium text-zen-platinum transition-colors group-hover:text-zen-gold">
          {item.title}
        </h3>
      </div>
      {item.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {item.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-muted-foreground/70"
            >
              {t}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
