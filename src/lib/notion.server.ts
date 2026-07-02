/**
 * notion.server.ts — server-only helpers that talk to the Notion API through
 * the Lovable connector gateway. Returns plain, SSR-serializable DTOs.
 */

const GATEWAY_URL = "https://connector-gateway.lovable.dev/notion/v1";

/** The ZEN AI Co Wiki database. */
export const ZEN_WIKI_DATABASE_ID = "33a9c471-18d8-80d0-9424-c16aa3d8403e";

function authHeaders() {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const notionKey = process.env.NOTION_API_KEY;
  if (!lovableKey) throw new Error("LOVABLE_API_KEY is not configured");
  if (!notionKey) throw new Error("NOTION_API_KEY is not configured");
  return {
    Authorization: `Bearer ${lovableKey}`,
    "X-Connection-Api-Key": notionKey,
    "Content-Type": "application/json",
  };
}

async function notionFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${GATEWAY_URL}${path}`, {
    ...init,
    headers: { ...authHeaders(), ...(init?.headers ?? {}) },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      `Notion API ${res.status}: ${data?.message ?? JSON.stringify(data)}`,
    );
  }
  return data;
}

// ---------- Rich text ----------

export interface RichSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  code?: boolean;
  color?: string;
  href?: string | null;
}

function mapRichText(rich: any[] | undefined): RichSpan[] {
  if (!Array.isArray(rich)) return [];
  return rich.map((r) => ({
    text: r.plain_text ?? "",
    bold: r.annotations?.bold || undefined,
    italic: r.annotations?.italic || undefined,
    strikethrough: r.annotations?.strikethrough || undefined,
    underline: r.annotations?.underline || undefined,
    code: r.annotations?.code || undefined,
    color:
      r.annotations?.color && r.annotations.color !== "default"
        ? r.annotations.color
        : undefined,
    href: r.href ?? null,
  }));
}

// ---------- Blocks ----------

export interface SimpleBlock {
  id: string;
  type: string;
  text?: RichSpan[];
  /** for code blocks */
  language?: string;
  /** for images */
  url?: string;
  caption?: RichSpan[];
  /** for callout emoji / list icon */
  icon?: string;
  /** checked state for to_do */
  checked?: boolean;
  children?: SimpleBlock[];
  /** for child_page / child_database */
  pageId?: string;
}

const RENDERABLE = new Set([
  "paragraph",
  "heading_1",
  "heading_2",
  "heading_3",
  "bulleted_list_item",
  "numbered_list_item",
  "to_do",
  "toggle",
  "quote",
  "callout",
  "code",
  "divider",
  "image",
  "bookmark",
  "child_page",
  "child_database",
  "column_list",
  "column",
  "table",
  "table_row",
  "embed",
  "video",
]);

function fileUrl(node: any): string | undefined {
  if (!node) return undefined;
  if (node.type === "external") return node.external?.url;
  if (node.type === "file") return node.file?.url;
  return node.external?.url ?? node.file?.url;
}

async function fetchBlockChildren(
  blockId: string,
  depth: number,
): Promise<SimpleBlock[]> {
  const out: SimpleBlock[] = [];
  let cursor: string | undefined;
  let guard = 0;

  do {
    const qs = new URLSearchParams({ page_size: "100" });
    if (cursor) qs.set("start_cursor", cursor);
    const data = await notionFetch(`/blocks/${blockId}/children?${qs}`);
    for (const b of data.results ?? []) {
      const type = b.type as string;
      if (!RENDERABLE.has(type)) continue;
      const payload = b[type] ?? {};
      const block: SimpleBlock = { id: b.id, type };

      if (Array.isArray(payload.rich_text)) block.text = mapRichText(payload.rich_text);

      switch (type) {
        case "code":
          block.language = payload.language;
          break;
        case "to_do":
          block.checked = !!payload.checked;
          break;
        case "callout":
          block.icon = payload.icon?.emoji;
          break;
        case "image":
        case "video":
          block.url = fileUrl(payload);
          block.caption = mapRichText(payload.caption);
          break;
        case "bookmark":
        case "embed":
          block.url = payload.url;
          block.caption = mapRichText(payload.caption);
          break;
        case "child_page":
          block.text = [{ text: payload.title ?? "Untitled" }];
          block.pageId = b.id;
          break;
        case "child_database":
          block.text = [{ text: payload.title ?? "Database" }];
          block.pageId = b.id;
          break;
      }

      if (b.has_children && depth > 0 && type !== "child_page" && type !== "child_database") {
        block.children = await fetchBlockChildren(b.id, depth - 1);
      }
      out.push(block);
    }
    cursor = data.has_more ? data.next_cursor : undefined;
    guard += 1;
  } while (cursor && guard < 20);

  return out;
}

// ---------- Page title / icon helpers ----------

function pageTitle(page: any): string {
  const props = page.properties ?? {};
  for (const key of Object.keys(props)) {
    const p = props[key];
    if (p?.type === "title") {
      const t = (p.title ?? []).map((r: any) => r.plain_text).join("");
      if (t) return t;
    }
  }
  return "Untitled";
}

function pageIcon(page: any): string | undefined {
  const icon = page.icon;
  if (!icon) return undefined;
  if (icon.type === "emoji") return icon.emoji;
  return undefined;
}

function pageTags(page: any): string[] {
  const props = page.properties ?? {};
  for (const key of Object.keys(props)) {
    const p = props[key];
    if (p?.type === "multi_select") {
      return (p.multi_select ?? []).map((o: any) => o.name);
    }
  }
  return [];
}

// ---------- Public API ----------

export interface WikiIndexItem {
  id: string;
  title: string;
  icon?: string;
  tags: string[];
  lastEdited?: string;
}

export async function getWikiIndex(): Promise<WikiIndexItem[]> {
  const items: WikiIndexItem[] = [];
  let cursor: string | undefined;
  let guard = 0;

  do {
    const body: Record<string, unknown> = {
      page_size: 100,
      sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
    };
    if (cursor) body.start_cursor = cursor;
    const data = await notionFetch(`/databases/${ZEN_WIKI_DATABASE_ID}/query`, {
      method: "POST",
      body: JSON.stringify(body),
    });
    for (const page of data.results ?? []) {
      items.push({
        id: page.id,
        title: pageTitle(page),
        icon: pageIcon(page),
        tags: pageTags(page),
        lastEdited: page.last_edited_time,
      });
    }
    cursor = data.has_more ? data.next_cursor : undefined;
    guard += 1;
  } while (cursor && guard < 20);

  return items;
}

export interface WikiPage {
  id: string;
  title: string;
  icon?: string;
  tags: string[];
  blocks: SimpleBlock[];
}

export async function getWikiPage(pageId: string): Promise<WikiPage> {
  const page = await notionFetch(`/pages/${pageId}`);
  const blocks = await fetchBlockChildren(pageId, 3);
  return {
    id: pageId,
    title: pageTitle(page),
    icon: pageIcon(page),
    tags: pageTags(page),
    blocks,
  };
}
