export type SitePageLayout = "editorial" | "showcase" | "profile";
export type SitePageStatus = "draft" | "published" | "archived";

type SiteBlockBase = {
  id: string;
};

export type SiteHeadingBlock = SiteBlockBase & {
  type: "heading";
  eyebrow: string;
  text: string;
  level: 2 | 3;
};

export type SiteTextBlock = SiteBlockBase & {
  type: "text";
  body: string;
};

export type SiteImageBlock = SiteBlockBase & {
  type: "image";
  url: string;
  alt: string;
  caption: string;
};

export type SiteVideoBlock = SiteBlockBase & {
  type: "video";
  url: string;
  title: string;
  poster: string;
};

export type SiteEmbedBlock = SiteBlockBase & {
  type: "embed";
  url: string;
  title: string;
  height: number;
  allowEmbed: boolean;
};

export type SiteHtmlBlock = SiteBlockBase & {
  type: "html";
  title: string;
  html: string;
  height: number;
};

export type SiteCodeBlock = SiteBlockBase & {
  type: "code";
  title: string;
  language: string;
  code: string;
};

export type SiteCtaBlock = SiteBlockBase & {
  type: "cta";
  heading: string;
  body: string;
  label: string;
  href: string;
};

export type SiteQuoteBlock = SiteBlockBase & {
  type: "quote";
  quote: string;
  attribution: string;
};

export type SiteDividerBlock = SiteBlockBase & {
  type: "divider";
};

export type SiteBlock =
  | SiteHeadingBlock
  | SiteTextBlock
  | SiteImageBlock
  | SiteVideoBlock
  | SiteEmbedBlock
  | SiteHtmlBlock
  | SiteCodeBlock
  | SiteCtaBlock
  | SiteQuoteBlock
  | SiteDividerBlock;

export type SitePageDocument = {
  schemaVersion: 1;
  title: string;
  summary: string;
  layout: SitePageLayout;
  seo: {
    title: string;
    description: string;
  };
  listing: {
    showOnHome: boolean;
    order: number;
  };
  blocks: SiteBlock[];
};

