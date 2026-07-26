import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

import type {
  SiteBlock,
  SiteCodeBlock,
  SiteEmbedBlock,
  SiteHtmlBlock,
  SitePageDocument,
} from "./types";

import "./site-content.css";

const ARSENAL_URL = "https://arsenal.world";

const safeLink = (value: string) => {
  const trimmed = value.trim();
  if (trimmed.startsWith("/")) return trimmed;

  try {
    const url = new URL(trimmed);
    if (["https:", "mailto:", "tel:"].includes(url.protocol)) return url.toString();
  } catch {
    return "";
  }

  return "";
};

const safeMedia = (value: string) => {
  const trimmed = value.trim();
  if (trimmed.startsWith("/") || trimmed.startsWith("data:image/")) return trimmed;

  try {
    const url = new URL(trimmed);
    if (url.protocol === "https:") return url.toString();
  } catch {
    return "";
  }

  return "";
};

const buildSandboxedDocument = (html: string) => {
  const securityPolicy = [
    '<meta http-equiv="Content-Security-Policy"',
    " content=\"default-src 'none'; base-uri 'none'; form-action 'none';",
    " script-src 'unsafe-inline'; style-src 'unsafe-inline';",
    " img-src data: blob:; media-src data: blob:; font-src data:; connect-src 'none'; frame-src 'none'\">",
  ].join("");

  return [
    "<!doctype html>",
    "<html>",
    "<head>",
    securityPolicy,
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    "</head>",
    "<body>",
    html,
    "</body>",
    "</html>",
  ].join("");
};

function CodeBlock({ block }: { block: SiteCodeBlock }) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");

  const copy = async () => {
    const legacyCopy = () => {
      const textarea = document.createElement("textarea");
      textarea.value = block.code;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const succeeded = document.execCommand("copy");
      textarea.remove();
      if (!succeeded) throw new Error("Copy command was rejected.");
    };

    try {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(block.code);
        } catch {
          legacyCopy();
        }
      } else {
        legacyCopy();
      }
      setCopyStatus("copied");
    } catch {
      setCopyStatus("failed");
    }
    window.setTimeout(() => setCopyStatus("idle"), 1_800);
  };

  return (
    <section className="zsp-code-block">
      <div className="zsp-code-block__bar">
        <div>
          <strong>{block.title || "Code"}</strong>
          <span>{block.language || "text"}</span>
        </div>
        <button type="button" onClick={() => void copy()}>
          {copyStatus === "copied" ? <Check size={15} /> : <Copy size={15} />}
          {copyStatus === "copied" ? "Copied" : copyStatus === "failed" ? "Copy failed" : "Copy"}
        </button>
      </div>
      <pre>
        <code>{block.code}</code>
      </pre>
    </section>
  );
}

function EmbedBlock({ block }: { block: SiteEmbedBlock }) {
  const href = safeLink(block.url);
  const canEmbed = block.allowEmbed && href.startsWith("https://");

  return (
    <section className="zsp-interactive-block">
      <div className="zsp-interactive-block__bar">
        <strong>{block.title || "Interactive experience"}</strong>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            Open original <ExternalLink size={14} />
          </a>
        ) : null}
      </div>
      {canEmbed ? (
        <iframe
          src={href}
          title={block.title || "Embedded interactive experience"}
          loading="lazy"
          sandbox="allow-scripts allow-forms allow-popups allow-presentation"
          referrerPolicy="no-referrer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          style={{ height: `${block.height}px` }}
        />
      ) : (
        <div className="zsp-embed-fallback">
          <p>
            {href
              ? "Embedded display is off. Open the experience in its original secure page."
              : "Add a valid HTTPS address to display this experience."}
          </p>
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer">
              Visit experience <ArrowRight size={15} />
            </a>
          ) : null}
        </div>
      )}
    </section>
  );
}

function HtmlBlock({
  block,
  html = block.html,
  runKey = 0,
}: {
  block: SiteHtmlBlock;
  html?: string;
  runKey?: number;
}) {
  return (
    <section className="zsp-interactive-block">
      <div className="zsp-interactive-block__bar">
        <strong>{block.title || "Interactive experience"}</strong>
        <span>Sandboxed HTML</span>
      </div>
      <iframe
        key={`${block.id}-${runKey}`}
        srcDoc={buildSandboxedDocument(html)}
        title={block.title || "Sandboxed HTML experience"}
        loading="lazy"
        sandbox="allow-scripts"
        referrerPolicy="no-referrer"
        style={{ height: `${block.height}px` }}
      />
    </section>
  );
}

function PausedHtmlBlock({ block }: { block: SiteHtmlBlock }) {
  return (
    <section className="zsp-interactive-block">
      <div className="zsp-interactive-block__bar">
        <strong>{block.title || "Interactive experience"}</strong>
        <span>HTML paused</span>
      </div>
      <div className="zsp-html-paused" style={{ minHeight: `${Math.min(block.height, 420)}px` }}>
        <strong>Interactive code is paused in the editor.</strong>
        <p>Use Run HTML above the private preview when you are ready to test this block.</p>
      </div>
    </section>
  );
}

