import { defineMcp } from "@lovable.dev/mcp-js";
import listZenKnowledge from "./tools/list-zen-knowledge";
import getZenKnowledgePage from "./tools/get-zen-knowledge-page";

export default defineMcp({
  name: "zen-ai-co-mcp",
  title: "ZEN AI Co. MCP",
  version: "0.1.0",
  instructions:
    "Tools for the ZEN AI Co. platform. Use `list_zen_knowledge` to browse or search the ZEN Knowledge Base (programs, playbooks, integrations, and operating docs), then `get_zen_knowledge_page` with a returned page id to read a page's full Markdown content.",
  tools: [listZenKnowledge, getZenKnowledgePage],
});
