import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clipboard,
  Download,
  FileSpreadsheet,
  FileText,
  KeyRound,
  LoaderCircle,
  LogOut,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  ShieldOff,
  SlidersHorizontal,
  UserRoundCheck,
  UsersRound,
  X,
} from "lucide-react";
import { useCallback, useDeferredValue, useEffect, useMemo, useState, type FormEvent } from "react";

import {
  AdminApiError,
  clearStoredAdminSession,
  getAdminConfigState,
  grantRegistrationAccess,
  listProgramRegistrations,
  restoreVerifiedAdminSession,
  revokeRegistrationAccess,
  signInAdmin,
  signOutAdmin,
} from "./supabaseAdminApi";
import { downloadExcelRegistrations, downloadPdfRegistrations } from "./exporters";
import type { AdminSession, ProgramRegistration, RegistrationFilters } from "./types";

import "./admin-registrations.css";

const EMPTY_FILTERS: RegistrationFilters = {
  search: "",
  program: "",
  status: "",
  dateFrom: "",
  dateTo: "",
};

const STATUS_OPTIONS = ["waitlisted", "invited", "enrolled", "cancelled"] as const;

const formatProgram = (programKey: string) => {
  if (programKey === "ai-pioneer" || programKey === "pioneer") return "AI Pioneer";
  if (programKey === "vanguard") return "Vanguard";
  return programKey
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const formatDate = (value: string | null, includeTime = false) => {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    ...(includeTime ? { timeStyle: "short" as const } : {}),
  }).format(date);
};

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

const isCoreProgram = (programKey: string) =>
  programKey === "ai-pioneer" || programKey === "vanguard";

