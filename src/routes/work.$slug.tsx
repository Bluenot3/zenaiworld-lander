import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { fetchPublishedSitePage } from "@/features/site-content/content.functions";
import { SitePageRenderer } from "@/features/site-content/SitePageRenderer";

export const Route = createFileRoute("/work/$slug")({
  loader: async ({ params }) => {
    const result = await fetchPublishedSitePage({ data: { slug: params.slug } });
    if (!result.page && !result.error) throw notFound();
    return result;
  },
  head: ({ loaderData }) => {
    const page = loaderData?.page;
    const title = page?.document.seo.title || page?.document.title || "ZEN AI World";
    const description =
      page?.document.seo.description ||
      page?.document.summary ||
      "Work, programs, and proof from ZEN AI Co.";

    return {
      meta: [
        { title: `${title} | ZEN AI Co.` },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
      ],
      links: page
        ? [{ rel: "canonical", href: `https://zenai.world/work/${page.slug}` }]
        : undefined,
    };
  },
  component: PublishedWorkPage,
  notFoundComponent: WorkNotFound,
});

function PublishedWorkPage() {
  const data = Route.useLoaderData();

  if (!data.page) {
    return (
      <main className="zsp-shell">
        <section className="zsp-route-message">
          <p>{data.error || "This page is temporarily unavailable."}</p>
          <Link to="/">Return to ZEN AI World</Link>
        </section>
      </main>
    );
  }

  return (
    <SitePageRenderer
      document={data.page.document}
      slug={data.page.slug}
      publishedAt={data.page.published_at}
    />
  );
}

function WorkNotFound() {
  return (
    <main className="zsp-shell">
      <section className="zsp-route-message">
        <span>404</span>
        <h1>This page is not published.</h1>
        <p>It may still be in draft, archived, or no longer available.</p>
        <Link to="/">Return to ZEN AI World</Link>
      </section>
    </main>
  );
}
