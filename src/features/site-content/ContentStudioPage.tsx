import {
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Clock3,
  Code2,
  Copy,
  ExternalLink,
  FileCode2,
  FileText,
  Globe2,
  Heading2,
  Image as ImageIcon,
  LayoutDashboard,
  Link2,
  LoaderCircle,
  LogOut,
  Monitor,
  Plus,
  Quote,
  RefreshCw,
  RotateCcw,
  Save,
  SeparatorHorizontal,
  Send,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { AdminBrandMark, AdminLoading, AdminLogin } from "@/features/admin/AdminAccess";
import {
  AdminApiError,
  restoreVerifiedAdminSession,
  signOutAdmin,
} from "@/features/admin-registrations/supabaseAdminApi";
import type { AdminSession } from "@/features/admin-registrations/types";
import {
  archiveSitePage,
  createSitePage,
  listSitePages,
  listSiteRevisions,
  publishSitePage,
  renameSitePage,
  restoreArchivedSitePage,
  restoreSiteRevision,
  saveSitePageDraft,
} from "./contentAdminApi";
import { SitePageRenderer } from "./SitePageRenderer";
import {
  createSiteBlock,
  createSitePageDocument,
  type SiteBlock,
  type SitePageDocument,
  type SitePageLayout,
  type SitePageRecord,
  type SitePublicationRecord,
  type SiteRevisionRecord,
} from "./types";

import "@/features/admin-registrations/admin-registrations.css";
import "./content-studio.css";

type MobileTab = "pages" | "edit" | "preview";
type BusyAction = "create" | "save" | "publish" | "archive" | "restore" | "revision" | null;

const BLOCK_OPTIONS: Array<{
  type: SiteBlock["type"];
  label: string;
  description: string;
}> = [
  { type: "heading", label: "Heading", description: "Section title" },
  { type: "text", label: "Text", description: "Story or context" },
  { type: "image", label: "Image", description: "Visual and caption" },
  { type: "video", label: "Video", description: "Hosted video file" },
  { type: "embed", label: "URL embed", description: "External experience" },
  { type: "html", label: "HTML", description: "Sandboxed interactive" },
  { type: "code", label: "Code", description: "Copyable source" },
  { type: "cta", label: "Action", description: "Next-step panel" },
  { type: "quote", label: "Quote", description: "Statement or proof" },
  { type: "divider", label: "Divider", description: "Visual pause" },
];

const LAYOUT_OPTIONS: Array<{
  value: SitePageLayout;
  label: string;
  description: string;
}> = [
  { value: "editorial", label: "Editorial", description: "Long-form story and updates" },
  { value: "showcase", label: "Showcase", description: "Visual work and launches" },
  { value: "profile", label: "Profile", description: "People, partners, and organizations" },
];

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

const makeBlockId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const normalizeSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

const editorSnapshot = (slug: string, document: SitePageDocument) =>
  JSON.stringify({ slug, document });

const formatDate = (value: string) => {
  if (!value) return "Not yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

function BlockIcon({ type, size = 16 }: { type: SiteBlock["type"]; size?: number }) {
  switch (type) {
    case "heading":
      return <Heading2 size={size} />;
    case "text":
      return <FileText size={size} />;
    case "image":
      return <ImageIcon size={size} />;
    case "video":
      return <Video size={size} />;
    case "embed":
      return <Link2 size={size} />;
    case "html":
      return <FileCode2 size={size} />;
    case "code":
      return <Code2 size={size} />;
    case "cta":
      return <Send size={size} />;
    case "quote":
      return <Quote size={size} />;
    case "divider":
      return <SeparatorHorizontal size={size} />;
  }
}

function BlockFields({
  block,
  onChange,
}: {
  block: SiteBlock;
  onChange: (block: SiteBlock) => void;
}) {
  switch (block.type) {
    case "heading":
      return (
        <div className="zcs-fields zcs-fields--two">
          <label className="zcs-field">
            <span>Optional label</span>
            <input
              value={block.eyebrow}
              onChange={(event) => onChange({ ...block, eyebrow: event.target.value })}
              placeholder="For example: Field note"
            />
          </label>
          <label className="zcs-field">
            <span>Heading size</span>
            <select
              value={block.level}
              onChange={(event) =>
                onChange({ ...block, level: event.target.value === "3" ? 3 : 2 })
              }
            >
              <option value={2}>Section heading</option>
              <option value={3}>Subheading</option>
            </select>
          </label>
          <label className="zcs-field zcs-field--wide">
            <span>Heading text</span>
            <input
              value={block.text}
              onChange={(event) => onChange({ ...block, text: event.target.value })}
              placeholder="Name this section"
            />
          </label>
        </div>
      );
    case "text":
      return (
        <label className="zcs-field">
          <span>Text</span>
          <textarea
            rows={7}
            value={block.body}
            onChange={(event) => onChange({ ...block, body: event.target.value })}
            placeholder="Separate paragraphs with a blank line."
          />
        </label>
      );
    case "image":
      return (
        <div className="zcs-fields zcs-fields--two">
          <label className="zcs-field zcs-field--wide">
            <span>Image address</span>
            <input
              type="url"
              inputMode="url"
              value={block.url}
              onChange={(event) => onChange({ ...block, url: event.target.value })}
              placeholder="https://..."
            />
          </label>
          <label className="zcs-field">
            <span>Alternative text</span>
            <input
              value={block.alt}
              onChange={(event) => onChange({ ...block, alt: event.target.value })}
              placeholder="Describe the image"
            />
          </label>
          <label className="zcs-field">
            <span>Caption</span>
            <input
              value={block.caption}
              onChange={(event) => onChange({ ...block, caption: event.target.value })}
              placeholder="Optional context or credit"
            />
          </label>
        </div>
      );
    case "video":
      return (
        <div className="zcs-fields zcs-fields--two">
          <label className="zcs-field zcs-field--wide">
            <span>Video file address</span>
            <input
              type="url"
              inputMode="url"
              value={block.url}
              onChange={(event) => onChange({ ...block, url: event.target.value })}
              placeholder="HTTPS address for an MP4 or web video file"
            />
          </label>
          <label className="zcs-field">
            <span>Video title</span>
            <input
              value={block.title}
              onChange={(event) => onChange({ ...block, title: event.target.value })}
              placeholder="What viewers will see"
            />
          </label>
          <label className="zcs-field">
            <span>Poster image</span>
            <input
              type="url"
              inputMode="url"
              value={block.poster}
              onChange={(event) => onChange({ ...block, poster: event.target.value })}
              placeholder="Optional HTTPS image address"
            />
          </label>
        </div>
      );
    case "embed":
      return (
        <div className="zcs-fields zcs-fields--two">
          <label className="zcs-field zcs-field--wide">
            <span>Experience address</span>
            <input
              type="url"
              inputMode="url"
              value={block.url}
              onChange={(event) => onChange({ ...block, url: event.target.value })}
              placeholder="https://..."
            />
          </label>
          <label className="zcs-field">
            <span>Display title</span>
            <input
              value={block.title}
              onChange={(event) => onChange({ ...block, title: event.target.value })}
            />
          </label>
          <label className="zcs-field">
            <span>Frame height</span>
            <input
              type="number"
              min={240}
              max={1200}
              step={20}
              value={block.height}
              onChange={(event) =>
                onChange({
                  ...block,
                  height: Math.min(1200, Math.max(240, Number(event.target.value) || 240)),
                })
              }
            />
          </label>
          <label className="zcs-toggle zcs-field--wide">
            <input
              type="checkbox"
              checked={block.allowEmbed}
              onChange={(event) => onChange({ ...block, allowEmbed: event.target.checked })}
            />
            <span aria-hidden="true" />
            <div>
              <strong>Display inside the page</strong>
              <small>
                Turn this on only when the source permits framing. A secure open-link fallback
                remains available.
              </small>
            </div>
          </label>
        </div>
      );
    case "html":
      return (
        <div className="zcs-fields zcs-fields--two">
          <label className="zcs-field">
            <span>Experience title</span>
            <input
              value={block.title}
              onChange={(event) => onChange({ ...block, title: event.target.value })}
            />
          </label>
          <label className="zcs-field">
            <span>Frame height</span>
            <input
              type="number"
              min={240}
              max={1200}
              step={20}
              value={block.height}
              onChange={(event) =>
                onChange({
                  ...block,
                  height: Math.min(1200, Math.max(240, Number(event.target.value) || 240)),
                })
              }
            />
          </label>
          <label className="zcs-field zcs-field--wide">
            <span>HTML, CSS, and JavaScript</span>
            <textarea
              className="zcs-code-input"
              rows={15}
              spellCheck={false}
              value={block.html}
              onChange={(event) => onChange({ ...block, html: event.target.value })}
            />
            <small>
              Runs in a restricted iframe with no network, storage, parent-page, or credential
              access.
            </small>
          </label>
        </div>
      );
    case "code":
      return (
        <div className="zcs-fields zcs-fields--two">
          <label className="zcs-field">
            <span>Block title</span>
            <input
              value={block.title}
              onChange={(event) => onChange({ ...block, title: event.target.value })}
            />
          </label>
          <label className="zcs-field">
            <span>Language</span>
            <input
              value={block.language}
              onChange={(event) => onChange({ ...block, language: event.target.value })}
              placeholder="html, css, javascript, python..."
            />
          </label>
          <label className="zcs-field zcs-field--wide">
            <span>Copyable code</span>
            <textarea
              className="zcs-code-input"
              rows={13}
              spellCheck={false}
              value={block.code}
              onChange={(event) => onChange({ ...block, code: event.target.value })}
            />
          </label>
        </div>
      );
    case "cta":
      return (
        <div className="zcs-fields zcs-fields--two">
          <label className="zcs-field zcs-field--wide">
            <span>Heading</span>
            <input
              value={block.heading}
              onChange={(event) => onChange({ ...block, heading: event.target.value })}
            />
          </label>
          <label className="zcs-field zcs-field--wide">
            <span>Supporting text</span>
            <textarea
              rows={3}
              value={block.body}
              onChange={(event) => onChange({ ...block, body: event.target.value })}
            />
          </label>
          <label className="zcs-field">
            <span>Button label</span>
            <input
              value={block.label}
              onChange={(event) => onChange({ ...block, label: event.target.value })}
            />
          </label>
          <label className="zcs-field">
            <span>Button destination</span>
            <input
              value={block.href}
              onChange={(event) => onChange({ ...block, href: event.target.value })}
              placeholder="/programs or https://..."
            />
          </label>
        </div>
      );
    case "quote":
      return (
        <div className="zcs-fields">
          <label className="zcs-field">
            <span>Quote</span>
            <textarea
              rows={5}
              value={block.quote}
              onChange={(event) => onChange({ ...block, quote: event.target.value })}
            />
          </label>
          <label className="zcs-field">
            <span>Attribution</span>
            <input
              value={block.attribution}
              onChange={(event) => onChange({ ...block, attribution: event.target.value })}
              placeholder="Name, role, or source"
            />
          </label>
        </div>
      );
    case "divider":
      return (
        <p className="zcs-divider-note">
          This adds a quiet visual break between the content above and below.
        </p>
      );
  }
}

function BlockEditor({
  block,
  index,
  total,
  onChange,
  onMove,
  onDuplicate,
  onDelete,
}: {
  block: SiteBlock;
  index: number;
  total: number;
  onChange: (block: SiteBlock) => void;
  onMove: (direction: -1 | 1) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const label = BLOCK_OPTIONS.find((option) => option.type === block.type)?.label ?? block.type;

  return (
    <article className="zcs-block">
      <header className="zcs-block__header">
        <div className="zcs-block__identity">
          <span>
            <BlockIcon type={block.type} />
          </span>
          <div>
            <strong>{label}</strong>
            <small>Block {index + 1}</small>
          </div>
        </div>
        <div className="zcs-block__actions">
          <button
            type="button"
            onClick={() => onMove(-1)}
            disabled={index === 0}
            aria-label={`Move ${label} up`}
            title="Move up"
          >
            <ArrowUp size={15} />
          </button>
          <button
            type="button"
            onClick={() => onMove(1)}
            disabled={index === total - 1}
            aria-label={`Move ${label} down`}
            title="Move down"
          >
            <ArrowDown size={15} />
          </button>
          <button
            type="button"
            onClick={onDuplicate}
            aria-label={`Duplicate ${label}`}
            title="Duplicate block"
          >
            <Copy size={15} />
          </button>
          <button
            className="zcs-block__delete"
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${label}`}
            title="Delete block"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </header>
      <div className="zcs-block__body">
        <BlockFields block={block} onChange={onChange} />
      </div>
    </article>
  );
}

export function ContentStudioPage() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [restoring, setRestoring] = useState(true);
  const [pages, setPages] = useState<SitePageRecord[]>([]);
  const [publications, setPublications] = useState<SitePublicationRecord[]>([]);
  const [revisions, setRevisions] = useState<SiteRevisionRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [draft, setDraft] = useState<SitePageDocument>(() => createSitePageDocument());
  const [baseline, setBaseline] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [busy, setBusy] = useState<BusyAction>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [createTitle, setCreateTitle] = useState("");
  const [createSlug, setCreateSlug] = useState("");
  const [slugWasEdited, setSlugWasEdited] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("pages");
  const [htmlPreview, setHtmlPreview] = useState<Record<string, string>>({});
  const [htmlRunKey, setHtmlRunKey] = useState(0);
  const historyRequest = useRef(0);

  const selected = useMemo(
    () => pages.find((page) => page.id === selectedId) ?? null,
    [pages, selectedId],
  );
  const publication = useMemo(
    () => publications.find((item) => item.page_id === selectedId) ?? null,
    [publications, selectedId],
  );
  const dirty = selected ? editorSnapshot(slug, draft) !== baseline : false;
  const differsFromPublication = selected
    ? !publication ||
      editorSnapshot(slug, draft) !== editorSnapshot(publication.slug, publication.document)
    : false;
  const hasHtmlBlocks = draft.blocks.some((block) => block.type === "html");

  const endAdminSession = useCallback(async () => {
    await signOutAdmin();
    setSession(null);
    setPages([]);
    setPublications([]);
    setRevisions([]);
    setSelectedId(null);
    setError("");
    setNotice("");
    setHtmlPreview({});
  }, []);

  const reportFailure = useCallback(
    async (caught: unknown, fallback: string) => {
      setError(getErrorMessage(caught, fallback));
      if (caught instanceof AdminApiError && (caught.status === 401 || caught.status === 403)) {
        await endAdminSession();
      }
    },
    [endAdminSession],
  );

  const seedEditor = useCallback((page: SitePageRecord | null) => {
    if (!page) {
      setSelectedId(null);
      setSlug("");
      setDraft(createSitePageDocument());
      setBaseline("");
      setRevisions([]);
      setHtmlPreview({});
      return;
    }

    setSelectedId(page.id);
    setSlug(page.slug);
    setDraft(page.draft_document);
    setBaseline(editorSnapshot(page.slug, page.draft_document));
    setHtmlPreview({});
  }, []);

  const loadHistory = useCallback(
    async (pageId: string) => {
      const requestId = ++historyRequest.current;
      setHistoryLoading(true);
      try {
        const nextRevisions = await listSiteRevisions(pageId);
        if (requestId === historyRequest.current) setRevisions(nextRevisions);
      } catch (caught) {
        if (requestId === historyRequest.current) {
          setRevisions([]);
          await reportFailure(caught, "Unable to load this page's published history.");
        }
      } finally {
        if (requestId === historyRequest.current) setHistoryLoading(false);
      }
    },
    [reportFailure],
  );

  const loadWorkspace = useCallback(
    async (preferredId?: string | null) => {
      setLoading(true);
      setError("");

      try {
        const result = await listSitePages();
        setPages(result.pages);
        setPublications(result.publications);

        const nextPage =
          result.pages.find((page) => page.id === preferredId) ?? result.pages.at(0) ?? null;
        seedEditor(nextPage);
        if (nextPage) await loadHistory(nextPage.id);
      } catch (caught) {
        await reportFailure(caught, "Unable to load ZEN Site Studio.");
      } finally {
        setLoading(false);
      }
    },
    [loadHistory, reportFailure, seedEditor],
  );

  useEffect(() => {
    let active = true;

    void restoreVerifiedAdminSession().then(async (restoredSession) => {
      if (!active) return;
      setSession(restoredSession);
      setRestoring(false);
      if (restoredSession) await loadWorkspace();
    });

    return () => {
      active = false;
    };
  }, [loadWorkspace]);

  useEffect(() => {
    if (!dirty) return;

    const warnBeforeExit = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeExit);
    return () => window.removeEventListener("beforeunload", warnBeforeExit);
  }, [dirty]);

  const handleAuthenticated = async (nextSession: AdminSession) => {
    setSession(nextSession);
    await loadWorkspace();
  };

  const handleSignOut = async () => {
    if (dirty && !window.confirm("Sign out and discard the unsaved changes on this page?")) {
      return;
    }
    await endAdminSession();
  };

  const handleCreateTitle = (value: string) => {
    setCreateTitle(value);
    if (!slugWasEdited) setCreateSlug(normalizeSlug(value));
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    if (dirty && !window.confirm("Discard the unsaved changes before creating a new page?")) {
      return;
    }

    const title = createTitle.trim();
    const nextSlug = normalizeSlug(createSlug || title);
    if (!title || !nextSlug) {
      setError("Add a page title and a valid page address.");
      return;
    }

    setBusy("create");
    setError("");
    setNotice("");
    try {
      const pageId = await createSitePage(title, nextSlug);
      setCreateTitle("");
      setCreateSlug("");
      setSlugWasEdited(false);
      await loadWorkspace(pageId);
      setMobileTab("edit");
      setNotice("New private draft created.");
    } catch (caught) {
      await reportFailure(caught, "Unable to create this page.");
    } finally {
      setBusy(null);
    }
  };

  const handleSelectPage = async (page: SitePageRecord) => {
    if (page.id === selectedId) {
      setMobileTab("edit");
      return;
    }
    if (dirty && !window.confirm("Discard the unsaved changes on this page?")) return;

    seedEditor(page);
    setError("");
    setNotice("");
    setMobileTab("edit");
    await loadHistory(page.id);
  };

  const updateBlock = (blockId: string, nextBlock: SiteBlock) => {
    setDraft((current) => ({
      ...current,
      blocks: current.blocks.map((block) => (block.id === blockId ? nextBlock : block)),
    }));
  };

  const addBlock = (type: SiteBlock["type"]) => {
    setDraft((current) => ({
      ...current,
      blocks: [...current.blocks, createSiteBlock(type)],
    }));
    setMobileTab("edit");
  };

  const handleRunHtmlPreview = () => {
    setHtmlPreview(
      Object.fromEntries(
        draft.blocks
          .filter((block): block is Extract<SiteBlock, { type: "html" }> => block.type === "html")
          .map((block) => [block.id, block.html]),
      ),
    );
    setHtmlRunKey((current) => current + 1);
  };

  const moveBlock = (index: number, direction: -1 | 1) => {
    setDraft((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.blocks.length) return current;
      const blocks = [...current.blocks];
      [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
      return { ...current, blocks };
    });
  };

  const duplicateBlock = (index: number) => {
    setDraft((current) => {
      const source = current.blocks[index];
      if (!source) return current;
      const duplicate = { ...source, id: makeBlockId() } as SiteBlock;
      const blocks = [...current.blocks];
      blocks.splice(index + 1, 0, duplicate);
      return { ...current, blocks };
    });
  };

  const deleteBlock = (index: number) => {
    const block = draft.blocks[index];
    if (!block) return;
    const label = BLOCK_OPTIONS.find((option) => option.type === block.type)?.label ?? "block";
    if (!window.confirm(`Delete this ${label.toLowerCase()} block?`)) return;
    setDraft((current) => ({
      ...current,
      blocks: current.blocks.filter((_, blockIndex) => blockIndex !== index),
    }));
  };

  const commitDraft = async () => {
    if (!selected) throw new Error("Select a page before saving.");
    const nextSlug = normalizeSlug(slug);
    if (!nextSlug) throw new Error("Add a valid page address before saving.");

    if (nextSlug !== selected.slug) {
      await renameSitePage(selected.id, nextSlug);
    }
    await saveSitePageDraft(selected.id, draft);
    return nextSlug;
  };

  const handleRefresh = async () => {
    if (loading || busy) return;
    if (dirty && !window.confirm("Discard the unsaved changes and reload from Site Studio?")) {
      return;
    }
    await loadWorkspace(selectedId);
  };

  const handleSave = async () => {
    if (!selected || busy) return;
    setBusy("save");
    setError("");
    setNotice("");
    try {
      await commitDraft();
      await loadWorkspace(selected.id);
      setNotice("Private draft saved.");
    } catch (caught) {
      await reportFailure(caught, "Unable to save this draft.");
    } finally {
      setBusy(null);
    }
  };

  const handlePublish = async () => {
    if (!selected || busy) return;
    setBusy("publish");
    setError("");
    setNotice("");
    try {
      await commitDraft();
      await publishSitePage(selected.id);
      await loadWorkspace(selected.id);
      setNotice("Published snapshot is now live.");
      setMobileTab("preview");
    } catch (caught) {
      await reportFailure(caught, "Unable to publish this page.");
    } finally {
      setBusy(null);
    }
  };

  const handleArchive = async () => {
    if (!selected || busy) return;
    const description =
      selected.status === "published"
        ? "This will remove the public page while keeping its draft and history."
        : "This will archive the private draft. It can be restored later.";
    if (!window.confirm(`${description} Continue?`)) return;

    setBusy("archive");
    setError("");
    setNotice("");
    try {
      if (dirty) await commitDraft();
      await archiveSitePage(selected.id);
      await loadWorkspace(selected.id);
      setNotice("Page archived. Its content and history were preserved.");
    } catch (caught) {
      await reportFailure(caught, "Unable to archive this page.");
    } finally {
      setBusy(null);
    }
  };

  const handleRestorePublication = async () => {
    if (!selected || busy) return;
    if (
      !window.confirm(
        "Restore the latest published snapshot to its public address? Unsaved draft changes remain private.",
      )
    ) {
      return;
    }

    setBusy("restore");
    setError("");
    setNotice("");
    try {
      if (dirty) await commitDraft();
      await restoreArchivedSitePage(selected.id);
      await loadWorkspace(selected.id);
      setNotice("The archived publication is live again.");
      setMobileTab("preview");
    } catch (caught) {
      await reportFailure(caught, "Unable to restore this publication.");
    } finally {
      setBusy(null);
    }
  };

  const handleRestoreRevision = async (revision: SiteRevisionRecord) => {
    if (!selected || busy) return;
    if (
      !window.confirm(
        `Restore published version ${revision.version} into the private draft? The live page will not change until you publish again.`,
      )
    ) {
      return;
    }

    setBusy("revision");
    setError("");
    setNotice("");
    try {
      await restoreSiteRevision(revision.id);
      await loadWorkspace(selected.id);
      setNotice(`Version ${revision.version} restored into the private draft.`);
      setMobileTab("edit");
    } catch (caught) {
      await reportFailure(caught, "Unable to restore this version.");
    } finally {
      setBusy(null);
    }
  };

  if (restoring) {
    return <AdminLoading label="Verifying secure Site Studio session..." />;
  }

  if (!session) {
    return (
      <AdminLogin
        onAuthenticated={handleAuthenticated}
        title="Your public story, fully under your control."
        description="Create, arrange, preview, publish, archive, and restore ZEN AI World pages without exposing the studio or changing course, payment, or learner systems."
        panelTitle="Sign in to Site Studio"
        panelDescription="Use the same verified Supabase owner account used by ZEN program operations."
      />
    );
  }

  const paneClass = (tab: MobileTab) =>
    `zcs-pane zcs-pane--${tab}${mobileTab === tab ? " zcs-pane--active" : ""}`;
  const statusLabel =
    selected?.status === "published"
      ? "Live"
      : selected?.status === "archived"
        ? "Archived"
        : "Private draft";

  return (
    <main className="zar-shell zcs-shell">
      <header className="zar-topbar zcs-topbar">
        <div className="zar-topbar__brand">
          <AdminBrandMark />
          <div>
            <strong>ZEN AI WORLD</strong>
            <span>Site Studio</span>
          </div>
        </div>
        <div className="zar-topbar__account">
          <span>{session.email}</span>
          <a
            href="/admin/registrations"
            className="zar-icon-button"
            aria-label="Open program registrations"
            title="Program registrations"
          >
            <LayoutDashboard size={17} />
          </a>
          <a href="/" className="zar-icon-button" aria-label="Back to ZEN AI World">
            <ArrowLeft size={17} />
          </a>
          <button
            className="zar-icon-button"
            onClick={() => void handleSignOut()}
            aria-label="Sign out"
          >
            <LogOut size={17} />
          </button>
        </div>
      </header>

      <section className="zcs-commandbar">
        <div className="zcs-commandbar__title">
          <div>
            <span className={`zcs-status zcs-status--${selected?.status ?? "draft"}`}>
              {statusLabel}
            </span>
            {dirty ? <span className="zcs-unsaved">Unsaved changes</span> : null}
            {!dirty && selected?.status === "published" && differsFromPublication ? (
              <span className="zcs-unsaved">Ready to publish</span>
            ) : null}
          </div>
          <h1>{selected ? draft.title || "Untitled page" : "ZEN Site Studio"}</h1>
          {selected ? (
            <p>
              zenai.world/work/<strong>{normalizeSlug(slug) || "page-address"}</strong>
            </p>
          ) : (
            <p>Create the first managed page to begin.</p>
          )}
        </div>

        <div className="zcs-commandbar__actions">
          <button
            className="zar-secondary-button"
            type="button"
            onClick={() => void handleRefresh()}
            disabled={loading || Boolean(busy)}
          >
            <RefreshCw className={loading ? "zar-spin" : ""} size={16} />
            Refresh
          </button>
          {selected ? (
            <>
              {selected.status === "archived" ? (
                publication ? (
                  <button
                    className="zar-secondary-button"
                    type="button"
                    onClick={() => void handleRestorePublication()}
                    disabled={Boolean(busy)}
                  >
                    {busy === "restore" ? (
                      <LoaderCircle className="zar-spin" size={16} />
                    ) : (
                      <RotateCcw size={16} />
                    )}
                    Restore live
                  </button>
                ) : (
                  <button
                    className="zar-secondary-button"
                    type="button"
                    onClick={() => void handleSave()}
                    disabled={Boolean(busy)}
                  >
                    {busy === "save" ? (
                      <LoaderCircle className="zar-spin" size={16} />
                    ) : (
                      <RotateCcw size={16} />
                    )}
                    Restore draft
                  </button>
                )
              ) : (
                <button
                  className="zar-danger-button"
                  type="button"
                  onClick={() => void handleArchive()}
                  disabled={Boolean(busy)}
                >
                  {busy === "archive" ? (
                    <LoaderCircle className="zar-spin" size={16} />
                  ) : (
                    <Archive size={16} />
                  )}
                  {selected.status === "published" ? "Unpublish" : "Archive"}
                </button>
              )}
              <button
                className="zar-secondary-button"
                type="button"
                onClick={() => void handleSave()}
                disabled={Boolean(busy) || !dirty}
              >
                {busy === "save" ? (
                  <LoaderCircle className="zar-spin" size={16} />
                ) : (
                  <Save size={16} />
                )}
                Save draft
              </button>
              <button
                className="zar-primary-button"
                type="button"
                onClick={() => void handlePublish()}
                disabled={
                  Boolean(busy) ||
                  selected.status === "archived" ||
                  (selected.status === "published" && !differsFromPublication)
                }
              >
                {busy === "publish" ? (
                  <LoaderCircle className="zar-spin" size={16} />
                ) : (
                  <Globe2 size={16} />
                )}
                Publish
              </button>
            </>
          ) : null}
        </div>
      </section>

      {error ? (
        <div className="zar-banner zar-banner--error zcs-banner" role="alert">
          <X size={18} />
          <span>{error}</span>
          <button onClick={() => setError("")} aria-label="Dismiss error">
            <X size={15} />
          </button>
        </div>
      ) : null}
      {notice ? (
        <div className="zar-banner zar-banner--success zcs-banner" role="status">
          <Check size={18} />
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="Dismiss notice">
            <X size={15} />
          </button>
        </div>
      ) : null}

      <nav className="zcs-mobile-tabs" aria-label="Site Studio panels" role="tablist">
        {(
          [
            ["pages", "Pages", FileText],
            ["edit", "Edit", Code2],
            ["preview", "Preview", Monitor],
          ] as const
        ).map(([tab, label, Icon]) => (
          <button
            key={tab}
            type="button"
            className={mobileTab === tab ? "zcs-mobile-tab--active" : ""}
            onClick={() => setMobileTab(tab)}
            aria-selected={mobileTab === tab}
            role="tab"
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </nav>

      <section className="zcs-workspace">
        <aside className={paneClass("pages")} aria-label="Site pages">
          <div className="zcs-pane__heading">
            <div>
              <span>Page library</span>
              <strong>{pages.length} total</strong>
            </div>
          </div>

          <form className="zcs-create" onSubmit={handleCreate}>
            <div>
              <Plus size={16} />
              <strong>New page</strong>
            </div>
            <label className="zcs-field">
              <span>Page title</span>
              <input
                value={createTitle}
                onChange={(event) => handleCreateTitle(event.target.value)}
                placeholder="Project, story, person..."
                disabled={busy === "create"}
              />
            </label>
            <label className="zcs-field">
              <span>Page address</span>
              <div className="zcs-slug-input zcs-slug-input--compact">
                <span>/work/</span>
                <input
                  value={createSlug}
                  onChange={(event) => {
                    setSlugWasEdited(true);
                    setCreateSlug(event.target.value);
                  }}
                  onBlur={() => setCreateSlug((current) => normalizeSlug(current))}
                  placeholder="page-address"
                  disabled={busy === "create"}
                />
              </div>
            </label>
            <button
              className="zar-primary-button"
              type="submit"
              disabled={busy === "create" || !createTitle.trim()}
            >
              {busy === "create" ? (
                <LoaderCircle className="zar-spin" size={16} />
              ) : (
                <Plus size={16} />
              )}
              Create private draft
            </button>
          </form>

          <div className="zcs-page-list">
            {loading && pages.length === 0 ? (
              <div className="zcs-panel-state">
                <LoaderCircle className="zar-spin" size={20} />
                <p>Loading protected pages...</p>
              </div>
            ) : pages.length === 0 ? (
              <div className="zcs-panel-state">
                <FileText size={20} />
                <p>No managed pages yet.</p>
              </div>
            ) : (
              pages.map((page) => {
                const pagePublication = publications.find((item) => item.page_id === page.id);
                return (
                  <button
                    key={page.id}
                    type="button"
                    className={`zcs-page-row${page.id === selectedId ? " zcs-page-row--active" : ""}`}
                    onClick={() => void handleSelectPage(page)}
                  >
                    <span className={`zcs-page-row__status zcs-page-row__status--${page.status}`} />
                    <span>
                      <strong>{page.draft_document.title || "Untitled page"}</strong>
                      <small>/work/{page.slug}</small>
                      <small>
                        {pagePublication?.is_active ? "Published" : page.status} ·{" "}
                        {formatDate(page.updated_at)}
                      </small>
                    </span>
                    <ArrowLeft className="zcs-page-row__arrow" size={15} />
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section className={paneClass("edit")} aria-label="Page editor">
          {selected ? (
            <>
              <div className="zcs-pane__heading">
                <div>
                  <span>Page editor</span>
                  <strong>{draft.blocks.length} content blocks</strong>
                </div>
                <span>{dirty ? "Draft changed" : "Draft saved"}</span>
              </div>

              <div className="zcs-editor-scroll">
                <section className="zcs-section">
                  <div className="zcs-section__heading">
                    <span>01</span>
                    <div>
                      <h2>Page identity</h2>
                      <p>Title, introduction, layout, address, and search display.</p>
                    </div>
                  </div>
                  <div className="zcs-fields zcs-fields--two">
                    <label className="zcs-field zcs-field--wide">
                      <span>Page title</span>
                      <input
                        value={draft.title}
                        onChange={(event) =>
                          setDraft((current) => ({ ...current, title: event.target.value }))
                        }
                        placeholder="Name this page"
                      />
                    </label>
                    <label className="zcs-field zcs-field--wide">
                      <span>Summary</span>
                      <textarea
                        rows={4}
                        value={draft.summary}
                        onChange={(event) =>
                          setDraft((current) => ({ ...current, summary: event.target.value }))
                        }
                        placeholder="A concise introduction shown beneath the title."
                      />
                    </label>
                    <label className="zcs-field zcs-field--wide">
                      <span>Public address</span>
                      <div className="zcs-slug-input">
                        <span>zenai.world/work/</span>
                        <input
                          value={slug}
                          onChange={(event) => setSlug(event.target.value)}
                          onBlur={() => setSlug((current) => normalizeSlug(current))}
                          placeholder="page-address"
                        />
                      </div>
                      {normalizeSlug(slug) !== slug && slug ? (
                        <small>It will save as {normalizeSlug(slug) || "page-address"}.</small>
                      ) : null}
                    </label>
                    <fieldset className="zcs-layout-picker zcs-field--wide">
                      <legend>Layout</legend>
                      {LAYOUT_OPTIONS.map((option) => (
                        <label key={option.value}>
                          <input
                            type="radio"
                            name="page-layout"
                            value={option.value}
                            checked={draft.layout === option.value}
                            onChange={() =>
                              setDraft((current) => ({
                                ...current,
                                layout: option.value,
                              }))
                            }
                          />
                          <span>
                            <strong>{option.label}</strong>
                            <small>{option.description}</small>
                          </span>
                        </label>
                      ))}
                    </fieldset>
                    <label className="zcs-field">
                      <span>Homepage order</span>
                      <input
                        type="number"
                        min={0}
                        max={10_000}
                        step={10}
                        value={draft.listing.order}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            listing: {
                              ...current.listing,
                              order: Math.min(10_000, Math.max(0, Number(event.target.value) || 0)),
                            },
                          }))
                        }
                      />
                      <small>Lower numbers appear first in Work &amp; Proof.</small>
                    </label>
                    <label className="zcs-toggle">
                      <input
                        type="checkbox"
                        checked={draft.listing.showOnHome}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            listing: {
                              ...current.listing,
                              showOnHome: event.target.checked,
                            },
                          }))
                        }
                      />
                      <span aria-hidden="true" />
                      <div>
                        <strong>Show on homepage</strong>
                        <small>The public page still works when this listing is hidden.</small>
                      </div>
                    </label>
                    <label className="zcs-field">
                      <span>Search title</span>
                      <input
                        value={draft.seo.title}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            seo: { ...current.seo, title: event.target.value },
                          }))
                        }
                        placeholder={draft.title || "Optional browser title"}
                      />
                    </label>
                    <label className="zcs-field">
                      <span>Search description</span>
                      <textarea
                        rows={3}
                        value={draft.seo.description}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            seo: { ...current.seo, description: event.target.value },
                          }))
                        }
                        placeholder={draft.summary || "Optional search description"}
                      />
                    </label>
                  </div>
                </section>

                <section className="zcs-section">
                  <div className="zcs-section__heading">
                    <span>02</span>
                    <div>
                      <h2>Content canvas</h2>
                      <p>Add only what this page needs, then move or duplicate it at any time.</p>
                    </div>
                  </div>

                  <div className="zcs-add-block">
                    {BLOCK_OPTIONS.map((option) => (
                      <button key={option.type} type="button" onClick={() => addBlock(option.type)}>
                        <span>
                          <BlockIcon type={option.type} size={17} />
                        </span>
                        <div>
                          <strong>{option.label}</strong>
                          <small>{option.description}</small>
                        </div>
                        <Plus size={14} />
                      </button>
                    ))}
                  </div>

                  <div className="zcs-block-list">
                    {draft.blocks.length === 0 ? (
                      <div className="zcs-empty-canvas">
                        <Plus size={22} />
                        <h3>Build this page one block at a time.</h3>
                        <p>
                          Choose a content type above. Every change appears instantly in the private
                          preview.
                        </p>
                      </div>
                    ) : (
                      draft.blocks.map((block, index) => (
                        <BlockEditor
                          key={block.id}
                          block={block}
                          index={index}
                          total={draft.blocks.length}
                          onChange={(nextBlock) => updateBlock(block.id, nextBlock)}
                          onMove={(direction) => moveBlock(index, direction)}
                          onDuplicate={() => duplicateBlock(index)}
                          onDelete={() => deleteBlock(index)}
                        />
                      ))
                    )}
                  </div>
                </section>

                <section className="zcs-section zcs-history">
                  <div className="zcs-section__heading">
                    <span>03</span>
                    <div>
                      <h2>Published history</h2>
                      <p>
                        Restore any prior publication into the draft without changing the live page.
                      </p>
                    </div>
                  </div>

                  {historyLoading ? (
                    <div className="zcs-history__state">
                      <LoaderCircle className="zar-spin" size={18} />
                      Loading versions...
                    </div>
                  ) : revisions.length === 0 ? (
                    <div className="zcs-history__state">
                      <Clock3 size={18} />
                      The first published version will appear here.
                    </div>
                  ) : (
                    <div className="zcs-revision-list">
                      {revisions.map((revision) => (
                        <article key={revision.id}>
                          <div>
                            <strong>Version {revision.version}</strong>
                            <span>{formatDate(revision.published_at)}</span>
                            <small>/work/{revision.slug}</small>
                          </div>
                          <button
                            className="zar-secondary-button"
                            type="button"
                            onClick={() => void handleRestoreRevision(revision)}
                            disabled={Boolean(busy)}
                          >
                            {busy === "revision" ? (
                              <LoaderCircle className="zar-spin" size={15} />
                            ) : (
                              <RotateCcw size={15} />
                            )}
                            Restore to draft
                          </button>
                        </article>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </>
          ) : (
            <div className="zcs-empty-pane">
              <FileText size={26} />
              <h2>No page selected</h2>
              <p>Create a private draft from the Pages panel to open the editor.</p>
              <button
                className="zar-primary-button"
                type="button"
                onClick={() => setMobileTab("pages")}
              >
                <Plus size={16} />
                Create a page
              </button>
            </div>
          )}
        </section>

        <section className={paneClass("preview")} aria-label="Private page preview">
          <div className="zcs-pane__heading">
            <div>
              <span>Private preview</span>
              <strong>
                {selected
                  ? hasHtmlBlocks
                    ? "Content updates live / HTML runs on command"
                    : "Updates as you type"
                  : "No page selected"}
              </strong>
            </div>
            <div className="zcs-pane__actions">
              {selected && hasHtmlBlocks ? (
                <button type="button" onClick={handleRunHtmlPreview}>
                  <RefreshCw size={14} />
                  Run HTML
                </button>
              ) : null}
              {publication?.is_active ? (
                <a href={`/work/${publication.slug}`} target="_blank" rel="noopener noreferrer">
                  Live page <ExternalLink size={14} />
                </a>
              ) : null}
            </div>
          </div>
          <div className="zcs-preview-scroll">
            {selected ? (
              <div className="zcs-preview-frame">
                <div className="zcs-preview-frame__bar">
                  <span>
                    <i />
                    <i />
                    <i />
                  </span>
                  <p>zenai.world/work/{normalizeSlug(slug) || "page-address"}</p>
                  <Monitor size={14} />
                </div>
                <div className="zcs-preview-canvas">
                  <SitePageRenderer
                    document={draft}
                    slug={slug}
                    standalone={false}
                    preview
                    htmlPreview={htmlPreview}
                    htmlRunKey={htmlRunKey}
                  />
                </div>
              </div>
            ) : (
              <div className="zcs-empty-pane">
                <Monitor size={26} />
                <h2>Your live draft preview</h2>
                <p>Select or create a page to see its private rendering here.</p>
              </div>
            )}
          </div>
        </section>
      </section>

      <footer className="zcs-footer">
        <span>Only verified ZEN admins can read or change Site Studio content.</span>
        <span>Publishing creates a restorable snapshot; draft edits never change a live page.</span>
      </footer>
    </main>
  );
}
