import {
  normalizeSitePageDocument,
  type SitePublicationIndexRecord,
  type SitePublicationRecord,
} from "./types";

const getPublicSupabaseConfig = () => {
  const url = String(import.meta.env.VITE_SUPABASE_URL ?? "").replace(/\/+$/, "");
  const publishableKey = String(
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
  );
  return { url, publishableKey };
};

const normalizePublication = (value: unknown): SitePublicationRecord | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  if (
    typeof row.page_id !== "string" ||
    typeof row.revision_id !== "string" ||
    typeof row.slug !== "string"
  ) {
    return null;
  }

  return {
    page_id: row.page_id,
    revision_id: row.revision_id,
    slug: row.slug,
    document: normalizeSitePageDocument(row.document),
    is_active: row.is_active === true,
    published_at: typeof row.published_at === "string" ? row.published_at : "",
    updated_at: typeof row.updated_at === "string" ? row.updated_at : "",
  };
};

const normalizePublicationIndex = (value: unknown): SitePublicationIndexRecord | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  if (typeof row.page_id !== "string" || typeof row.slug !== "string") return null;

  const listing =
    row.listing && typeof row.listing === "object" && !Array.isArray(row.listing)
      ? (row.listing as Record<string, unknown>)
      : {};

  return {
    page_id: row.page_id,
    slug: row.slug,
    title: typeof row.title === "string" ? row.title : "Untitled page",
    summary: typeof row.summary === "string" ? row.summary : "",
    listing: {
      showOnHome: listing.showOnHome !== false,
      order:
        typeof listing.order === "number" && Number.isFinite(listing.order) ? listing.order : 100,
    },
    published_at: typeof row.published_at === "string" ? row.published_at : "",
    updated_at: typeof row.updated_at === "string" ? row.updated_at : "",
  };
};

const publicRequest = async (path: string, timeoutMs = 2_500) => {
  const { url, publishableKey } = getPublicSupabaseConfig();
  if (!url || !publishableKey) {
    throw new Error("Public content service is not configured.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response: Response;

  try {
    response = await fetch(`${url}/rest/v1/${path.replace(/^\/+/, "")}`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        apikey: publishableKey,
        accept: "application/json",
      },
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    throw new Error(`Public content service returned ${response.status}.`);
  }

  return (await response.json()) as unknown;
};

export const getPublishedSitePage = async (slug: string) => {
  const params = new URLSearchParams({
    select: "page_id,revision_id,slug,document,is_active,published_at,updated_at",
    slug: `eq.${slug}`,
    is_active: "eq.true",
    limit: "1",
  });
  const data = await publicRequest(`site_publications?${params.toString()}`);
  const first = Array.isArray(data) ? data[0] : null;
  return normalizePublication(first);
};

let homepageIndexCache:
  | {
      expiresAt: number;
      pages: SitePublicationIndexRecord[];
    }
  | undefined;
let homepageIndexRequest: Promise<SitePublicationIndexRecord[]> | undefined;

const requestPublishedSitePageIndex = async ({
  homeOnly,
  limit,
}: {
  homeOnly: boolean;
  limit: number;
}) => {
  const params = new URLSearchParams({
    select:
      "page_id,slug,title:document->>title,summary:document->>summary,listing:document->listing,published_at,updated_at",
    is_active: "eq.true",
    order: homeOnly ? "document->listing->order.asc,published_at.desc" : "published_at.desc",
    limit: String(limit),
  });
  if (homeOnly) params.set("document->listing->>showOnHome", "eq.true");

  const data = await publicRequest(
    `site_publications?${params.toString()}`,
    homeOnly ? 1_200 : 2_500,
  );
  return Array.isArray(data)
    ? data
        .map(normalizePublicationIndex)
        .filter((page): page is SitePublicationIndexRecord => Boolean(page))
    : [];
};

export const listHomepageSitePages = async () => {
  if (homepageIndexCache && homepageIndexCache.expiresAt > Date.now()) {
    return homepageIndexCache.pages;
  }
  if (homepageIndexRequest) return homepageIndexRequest;

  homepageIndexRequest = requestPublishedSitePageIndex({ homeOnly: true, limit: 6 })
    .then((pages) => {
      homepageIndexCache = {
        expiresAt: Date.now() + 30_000,
        pages,
      };
      return pages;
    })
    .finally(() => {
      homepageIndexRequest = undefined;
    });

  return homepageIndexRequest;
};

export const listPublishedSitePageIndex = () =>
  requestPublishedSitePageIndex({ homeOnly: false, limit: 500 });
