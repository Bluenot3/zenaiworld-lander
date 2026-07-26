import {
  callVerifiedAdminRpc,
  requestAdminRest,
} from "@/features/admin-registrations/supabaseAdminApi";

import {
  createSitePageDocument,
  normalizeSitePageDocument,
  type SitePageDocument,
  type SitePageRecord,
  type SitePublicationRecord,
  type SiteRevisionRecord,
} from "./types";

const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const asString = (value: unknown, fallback = "") => (typeof value === "string" ? value : fallback);

const asNullableString = (value: unknown) => (typeof value === "string" ? value : null);

const normalizePage = (value: unknown): SitePageRecord => {
  const row = asRecord(value);
  const status =
    row.status === "published" || row.status === "archived" ? row.status : ("draft" as const);

  return {
    id: asString(row.id),
    slug: asString(row.slug),
    status,
    draft_document: normalizeSitePageDocument(row.draft_document),
    archived_at: asNullableString(row.archived_at),
    created_by: asNullableString(row.created_by),
    updated_by: asNullableString(row.updated_by),
    created_at: asString(row.created_at),
    updated_at: asString(row.updated_at),
  };
};

const normalizePublication = (value: unknown): SitePublicationRecord => {
  const row = asRecord(value);
  return {
    page_id: asString(row.page_id),
    revision_id: asString(row.revision_id),
    slug: asString(row.slug),
    document: normalizeSitePageDocument(row.document),
    is_active: row.is_active === true,
    published_at: asString(row.published_at),
    updated_at: asString(row.updated_at),
  };
};

const normalizeRevision = (value: unknown): SiteRevisionRecord => {
  const row = asRecord(value);
  return {
    id: asString(row.id),
    page_id: asString(row.page_id),
    version: typeof row.version === "number" ? row.version : Number(row.version ?? 0),
    slug: asString(row.slug),
    document: normalizeSitePageDocument(row.document),
    published_by: asNullableString(row.published_by),
    published_at: asString(row.published_at),
  };
};

export const listSitePages = async () => {
  const pageParams = new URLSearchParams({
    select: "id,slug,status,draft_document,archived_at,created_by,updated_by,created_at,updated_at",
    order: "updated_at.desc",
  });
  const publicationParams = new URLSearchParams({
    select: "page_id,revision_id,slug,document,is_active,published_at,updated_at",
    order: "published_at.desc",
  });

  const [pageResult, publicationResult] = await Promise.all([
    requestAdminRest<unknown[]>(
      `site_pages?${pageParams.toString()}`,
      { method: "GET" },
      "Unable to load Site Studio pages.",
    ),
    requestAdminRest<unknown[]>(
      `site_publications?${publicationParams.toString()}`,
      { method: "GET" },
      "Unable to load public page snapshots.",
    ),
  ]);

  return {
    pages: Array.isArray(pageResult.data) ? pageResult.data.map(normalizePage) : [],
    publications: Array.isArray(publicationResult.data)
      ? publicationResult.data.map(normalizePublication)
      : [],
  };
};

export const listSiteRevisions = async (pageId: string) => {
  const params = new URLSearchParams({
    select: "id,page_id,version,slug,document,published_by,published_at",
    page_id: `eq.${pageId}`,
    order: "version.desc",
    limit: "100",
  });
  const { data } = await requestAdminRest<unknown[]>(
    `site_revisions?${params.toString()}`,
    { method: "GET" },
    "Unable to load page history.",
  );
  return Array.isArray(data) ? data.map(normalizeRevision) : [];
};

export const createSitePage = async (title: string, slug: string) =>
  callVerifiedAdminRpc<string>(
    "create_site_page",
    {
      _slug: slug,
      _document: createSitePageDocument(title),
    },
    "Unable to create this page.",
  );

export const renameSitePage = async (pageId: string, slug: string) =>
  callVerifiedAdminRpc<string>(
    "rename_site_page",
    { _page_id: pageId, _slug: slug },
    "Unable to reserve this page address.",
  );

export const saveSitePageDraft = async (pageId: string, document: SitePageDocument) =>
  callVerifiedAdminRpc<string>(
    "save_site_page_draft",
    { _page_id: pageId, _document: document },
    "Unable to save this draft.",
  );

export const publishSitePage = async (pageId: string) =>
  callVerifiedAdminRpc<string>(
    "publish_site_page",
    { _page_id: pageId },
    "Unable to publish this page.",
  );

export const archiveSitePage = async (pageId: string) =>
  callVerifiedAdminRpc<string>(
    "archive_site_page",
    { _page_id: pageId },
    "Unable to archive this page.",
  );

export const restoreArchivedSitePage = async (pageId: string) =>
  callVerifiedAdminRpc<string>(
    "restore_site_page",
    { _page_id: pageId },
    "Unable to restore the published page.",
  );

export const restoreSiteRevision = async (revisionId: string) =>
  callVerifiedAdminRpc<string>(
    "restore_site_revision",
    { _revision_id: revisionId },
    "Unable to restore this version into the draft.",
  );