export type SitePageRecord = {
  id: string;
  slug: string;
  status: SitePageStatus;
  draft_document: SitePageDocument;
  archived_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type SitePublicationRecord = {
  page_id: string;
  revision_id: string;
  slug: string;
  document: SitePageDocument;
  is_active: boolean;
  published_at: string;
  updated_at: string;
};

export type SitePublicationIndexRecord = {
  page_id: string;
  slug: string;
  title: string;
  summary: string;
  listing: {
    showOnHome: boolean;
    order: number;
  };
  published_at: string;
  updated_at: string;
};

export type SiteRevisionRecord = {
  id: string;
  page_id: string;
  version: number;
  slug: string;
  document: SitePageDocument;
  published_by: string | null;
  published_at: string;
};

export type SitePageBundle = {
  page: SitePageRecord;
  publication: SitePublicationRecord | null;
  revisions: SiteRevisionRecord[];
};

const makeId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const createSitePageDocument = (title = "Untitled page"): SitePageDocument => ({
  schemaVersion: 1,
  title,
  summary: "",
  layout: "editorial",
  seo: {
    title: "",
    description: "",
  },
  listing: {
    showOnHome: true,
    order: 100,
  },
  blocks: [],
});

export const createSiteBlock = (type: SiteBlock["type"]): SiteBlock => {
  const id = makeId();

  switch (type) {
    case "heading":
      return { id, type, eyebrow: "", text: "New section", level: 2 };
    case "text":
      return { id, type, body: "Add the story, context, or explanation here." };
    case "image":
      return { id, type, url: "", alt: "", caption: "" };
    case "video":
      return { id, type, url: "", title: "Video", poster: "" };
    case "embed":
      return {
        id,
        type,
        url: "",
        title: "Interactive experience",
        height: 620,
        allowEmbed: false,
      };
    case "html":
      return {
        id,
        type,
        title: "Interactive experience",
        height: 620,
        html: '<!doctype html>\n<html>\n  <head>\n    <meta charset="utf-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1" />\n    <style>\n      body { margin: 0; font-family: system-ui; background: #07171d; color: #f5f1e8; }\n    </style>\n  </head>\n  <body>\n    <main>\n      <h1>Your interactive experience</h1>\n    </main>\n  </body>\n</html>',
      };
    case "code":
      return {
        id,
        type,
        title: "Starter code",
        language: "html",
        code: "<!doctype html>\n<html>\n  <body>\n    <h1>Hello, Pioneer.</h1>\n  </body>\n</html>",
      };
    case "cta":
      return {
        id,
        type,
        heading: "Ready to continue?",
        body: "",
        label: "Take the next step",
        href: "/",
      };
    case "quote":
      return { id, type, quote: "Add a meaningful statement.", attribution: "" };
    case "divider":
      return { id, type };
  }
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const stringValue = (value: unknown, fallback = "") =>
  typeof value === "string" ? value : fallback;

const numberValue = (value: unknown, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? value : fallback;

const normalizeBlock = (value: unknown): SiteBlock | null => {
  if (!isRecord(value)) return null;
  const type = stringValue(value.type) as SiteBlock["type"];
  const id = stringValue(value.id, makeId());

  switch (type) {
    case "heading":
      return {
        id,
        type,
        eyebrow: stringValue(value.eyebrow),
        text: stringValue(value.text, "Untitled section"),
        level: value.level === 3 ? 3 : 2,
      };
    case "text":
      return { id, type, body: stringValue(value.body) };
    case "image":
      return {
        id,
        type,
        url: stringValue(value.url),
        alt: stringValue(value.alt),
        caption: stringValue(value.caption),
      };
    case "video":
      return {
        id,
        type,
        url: stringValue(value.url),
        title: stringValue(value.title, "Video"),
        poster: stringValue(value.poster),
      };
    case "embed":
      return {
        id,
        type,
        url: stringValue(value.url),
        title: stringValue(value.title, "Interactive experience"),
        height: Math.min(1200, Math.max(240, numberValue(value.height, 620))),
        allowEmbed: value.allowEmbed === true,
      };
    case "html":
      return {
        id,
        type,
        title: stringValue(value.title, "Interactive experience"),
        html: stringValue(value.html),
        height: Math.min(1200, Math.max(240, numberValue(value.height, 620))),
      };
    case "code":
      return {
        id,
        type,
        title: stringValue(value.title, "Code"),
        language: stringValue(value.language, "text"),
        code: stringValue(value.code),
      };
    case "cta":
      return {
        id,
        type,
        heading: stringValue(value.heading),
        body: stringValue(value.body),
        label: stringValue(value.label, "Continue"),
        href: stringValue(value.href, "/"),
      };
    case "quote":
      return {
        id,
        type,
        quote: stringValue(value.quote),
        attribution: stringValue(value.attribution),
      };
    case "divider":
      return { id, type };
    default:
      return null;
  }
};

export const normalizeSitePageDocument = (value: unknown): SitePageDocument => {
  if (!isRecord(value)) return createSitePageDocument();
  const seo = isRecord(value.seo) ? value.seo : {};
  const listing = isRecord(value.listing) ? value.listing : {};
  const blocks = Array.isArray(value.blocks)
    ? value.blocks.map(normalizeBlock).filter((block): block is SiteBlock => Boolean(block))
    : [];
  const layout: SitePageLayout =
    value.layout === "showcase" || value.layout === "profile" ? value.layout : "editorial";

  return {
    schemaVersion: 1,
    title: stringValue(value.title, "Untitled page"),
    summary: stringValue(value.summary),
    layout,
    seo: {
      title: stringValue(seo.title),
      description: stringValue(seo.description),
    },
    listing: {
      showOnHome: listing.showOnHome !== false,
      order: Math.round(Math.min(10_000, Math.max(0, numberValue(listing.order, 100)))),
    },
    blocks,
  };
};