const matchesFilters = (
  registration: ProgramRegistration,
  filters: RegistrationFilters,
  deferredSearch: string,
) => {
  if (filters.program && registration.program_key !== filters.program) return false;
  if (filters.status && registration.status !== filters.status) return false;

  if (filters.dateFrom) {
    const from = new Date(`${filters.dateFrom}T00:00:00`);
    if (new Date(registration.registered_at) < from) return false;
  }

  if (filters.dateTo) {
    const to = new Date(`${filters.dateTo}T23:59:59.999`);
    if (new Date(registration.registered_at) > to) return false;
  }

  if (!deferredSearch) return true;

  const haystack = [
    registration.display_name,
    registration.email,
    registration.phone,
    registration.organization,
    registration.role,
    registration.source,
    registration.referral_code,
    registration.user_id,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(deferredSearch);
};

function BrandMark() {
  return (
    <div className="zar-brand-mark" aria-hidden="true">
      <span>Z</span>
    </div>
  );
}

function StatusBadge({ status }: { status: ProgramRegistration["status"] }) {
  return <span className={`zar-status zar-status--${status}`}>{status}</span>;
}

function AdminLogin({
  onAuthenticated,
}: {
  onAuthenticated: (session: AdminSession) => Promise<void>;
}) {
  const config = getAdminConfigState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!config.configured || busy) return;

    setBusy(true);
    setError("");

    try {
      const session = await signInAdmin(email, password);
      setPassword("");
      await onAuthenticated(session);
    } catch (caught) {
      setError(getErrorMessage(caught, "Admin sign-in failed."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="zar-shell zar-shell--login">
      <div className="zar-login-ambient" aria-hidden="true" />
      <section className="zar-login">
        <div className="zar-login__story">
          <a href="/" className="zar-back-link">
            <ArrowLeft size={16} aria-hidden="true" />
            ZEN AI World
          </a>
          <div className="zar-login__identity">
            <BrandMark />
            <span>ZEN AI CO.</span>
          </div>
          <h1>Program operations, without the noise.</h1>
          <p>
            A private operating view for AI Pioneer and Vanguard registrations, access decisions,
            and exportable enrollment records.
          </p>
          <div className="zar-login__assurances">
            <span>
              <ShieldCheck size={16} /> Admin allowlist protected
            </span>
            <span>
              <KeyRound size={16} /> Supabase RLS enforced
            </span>
          </div>
        </div>

        <div className="zar-login__panel">
          <div className="zar-login__panel-heading">
            <p>Owner console</p>
            <h2>Sign in to registrations</h2>
            <span>Use the same verified Supabase admin account used by the course platform.</span>
          </div>

          {!config.configured ? (
            <div className="zar-config-error" role="alert">
              <ShieldOff size={20} aria-hidden="true" />
              <div>
                <strong>Secure data connection is not configured.</strong>
                <p>Missing: {config.missing.join(", ")}</p>
              </div>
            </div>
          ) : null}

          <form className="zar-login__form" onSubmit={handleSubmit}>
            <label>
              <span>Admin email</span>
              <input
                type="email"
                autoComplete="username"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@zenai.world"
                required
                disabled={!config.configured || busy}
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                disabled={!config.configured || busy}
              />
            </label>

            {error ? (
              <div className="zar-inline-error" role="alert">
                {error}
              </div>
            ) : null}

            <button
              className="zar-primary-button"
              type="submit"
              disabled={!config.configured || busy}
            >
              {busy ? <LoaderCircle className="zar-spin" size={18} /> : <ShieldCheck size={18} />}
              {busy ? "Verifying account…" : "Open admin console"}
            </button>
          </form>

          <p className="zar-session-note">
            This console keeps the Supabase session in this browser tab only. It never stores or
            displays passwords, Stripe secrets, or payment card data.
          </p>
        </div>
      </section>
    </main>
  );
}

type ConfirmAction = {
  kind: "grant" | "revoke";
  registration: ProgramRegistration;
};

function ActionDialog({
  action,
  busy,
  onCancel,
  onConfirm,
}: {
  action: ConfirmAction;
  busy: boolean;
  onCancel: () => void;
  onConfirm: (note: string) => Promise<void>;
}) {
  const [note, setNote] = useState("");
  const granting = action.kind === "grant";

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [busy, onCancel]);

  return (
    <div className="zar-dialog-backdrop" role="presentation" onMouseDown={onCancel}>
      <section
        className="zar-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="zar-action-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="zar-icon-button zar-dialog__close" onClick={onCancel} disabled={busy}>
          <X size={17} />
          <span className="zar-sr-only">Close</span>
        </button>
        <div className={`zar-dialog__icon ${granting ? "" : "zar-dialog__icon--danger"}`}>
          {granting ? <ShieldCheck size={23} /> : <ShieldOff size={23} />}
        </div>
        <p className="zar-kicker">Authoritative access change</p>
        <h2 id="zar-action-title">
          {granting ? "Grant full program access?" : "Revoke program access?"}
        </h2>
        <p>
          {action.registration.display_name || action.registration.email || "This registrant"}
          {" · "}
          {formatProgram(action.registration.program_key)}
        </p>
        <label className="zar-dialog__note">
          <span>Admin note (optional)</span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            placeholder={
              granting
                ? "Invoice, partnership, promotion, or other access reason"
                : "Reason for revoking access"
            }
            disabled={busy}
          />
        </label>
        <div className="zar-dialog__actions">
          <button className="zar-secondary-button" onClick={onCancel} disabled={busy}>
            Keep unchanged
          </button>
          <button
            className={granting ? "zar-primary-button" : "zar-danger-button"}
            onClick={() => void onConfirm(note.trim())}
            disabled={busy}
          >
            {busy ? <LoaderCircle className="zar-spin" size={17} /> : null}
            {busy ? "Applying…" : granting ? "Grant access" : "Revoke access"}
          </button>
        </div>
      </section>
    </div>
  );
}

function DetailPanel({
  registration,
  copied,
  onCopy,
  onAction,
  onClose,
}: {
  registration: ProgramRegistration | null;
  copied: boolean;
  onCopy: (value: string) => Promise<void>;
  onAction: (action: ConfirmAction) => void;
  onClose: () => void;
}) {
  if (!registration) {
    return (
      <aside className="zar-detail zar-detail--empty">
        <div className="zar-detail__empty-icon">
          <UsersRound size={24} />
        </div>
        <h2>Select a registrant</h2>
        <p>Open a row to review contact, source, enrollment, and campaign details.</p>
      </aside>
    );
  }

  const canChangeAccess = isCoreProgram(registration.program_key);
  const isEnrolled = registration.status === "enrolled";

  return (
    <aside className="zar-detail" aria-label="Selected registration details">
      <div className="zar-detail__topline">
        <span>Registrant record</span>
        <button className="zar-icon-button" onClick={onClose}>
          <X size={17} />
          <span className="zar-sr-only">Close registrant details</span>
        </button>
      </div>

      <div className="zar-detail__identity">
        <div className="zar-avatar">
          {(registration.display_name || registration.email || "?").charAt(0).toUpperCase()}
        </div>
        <div>
          <h2>{registration.display_name || "Name not provided"}</h2>
          <p>{registration.email || "Email not provided"}</p>
        </div>
      </div>

      <div className="zar-detail__program">
        <div>
          <span>Program</span>
          <strong>{formatProgram(registration.program_key)}</strong>
        </div>
        <StatusBadge status={registration.status} />
      </div>

      <dl className="zar-detail__grid">
        <div>
          <dt>Organization</dt>
          <dd>{registration.organization || "Not provided"}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{registration.role || "Not provided"}</dd>
        </div>
        <div>
          <dt>Audience</dt>
          <dd>{registration.audience_type || "Not provided"}</dd>
        </div>
        <div>
          <dt>Phone</dt>
          <dd>
            {registration.phone ? (
              <a href={`tel:${registration.phone}`}>{registration.phone}</a>
            ) : (
              "Not provided"
            )}
          </dd>
        </div>
        <div>
          <dt>Source</dt>
          <dd>{registration.source || "Direct"}</dd>
        </div>
        <div>
          <dt>Referral</dt>
          <dd>{registration.referral_code || "None"}</dd>
        </div>
        <div>
          <dt>Registered</dt>
          <dd>{formatDate(registration.registered_at, true)}</dd>
        </div>
        <div>
          <dt>Last updated</dt>
          <dd>{formatDate(registration.updated_at, true)}</dd>
        </div>
      </dl>

      {registration.reason ? (
        <div className="zar-detail__reason">
          <span>Registration note</span>
          <p>{registration.reason}</p>
        </div>
      ) : null}

      <div className="zar-detail__identifiers">
        <span>Supabase user ID</span>
        <button onClick={() => void onCopy(registration.user_id)}>
          <code>{registration.user_id}</code>
          {copied ? <Check size={15} /> : <Clipboard size={15} />}
        </button>
      </div>

      <details className="zar-detail__metadata">
        <summary>Campaign and metadata</summary>
        <pre>
          {JSON.stringify({ utm: registration.utm, metadata: registration.metadata }, null, 2)}
        </pre>
      </details>

      <div className="zar-detail__actions">
        {registration.email ? (
          <a
            className="zar-secondary-button"
            href={`mailto:${encodeURIComponent(registration.email)}`}
          >
            <Mail size={16} />
            Email
          </a>
        ) : null}
        {canChangeAccess ? (
          <button
            className={isEnrolled ? "zar-danger-button" : "zar-primary-button"}
            onClick={() =>
              onAction({
                kind: isEnrolled ? "revoke" : "grant",
                registration,
              })
            }
          >
            {isEnrolled ? <ShieldOff size={16} /> : <UserRoundCheck size={16} />}
            {isEnrolled ? "Revoke access" : "Grant access"}
          </button>
        ) : (
          <p className="zar-detail__unsupported">
            Access automation is limited to AI Pioneer and Vanguard.
          </p>
        )}
      </div>
    </aside>
  );
}

export function AdminRegistrationsPage() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [restoring, setRestoring] = useState(true);
  const [registrations, setRegistrations] = useState<ProgramRegistration[]>([]);
  const [truncated, setTruncated] = useState(false);
  const [filters, setFilters] = useState<RegistrationFilters>(EMPTY_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const deferredSearch = useDeferredValue(filters.search.trim().toLowerCase());

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await listProgramRegistrations();
      setRegistrations(result.rows);
      setTruncated(result.truncated);
      setSelectedId((current) =>
        current && result.rows.some((row) => row.id === current) ? current : null,
      );
    } catch (caught) {
      if (caught instanceof AdminApiError && caught.status === 401) {
        clearStoredAdminSession();
        setSession(null);
      }
      setError(getErrorMessage(caught, "Unable to load registrations."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    void restoreVerifiedAdminSession().then(async (restored) => {
      if (!active) return;
      setSession(restored);
      setRestoring(false);
      if (restored) await loadRegistrations();
    });

    return () => {
      active = false;
    };
  }, [loadRegistrations]);

  const programOptions = useMemo(
    () =>
      Array.from(new Set(registrations.map((registration) => registration.program_key)))
        .filter(Boolean)
        .sort((left, right) => formatProgram(left).localeCompare(formatProgram(right))),
    [registrations],
  );

  const filteredRegistrations = useMemo(
    () =>
      registrations.filter((registration) => matchesFilters(registration, filters, deferredSearch)),
    [deferredSearch, filters, registrations],
  );

  const selected = registrations.find((registration) => registration.id === selectedId) ?? null;

  const filteredStats = useMemo(() => {
    let pioneer = 0;
    let vanguard = 0;
    let enrolled = 0;

    for (const registration of filteredRegistrations) {
      if (registration.program_key === "ai-pioneer") pioneer += 1;
      if (registration.program_key === "vanguard") vanguard += 1;
      if (registration.status === "enrolled") enrolled += 1;
    }

    return { pioneer, vanguard, enrolled };
  }, [filteredRegistrations]);

  const handleAuthenticated = async (nextSession: AdminSession) => {
    setSession(nextSession);
    await loadRegistrations();
  };

  const handleSignOut = async () => {
    await signOutAdmin();
    setSession(null);
    setRegistrations([]);
    setSelectedId(null);
    setNotice("");
    setError("");
  };

  const handleCopy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1_600);
  };

  const executeAccessAction = async (note: string) => {
    if (!confirmAction || actionBusy) return;
    setActionBusy(true);
    setError("");

    try {
      if (confirmAction.kind === "grant") {
        await grantRegistrationAccess(confirmAction.registration, note);
        setNotice(`Access granted to ${formatProgram(confirmAction.registration.program_key)}.`);
      } else {
        await revokeRegistrationAccess(confirmAction.registration, note);
        setNotice(`Access revoked for ${formatProgram(confirmAction.registration.program_key)}.`);
      }
      setConfirmAction(null);
      await loadRegistrations();
    } catch (caught) {
      setError(getErrorMessage(caught, "The access change could not be completed."));
    } finally {
      setActionBusy(false);
    }
  };

  if (restoring) {
    return (
      <main className="zar-shell zar-shell--loading">
        <BrandMark />
        <LoaderCircle className="zar-spin" size={24} />
        <p>Verifying secure admin session…</p>
      </main>
    );
  }

  if (!session) {
    return <AdminLogin onAuthenticated={handleAuthenticated} />;
  }

  return (
    <main className="zar-shell">
      <header className="zar-topbar">
        <div className="zar-topbar__brand">
          <BrandMark />
          <div>
            <strong>ZEN AI WORLD</strong>
            <span>Program Operations</span>
          </div>
        </div>
        <div className="zar-topbar__account">
          <span>{session.email}</span>
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

      <section className="zar-heading">
        <div>
          <p className="zar-kicker">Registration command center</p>
          <h1>Every learner, one clear operating view.</h1>
          <p>
            Filter, inspect, export, and administer AI Pioneer and Vanguard access from the same
            protected Supabase records used by the learning platform.
          </p>
        </div>
        <div className="zar-heading__actions">
          <button
            className="zar-secondary-button"
            onClick={() => void loadRegistrations()}
            disabled={loading}
          >
            <RefreshCw className={loading ? "zar-spin" : ""} size={16} />
            Refresh
          </button>
          <div className="zar-export-menu">
            <Download size={16} aria-hidden="true" />
            <span>Export filtered</span>
            <button
              onClick={() => downloadExcelRegistrations(filteredRegistrations, filters)}
              disabled={filteredRegistrations.length === 0}
              title="Download Excel-compatible .xls"
            >
              <FileSpreadsheet size={16} /> Excel
            </button>
            <button
              onClick={() => downloadPdfRegistrations(filteredRegistrations, filters)}
              title="Download PDF"
            >
              <FileText size={16} /> PDF
            </button>
          </div>
        </div>
      </section>

      <section className="zar-stats" aria-label="Filtered registration summary">
        <article>
          <span>Showing</span>
          <strong>{filteredRegistrations.length.toLocaleString()}</strong>
          <small>of {registrations.length.toLocaleString()} records</small>
        </article>
        <article>
          <span>AI Pioneer</span>
          <strong>{filteredStats.pioneer.toLocaleString()}</strong>
          <small>filtered registrations</small>
        </article>
        <article>
          <span>Vanguard</span>
          <strong>{filteredStats.vanguard.toLocaleString()}</strong>
          <small>filtered registrations</small>
        </article>
        <article>
          <span>Enrolled</span>
          <strong>{filteredStats.enrolled.toLocaleString()}</strong>
          <small>active registration status</small>
        </article>
      </section>

      <section className="zar-filters" aria-label="Registration filters">
        <label className="zar-search-field">
          <Search size={17} />
          <span className="zar-sr-only">Search registrations</span>
          <input
            type="search"
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({ ...current, search: event.target.value }))
            }
            placeholder="Search name, email, organization, source, or user ID"
          />
        </label>

        <label>
          <span>Program</span>
          <select
            value={filters.program}
            onChange={(event) =>
              setFilters((current) => ({ ...current, program: event.target.value }))
            }
          >
            <option value="">All programs</option>
            {programOptions.map((program) => (
              <option key={program} value={program}>
                {formatProgram(program)}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Status</span>
          <select
            value={filters.status}
            onChange={(event) =>
              setFilters((current) => ({ ...current, status: event.target.value }))
            }
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>From</span>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(event) =>
              setFilters((current) => ({ ...current, dateFrom: event.target.value }))
            }
          />
        </label>

        <label>
          <span>To</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(event) =>
              setFilters((current) => ({ ...current, dateTo: event.target.value }))
            }
          />
        </label>

        <button
          className="zar-clear-filters"
          onClick={() => setFilters(EMPTY_FILTERS)}
          disabled={Object.values(filters).every((value) => !value)}
        >
          <SlidersHorizontal size={15} />
          Clear
        </button>
      </section>

      {error ? (
        <div className="zar-banner zar-banner--error" role="alert">
          <ShieldOff size={18} />
          <span>{error}</span>
          <button onClick={() => setError("")}>
            <X size={15} />
            <span className="zar-sr-only">Dismiss</span>
          </button>
        </div>
      ) : null}
      {notice ? (
        <div className="zar-banner zar-banner--success" role="status">
          <Check size={18} />
          <span>{notice}</span>
          <button onClick={() => setNotice("")}>
            <X size={15} />
            <span className="zar-sr-only">Dismiss</span>
          </button>
        </div>
      ) : null}
      {truncated ? (
        <div className="zar-banner" role="status">
          <UsersRound size={18} />
          <span>Showing the newest 50,000 records. Narrow filters before exporting.</span>
        </div>
      ) : null}

      <section className="zar-workspace">
        <div className="zar-table-panel">
          <div className="zar-table-panel__heading">
            <div>
              <span>Registration ledger</span>
              <strong>{filteredRegistrations.length.toLocaleString()} matches</strong>
            </div>
            <small>Newest first</small>
          </div>

          <div className="zar-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Registrant</th>
                  <th>Program</th>
                  <th>Status</th>
                  <th>Organization</th>
                  <th>Source</th>
                  <th>Registered</th>
                  <th>
                    <span className="zar-sr-only">Open record</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading && registrations.length === 0 ? (
                  <tr className="zar-table-message">
                    <td colSpan={7}>
                      <LoaderCircle className="zar-spin" size={20} />
                      Loading protected registration records…
                    </td>
                  </tr>
                ) : filteredRegistrations.length === 0 ? (
                  <tr className="zar-table-message">
                    <td colSpan={7}>
                      <Search size={20} />
                      No registrations match these filters.
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((registration) => (
                    <tr
                      key={registration.id}
                      className={registration.id === selectedId ? "zar-row--selected" : ""}
                    >
                      <td>
                        <button
                          className="zar-registrant-button"
                          onClick={() => setSelectedId(registration.id)}
                        >
                          <span className="zar-mini-avatar">
                            {(registration.display_name || registration.email || "?")
                              .charAt(0)
                              .toUpperCase()}
                          </span>
                          <span>
                            <strong>{registration.display_name || "Name not provided"}</strong>
                            <small>{registration.email || registration.user_id}</small>
                          </span>
                        </button>
                      </td>
                      <td>{formatProgram(registration.program_key)}</td>
                      <td>
                        <StatusBadge status={registration.status} />
                      </td>
                      <td>{registration.organization || "—"}</td>
                      <td>{registration.source || "Direct"}</td>
                      <td>{formatDate(registration.registered_at)}</td>
                      <td>
                        <button
                          className="zar-row-open"
                          onClick={() => setSelectedId(registration.id)}
                          aria-label={`Open ${registration.display_name || registration.email || "registration"}`}
                        >
                          <ChevronRight size={17} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <DetailPanel
          registration={selected}
          copied={copied}
          onCopy={handleCopy}
          onAction={setConfirmAction}
          onClose={() => setSelectedId(null)}
        />
      </section>

      <footer className="zar-footer">
        <span>
          <ShieldCheck size={14} /> Reads and actions are authorized by Supabase RLS and admin RPC
          checks.
        </span>
        <span>No card data or authentication secrets are available in this console.</span>
      </footer>

      {confirmAction ? (
        <ActionDialog
          action={confirmAction}
          busy={actionBusy}
          onCancel={() => {
            if (!actionBusy) setConfirmAction(null);
          }}
          onConfirm={executeAccessAction}
        />
      ) : null}
    </main>
  );
}
