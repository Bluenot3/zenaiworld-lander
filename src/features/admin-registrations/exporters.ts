import type { ProgramRegistration, RegistrationFilters } from "./types";

const safeFilenamePart = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

const dateStamp = () => new Date().toISOString().slice(0, 10);

const exportBaseName = (filters: RegistrationFilters) => {
  const active = [
    filters.program,
    filters.status,
    filters.dateFrom ? `from-${filters.dateFrom}` : "",
    filters.dateTo ? `to-${filters.dateTo}` : "",
    filters.search ? `search-${safeFilenamePart(filters.search)}` : "",
  ].filter(Boolean);

  return `zen-program-registrations${active.length ? `-${active.join("-")}` : ""}-${dateStamp()}`;
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
};

const htmlEscape = (value: unknown) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const formatIso = (value: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
};

const exportRows = (rows: ProgramRegistration[]) =>
  rows.map((row) => ({
    "Registered at": formatIso(row.registered_at),
    Program: row.program_key,
    Status: row.status,
    Name: row.display_name ?? "",
    Email: row.email ?? "",
    Phone: row.phone ?? "",
    Organization: row.organization ?? "",
    Role: row.role ?? "",
    "Audience type": row.audience_type ?? "",
    Source: row.source ?? "",
    "Referral code": row.referral_code ?? "",
    Reason: row.reason ?? "",
    "User ID": row.user_id,
    "Registration ID": row.id,
    "Updated at": formatIso(row.updated_at),
  }));

export const downloadExcelRegistrations = (
  registrations: ProgramRegistration[],
  filters: RegistrationFilters,
) => {
  const rows = exportRows(registrations);
  const headers = Object.keys(
    rows[0] ??
      exportRows([
        {
          id: "",
          user_id: "",
          program_key: "",
          status: "waitlisted",
          email: null,
          display_name: null,
          phone: null,
          organization: null,
          role: null,
          audience_type: null,
          reason: null,
          source: null,
          referral_code: null,
          utm: {},
          metadata: {},
          registered_at: "",
          invited_at: null,
          enrolled_at: null,
          cancelled_at: null,
          updated_at: "",
        },
      ])[0],
  );

  const table = [
    "<table>",
    `<thead><tr>${headers.map((header) => `<th>${htmlEscape(header)}</th>`).join("")}</tr></thead>`,
    "<tbody>",
    ...rows.map(
      (row) =>
        `<tr>${headers
          .map((header) => `<td>${htmlEscape(row[header as keyof typeof row])}</td>`)
          .join("")}</tr>`,
    ),
    "</tbody></table>",
  ].join("");

  const workbook = `<!doctype html><html><head><meta charset="utf-8"><style>table{border-collapse:collapse;font-family:Arial,sans-serif;font-size:10pt}th{background:#0d2730;color:#fff;font-weight:700}th,td{border:1px solid #cbd5e1;padding:6px 8px;text-align:left;white-space:nowrap}</style></head><body>${table}</body></html>`;
  downloadBlob(
    new Blob(["\ufeff", workbook], { type: "application/vnd.ms-excel;charset=utf-8" }),
    `${exportBaseName(filters)}.xls`,
  );
};

const ascii = (value: unknown) =>
  String(value ?? "")
    .normalize("NFKD")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const truncate = (value: unknown, max: number) => {
  const text = ascii(value);
  return text.length <= max ? text : `${text.slice(0, Math.max(0, max - 3))}...`;
};

const pdfEscape = (value: string) =>
  value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");

const filterSummary = (filters: RegistrationFilters) => {
  const parts = [
    filters.program ? `Program: ${filters.program}` : "",
    filters.status ? `Status: ${filters.status}` : "",
    filters.dateFrom ? `From: ${filters.dateFrom}` : "",
    filters.dateTo ? `To: ${filters.dateTo}` : "",
    filters.search ? `Search: ${filters.search}` : "",
  ].filter(Boolean);
  return parts.length ? parts.join(" | ") : "All registrations";
};

