import { createServerFn } from "@tanstack/react-start";

import { getPublishedSitePage, listHomepageSitePages } from "./content.server";

const SITE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const fetchPublishedSitePage = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => {
    const slug = String(data?.slug ?? "")
      .trim()
      .toLowerCase();
    if (!SITE_SLUG_PATTERN.test(slug) || slug.length > 120) {
      throw new Error("Invalid page address.");
    }
    return { slug };
  })
  .handler(async ({ data }) => {
    try {
      return { page: await getPublishedSitePage(data.slug) };
    } catch (error) {
      console.error("fetchPublishedSitePage failed", error);
      return {
        page: null,
        error: "This page is temporarily unavailable.",
      };
    }
  });

export const fetchPublishedSiteIndex = createServerFn({ method: "GET" }).handler(async () => {
  try {
    return { pages: await listHomepageSitePages() };
  } catch (error) {
    console.error("fetchPublishedSiteIndex failed", error);
    return { pages: [] };
  }
});
