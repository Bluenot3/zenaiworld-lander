import { createServerFn } from "@tanstack/react-start";
import { getWikiIndex, getWikiPage, type WikiIndexItem, type WikiPage } from "./notion.server";

/** List every page in the ZEN AI Co Wiki (title, tags, icon). */
export const fetchWikiIndex = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ items: WikiIndexItem[]; error?: string }> => {
    try {
      const items = await getWikiIndex();
      return { items };
    } catch (e) {
      console.error("fetchWikiIndex failed", e);
      return { items: [], error: e instanceof Error ? e.message : "Unknown error" };
    }
  },
);

/** Fetch a single wiki page with its rendered block tree. */
export const fetchWikiPage = createServerFn({ method: "GET" })
  .validator((data: { pageId: string }) => {
    if (!data?.pageId || typeof data.pageId !== "string") {
      throw new Error("pageId is required");
    }
    return { pageId: data.pageId };
  })
  .handler(async ({ data }): Promise<{ page: WikiPage | null; error?: string }> => {
    try {
      const page = await getWikiPage(data.pageId);
      return { page };
    } catch (e) {
      console.error("fetchWikiPage failed", e);
      return { page: null, error: e instanceof Error ? e.message : "Unknown error" };
    }
  });
