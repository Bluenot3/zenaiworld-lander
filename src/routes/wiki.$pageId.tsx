import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { fetchWikiPage } from "@/lib/notion.functions";
import { Blocks } from "@/components/wiki/NotionBlocks";

const wikiPageQuery = (pageId: string) =>
  queryOptions({
    queryKey: ["wiki", "page", pageId],
    queryFn: () => fetchWikiPage({ data: { pageId } }),
    staleTime: 5 * 60 * 1000,
  });

export const Route = createFileRoute("/wiki/$pageId")({
  loader: ({ context, params }) => {
    context.queryClient.ensureQueryData(wikiPageQuery(params.pageId));
  },
  component: WikiPageView,
  errorComponent: ({ error }) => {
    const router = useRouter();
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <p className="text-muted-foreground">{error.message}</p>
        <button
          onClick={() => router.invalidate()}
          className="mt-4 rounded-lg border border-white/15 px-4 py-2 text-sm text-zen-platinum hover:border-zen-gold/40"
        >
          Try again
        </button>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center text-muted-foreground">
      This page isn't in the archive.
    </div>
  ),
});

function WikiPageView() {
  const { pageId } = Route.useParams();
  const { data } = useSuspenseQuery(wikiPageQuery(pageId));
  const page = data.page;

  if (data.error || !page) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center text-muted-foreground">
        {data.error ?? "This page could not be loaded."}
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      <Link
        to="/wiki"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-zen-gold"
      >
        ← All pages
      </Link>

      <header className="mt-8 border-b border-white/10 pb-8">
        <div className="flex items-start gap-3">
          {page.icon && <span className="text-4xl leading-none">{page.icon}</span>}
          <h1 className="font-display text-4xl font-semibold text-zen-platinum sm:text-5xl">
            {page.title}
          </h1>
        </div>
        {page.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {page.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-zen-gold/20 px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-zen-gold/80"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="pb-24">
        {page.blocks.length === 0 ? (
          <p className="mt-8 text-muted-foreground">This page has no content yet.</p>
        ) : (
          <Blocks blocks={page.blocks} />
        )}
      </div>
    </article>
  );
}
