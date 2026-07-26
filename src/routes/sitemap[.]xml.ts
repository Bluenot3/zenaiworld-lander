import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

import { listPublishedSitePageIndex } from "@/features/site-content/content.server";

const BASE_URL = "https://zenai.world";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
          { path: "/terms-and-conditions", changefreq: "yearly", priority: "0.3" },
          { path: "/refund-policy", changefreq: "yearly", priority: "0.3" },
          { path: "/accessibility-statement", changefreq: "yearly", priority: "0.3" },
        ];

        try {
          const publishedPages = await listPublishedSitePageIndex();
          entries.push(
            ...publishedPages.map((page) => ({
              path: `/work/${page.slug}`,
              lastmod: page.updated_at || page.published_at,
              changefreq: "monthly" as const,
              priority: "0.7",
            })),
          );
        } catch (error) {
          console.error("Unable to add published Site Studio pages to sitemap", error);
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
