import type { RichSpan, SimpleBlock } from "@/lib/notion.server";

const colorMap: Record<string, string> = {
  gray: "text-muted-foreground",
  brown: "text-amber-700",
  orange: "text-zen-gold",
  yellow: "text-amber-300",
  green: "text-zen-emerald",
  blue: "text-zen-holo",
  purple: "text-purple-300",
  pink: "text-pink-300",
  red: "text-red-400",
};

function Rich({ spans }: { spans?: RichSpan[] }) {
  if (!spans || spans.length === 0) return null;
  return (
    <>
      {spans.map((s, i) => {
        let node: React.ReactNode = s.text;
        if (s.code)
          node = (
            <code
              key={i}
              className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-zen-holo"
            >
              {s.text}
            </code>
          );
        const cls = [
          s.bold ? "font-semibold text-zen-platinum" : "",
          s.italic ? "italic" : "",
          s.strikethrough ? "line-through opacity-70" : "",
          s.underline ? "underline" : "",
          s.color ? colorMap[s.color] ?? "" : "",
        ]
          .filter(Boolean)
          .join(" ");

        if (s.href) {
          return (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`underline decoration-zen-gold/40 underline-offset-2 transition-colors hover:text-zen-gold ${cls}`}
            >
              {s.code ? node : s.text}
            </a>
          );
        }
        if (s.code) return node;
        if (cls)
          return (
            <span key={i} className={cls}>
              {s.text}
            </span>
          );
        return <span key={i}>{s.text}</span>;
      })}
    </>
  );
}

function Block({ block }: { block: SimpleBlock }) {
  switch (block.type) {
    case "heading_1":
      return (
        <h2 className="mt-10 font-display text-3xl font-semibold text-zen-platinum">
          <Rich spans={block.text} />
        </h2>
      );
    case "heading_2":
      return (
        <h3 className="mt-8 font-display text-2xl font-semibold text-zen-platinum">
          <Rich spans={block.text} />
        </h3>
      );
    case "heading_3":
      return (
        <h4 className="mt-6 text-lg font-semibold text-zen-platinum">
          <Rich spans={block.text} />
        </h4>
      );
    case "paragraph":
      if (!block.text || block.text.length === 0) return <div className="h-3" />;
      return (
        <p className="mt-4 leading-relaxed text-muted-foreground">
          <Rich spans={block.text} />
        </p>
      );
    case "bulleted_list_item":
      return (
        <li className="ml-5 mt-2 list-disc leading-relaxed text-muted-foreground marker:text-zen-gold">
          <Rich spans={block.text} />
          {block.children && <Blocks blocks={block.children} />}
        </li>
      );
    case "numbered_list_item":
      return (
        <li className="ml-5 mt-2 list-decimal leading-relaxed text-muted-foreground marker:text-zen-gold">
          <Rich spans={block.text} />
          {block.children && <Blocks blocks={block.children} />}
        </li>
      );
    case "to_do":
      return (
        <div className="mt-2 flex items-start gap-2 text-muted-foreground">
          <span
            className={`mt-1 flex h-4 w-4 flex-none items-center justify-center rounded border text-[10px] ${
              block.checked
                ? "border-zen-emerald bg-zen-emerald/20 text-zen-emerald"
                : "border-white/20"
            }`}
          >
            {block.checked ? "✓" : ""}
          </span>
          <span className={block.checked ? "line-through opacity-60" : ""}>
            <Rich spans={block.text} />
          </span>
        </div>
      );
    case "toggle":
      return (
        <details className="mt-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
          <summary className="cursor-pointer text-zen-platinum">
            <Rich spans={block.text} />
          </summary>
          {block.children && (
            <div className="mt-2 pl-2">
              <Blocks blocks={block.children} />
            </div>
          )}
        </details>
      );
    case "quote":
      return (
        <blockquote className="mt-4 border-l-2 border-zen-gold/60 pl-4 italic text-muted-foreground">
          <Rich spans={block.text} />
        </blockquote>
      );
    case "callout":
      return (
        <div className="mt-4 flex gap-3 rounded-xl border border-zen-gold/20 bg-zen-gold/[0.06] p-4">
          {block.icon && <span className="text-lg leading-none">{block.icon}</span>}
          <div className="text-muted-foreground">
            <Rich spans={block.text} />
          </div>
        </div>
      );
    case "code":
      return (
        <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-[#05090c] p-4 text-[0.82rem]">
          <div className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground/60">
            {block.language}
          </div>
          <code className="font-mono text-zen-holo/90">
            {(block.text ?? []).map((s) => s.text).join("")}
          </code>
        </pre>
      );
    case "divider":
      return <hr className="my-8 border-white/10" />;
    case "image":
      return (
        <figure className="mt-6">
          {block.url && (
            <img
              src={block.url}
              alt={(block.caption ?? []).map((s) => s.text).join("") || "Wiki image"}
              loading="lazy"
              className="w-full rounded-xl border border-white/10"
            />
          )}
          {block.caption && block.caption.length > 0 && (
            <figcaption className="mt-2 text-center text-xs text-muted-foreground/70">
              <Rich spans={block.caption} />
            </figcaption>
          )}
        </figure>
      );
    case "video":
    case "embed":
    case "bookmark":
      return block.url ? (
        <a
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block truncate rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zen-holo underline-offset-2 hover:underline"
        >
          {block.url}
        </a>
      ) : null;
    case "child_page":
    case "child_database":
      return (
        <a
          href={`/wiki/${block.pageId}`}
          className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-zen-platinum transition-colors hover:border-zen-gold/30"
        >
          <span className="text-zen-gold">{block.type === "child_database" ? "▦" : "▸"}</span>
          <Rich spans={block.text} />
        </a>
      );
    case "column_list":
      return (
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          {block.children?.map((c) => <Block key={c.id} block={c} />)}
        </div>
      );
    case "column":
      return <div>{block.children && <Blocks blocks={block.children} />}</div>;
    case "table":
      return (
        <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <tbody>
              {block.children?.map((row, ri) => (
                <tr key={row.id} className={ri === 0 ? "bg-white/[0.04]" : ""}>
                  {row.children === undefined && (row as SimpleBlock & { cells?: RichSpan[][] }).cells
                    ? null
                    : null}
                  <TableRow row={row} header={ri === 0} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

function TableRow({ row }: { row: SimpleBlock; header: boolean }) {
  // table_row cells are not exposed via our simplified mapper; render text fallback
  return (
    <td className="border-t border-white/10 px-3 py-2 text-muted-foreground">
      <Rich spans={row.text} />
    </td>
  );
}

export function Blocks({ blocks }: { blocks: SimpleBlock[] }) {
  // group consecutive list items into ul/ol for correct semantics
  const out: React.ReactNode[] = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.type === "bulleted_list_item" || b.type === "numbered_list_item") {
      const ordered = b.type === "numbered_list_item";
      const group: SimpleBlock[] = [];
      while (
        i < blocks.length &&
        blocks[i].type === (ordered ? "numbered_list_item" : "bulleted_list_item")
      ) {
        group.push(blocks[i]);
        i += 1;
      }
      const ListTag = ordered ? "ol" : "ul";
      out.push(
        <ListTag key={group[0].id} className="mt-2">
          {group.map((g) => <Block key={g.id} block={g} />)}
        </ListTag>,
      );
      continue;
    }
    out.push(<Block key={b.id} block={b} />);
    i += 1;
  }
  return <>{out}</>;
}
