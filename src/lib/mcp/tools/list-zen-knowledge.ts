import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getWikiIndex } from "@/lib/notion.server";

export default defineTool({
  name: "list_zen_knowledge",
  title: "List ZEN Knowledge Base",
  description:
    "List pages in the ZEN AI Co. Knowledge Base. Optionally filter by a search term matched against page titles and tags. Returns each page's id, title, and tags.",
  inputSchema: {
    query: z
      .string()
      .trim()
      .optional()
      .describe("Optional search term to filter pages by title or tag."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(200)
      .optional()
      .describe("Maximum number of pages to return (default 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, limit }) => {
    try {
      const items = await getWikiIndex();
      const q = query?.toLowerCase();
      const filtered = q
        ? items.filter(
            (i) =>
              i.title.toLowerCase().includes(q) ||
              i.tags.some((t) => t.toLowerCase().includes(q)),
          )
        : items;
      const capped = filtered.slice(0, limit ?? 50);
      const rows = capped.map((i) => ({ id: i.id, title: i.title, tags: i.tags }));
      const text = capped
        .map((i) => `• ${i.title}${i.tags.length ? ` [${i.tags.join(", ")}]` : ""} — ${i.id}`)
        .join("\n");
      return {
        content: [
          {
            type: "text",
            text: rows.length
              ? `${rows.length} page(s) in the ZEN Knowledge Base:\n${text}`
              : "No matching pages found.",
          },
        ],
        structuredContent: { pages: rows, total: filtered.length },
      };
    } catch (e) {
      return {
        content: [
          { type: "text", text: e instanceof Error ? e.message : "Failed to load knowledge base." },
        ],
        isError: true,
      };
    }
  },
});
