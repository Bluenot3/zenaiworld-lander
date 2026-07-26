import { ArrowLeft, KeyRound, LoaderCircle, ShieldCheck, ShieldOff } from "lucide-react";
import { useState, type FormEvent } from "react";

import { getAdminConfigState, signInAdmin } from "@/features/admin-registrations/supabaseAdminApi";
import type { AdminSession } from "@/features/admin-registrations/types";

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

export function AdminBrandMark() {
  return (
    <div className="zar-brand-mark" aria-hidden="true">
      <span>Z</span>
    </div>
  );
}

type AdminLoginProps = {
  onAuthenticated: (session: AdminSession) => Promise<void>;
  title?: string;
  description?: string;
  panelTitle?: string;
  panelDescription?: string;
};

export function AdminLogin({
  onAuthenticated,
  title = "Program operations, without the noise.",
  description = "A private operating view for AI Pioneer and Vanguard registrations, access decisions, and exportable enrollment records.",
  panelTitle = "Sign in to registrations",
  panelDescription = "Use the same verified Supabase admin account used by the course platform.",
}: AdminLoginProps) {
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
            <AdminBrandMark />
            <span>ZEN AI CO.</span>
          </div>
          <h1>{title}</h1>
          <p>{description}</p>
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
            <h2>{panelTitle}</h2>
            <span>{panelDescription}</span>
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

export function AdminLoading({ label = "Verifying secure admin session…" }: { label?: string }) {
  return (
    <main className="zar-shell zar-shell--loading">
      <AdminBrandMark />
      <LoaderCircle className="zar-spin" size={24} />
      <p>{label}</p>
    </main>
  );
}