const buildPageStream = (
  lines: string[],
  pageNumber: number,
  pageCount: number,
  rowCount: number,
  filters: RegistrationFilters,
) => {
  const commands = [
    "BT",
    "/F1 15 Tf",
    `1 0 0 1 36 576 Tm (${pdfEscape("ZEN AI World - Program Registrations")}) Tj`,
    "/F1 8 Tf",
    `1 0 0 1 36 560 Tm (${pdfEscape(
      truncate(`${filterSummary(filters)} | ${rowCount} record${rowCount === 1 ? "" : "s"}`, 128),
    )}) Tj`,
    "/F1 7 Tf",
    `1 0 0 1 36 544 Tm (${pdfEscape(
      "DATE (UTC)       | PROGRAM     | STATUS     | NAME                 | EMAIL                         | ORGANIZATION          | SOURCE",
    )}) Tj`,
  ];

  lines.forEach((line, index) => {
    commands.push(`1 0 0 1 36 ${528 - index * 16} Tm (${pdfEscape(truncate(line, 148))}) Tj`);
  });

  commands.push(
    "/F1 7 Tf",
    `1 0 0 1 680 22 Tm (${pdfEscape(`Page ${pageNumber} of ${pageCount}`)}) Tj`,
    "ET",
  );

  return commands.join("\n");
};

const buildPdf = (registrations: ProgramRegistration[], filters: RegistrationFilters) => {
  const rows = registrations.map((row) =>
    [
      truncate(formatIso(row.registered_at).replace("T", " ").replace(".000Z", "Z"), 16).padEnd(16),
      truncate(row.program_key, 11).padEnd(11),
      truncate(row.status, 10).padEnd(10),
      truncate(row.display_name ?? "", 20).padEnd(20),
      truncate(row.email ?? "", 29).padEnd(29),
      truncate(row.organization ?? "", 21).padEnd(21),
      truncate(row.source ?? "", 16),
    ].join(" | "),
  );
  const rowsPerPage = 31;
  const pageRows =
    rows.length > 0
      ? Array.from({ length: Math.ceil(rows.length / rowsPerPage) }, (_, index) =>
          rows.slice(index * rowsPerPage, (index + 1) * rowsPerPage),
        )
      : [["No registrations match the selected filters."]];
  const pageCount = pageRows.length;
  const fontObjectNumber = 3 + pageCount * 2;
  const objects: string[] = [];

  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  const pageRefs = pageRows.map((_, index) => `${3 + index * 2} 0 R`).join(" ");
  objects[2] = `<< /Type /Pages /Kids [${pageRefs}] /Count ${pageCount} >>`;

  pageRows.forEach((lines, index) => {
    const pageObjectNumber = 3 + index * 2;
    const contentObjectNumber = pageObjectNumber + 1;
    const stream = buildPageStream(lines, index + 1, pageCount, registrations.length, filters);
    objects[pageObjectNumber] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 792 612] ` +
      `/Resources << /Font << /F1 ${fontObjectNumber} 0 R >> >> ` +
      `/Contents ${contentObjectNumber} 0 R >>`;
    objects[contentObjectNumber] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
  });

  objects[fontObjectNumber] =
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>";

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  for (let index = 1; index < objects.length; index += 1) {
    offsets[index] = pdf.length;
    pdf += `${index} 0 obj\n${objects[index]}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let index = 1; index < objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\n` + `startxref\n${xrefOffset}\n%%EOF`;

  return pdf;
};

export const downloadPdfRegistrations = (
  registrations: ProgramRegistration[],
  filters: RegistrationFilters,
) => {
  const pdf = buildPdf(registrations, filters);
  downloadBlob(new Blob([pdf], { type: "application/pdf" }), `${exportBaseName(filters)}.pdf`);
};