function RenderBlock({
  block,
  htmlPreview,
  htmlRunKey,
}: {
  block: SiteBlock;
  htmlPreview?: Record<string, string>;
  htmlRunKey: number;
}) {
  switch (block.type) {
    case "heading": {
      const Heading = block.level === 3 ? "h3" : "h2";
      return (
        <header className="zsp-section-heading">
          {block.eyebrow ? <p>{block.eyebrow}</p> : null}
          <Heading>{block.text}</Heading>
        </header>
      );
    }
    case "text":
      return (
        <div className="zsp-rich-text">
          {block.body
            .split(/\n{2,}/)
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={`${block.id}-${index}`}>{paragraph}</p>
            ))}
        </div>
      );
    case "image": {
      const src = safeMedia(block.url);
      return src ? (
        <figure className="zsp-image-block">
          <img src={src} alt={block.alt || ""} loading="lazy" />
          {block.caption ? <figcaption>{block.caption}</figcaption> : null}
        </figure>
      ) : null;
    }
    case "video": {
      const src = safeMedia(block.url);
      const poster = safeMedia(block.poster);
      return src ? (
        <figure className="zsp-video-block">
          <video controls preload="metadata" poster={poster || undefined}>
            <source src={src} />
            Your browser cannot play this video.
          </video>
          {block.title ? <figcaption>{block.title}</figcaption> : null}
        </figure>
      ) : null;
    }
    case "embed":
      return <EmbedBlock block={block} />;
    case "html": {
      if (htmlPreview) {
        const previewHtml = htmlPreview[block.id];
        return typeof previewHtml === "string" ? (
          <HtmlBlock block={block} html={previewHtml} runKey={htmlRunKey} />
        ) : (
          <PausedHtmlBlock block={block} />
        );
      }
      return <HtmlBlock block={block} />;
    }
    case "code":
      return <CodeBlock block={block} />;
    case "cta": {
      const href = safeLink(block.href);
      return (
        <section className="zsp-cta-block">
          <div>
            <h2>{block.heading}</h2>
            {block.body ? <p>{block.body}</p> : null}
          </div>
          {href ? (
            <a href={href}>
              {block.label || "Continue"} <ArrowRight size={17} />
            </a>
          ) : null}
        </section>
      );
    }
    case "quote":
      return (
        <figure className="zsp-quote-block">
          <blockquote>{block.quote}</blockquote>
          {block.attribution ? <figcaption>{block.attribution}</figcaption> : null}
        </figure>
      );
    case "divider":
      return <hr className="zsp-divider" />;
  }
}

export function SitePageRenderer({
  document,
  slug,
  publishedAt,
  standalone = true,
  preview = false,
  htmlPreview,
  htmlRunKey = 0,
}: {
  document: SitePageDocument;
  slug?: string;
  publishedAt?: string;
  standalone?: boolean;
  preview?: boolean;
  htmlPreview?: Record<string, string>;
  htmlRunKey?: number;
}) {
  const content = (
    <article
      className={`zsp-page zsp-page--${document.layout}${preview ? " zsp-page--preview" : ""}`}
    >
      <header className="zsp-hero">
        {preview ? <span className="zsp-preview-label">Private draft preview</span> : null}
        <h1>{document.title || "Untitled page"}</h1>
        {document.summary ? <p>{document.summary}</p> : null}
        {publishedAt ? (
          <time dateTime={publishedAt}>
            Published{" "}
            {new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
              new Date(publishedAt),
            )}
          </time>
        ) : null}
      </header>

      <div className="zsp-blocks">
        {document.blocks.length > 0 ? (
          document.blocks.map((block) => (
            <RenderBlock
              block={block}
              htmlPreview={htmlPreview}
              htmlRunKey={htmlRunKey}
              key={block.id}
            />
          ))
        ) : (
          <div className="zsp-empty">
            <p>{preview ? "Add a block to begin this page." : "This page is being prepared."}</p>
          </div>
        )}
      </div>
    </article>
  );

  if (!standalone) return content;

  return (
    <main className="zsp-shell">
      <header className="zsp-topbar">
        <a href="/" className="zsp-brand" aria-label="ZEN AI World home">
          <span aria-hidden="true">Z</span>
          <strong>ZEN AI CO.</strong>
        </a>
        <nav aria-label="Page navigation">
          <a href="/">
            <ArrowLeft size={15} /> ZEN AI World
          </a>
          <a href={ARSENAL_URL}>
            Enter Arsenal <ArrowRight size={15} />
          </a>
        </nav>
      </header>
      {content}
      <footer className="zsp-footer">
        <span>ZEN AI Co.</span>
        {slug ? <span>/work/{slug}</span> : null}
      </footer>
    </main>
  );
}
