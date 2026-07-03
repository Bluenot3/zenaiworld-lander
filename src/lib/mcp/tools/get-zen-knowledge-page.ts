import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getWikiPageMarkdown } from "@/lib/notion.server";

export default defineTool({
  name: "get_zen_knowledge_page",
  title: "Get ZEN Knowledge Page",
  description:
    "Fetch the full content of a single ZEN AI Co. Knowledge Base page as Markdown. Provide the page id returned by list_zen_knowledge.",
  inputSchema: {
    page_id: z
      .string()
      .trim()
      .min(1)
      .describe("The Notion page id from list_zen_knowledge (e.g. 33a9c471-...)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ page_id }) => {
    try {
      const { title, tags, markdown } = await getWikiPageMarkdown(page_id);
      const header = `# ${title}${tags.length ? `\n\n_Tags: ${tags.join(", ")}_` : ""}\n\n`;
      return {
        content: [{ type: "text", text: header + (markdown || "_This page has no content._") }],
        structuredContent: { title, tags, markdown },
      };
    } catch (e) {
      return {
        content: [
          { type: "text", text: e instanceof Error ? e.message : "Failed to load the page." },
        ],
        isError: true,
      };
    }
  },
});
