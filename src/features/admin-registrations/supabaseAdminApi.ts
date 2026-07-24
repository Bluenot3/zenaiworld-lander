import type { AdminSession, JsonValue, ProgramRegistration } from "./types";

const SESSION_STORAGE_KEY = "zen.admin.registrations.session.v1";
const PAGE_SIZE = 1_000;
const MAX_ROWS = 50_000;

type SupabaseAuthResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  user?: {
    id?: string;
    email?: string;
  };
  error?: string;
  error_description?: string;
  msg?: string;
  message?: string;
};

type ApiErrorPayload = {
  code?: string;
  message?: string;
  msg?: string;
  error?: string;
  error_description?: string;
  details?: string;
  hint?: string;
};

export class AdminApiError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.code = code;
  }
}

const getConfig = () => {
  const url = String(import.meta.env.VITE_SUPABASE_URL ?? "").replace(/\/+$/, "");
  const publishableKey = String(
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? import.meta.env.VITE_SUPABASE_ANON_KEY ?? "",
  );

  return { url, publishableKey };
};

export const getAdminConfigState = () => {
  const config = getConfig();
  const missing: string[] = [];

  if (!config.url) missing.push("VITE_SUPABASE_URL");
  if (!config.publishableKey) {
    missing.push("VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY");
  }

  return { configured: missing.length === 0, missing };
};

const parsePayload = async <T>(response: Response): Promise<T> => {
  const raw = await response.text();
  if (!raw) return undefined as T;

  try {
    return JSON.parse(raw) as T;
  } catch {
    throw new AdminApiError("The data service returned an unreadable response.", response.status);
  }
};

const errorMessage = (payload: ApiErrorPayload | null, fallback: string) =>
  payload?.message ?? payload?.msg ?? payload?.error_description ?? payload?.error ?? fallback;

const requestJson = async <T>(url: string, init: RequestInit, fallback: string) => {
  let response: Response;

  try {
    response = await fetch(url, { ...init, cache: "no-store" });
  } catch {
    throw new AdminApiError(
      "Unable to reach the secure data service. Check your connection and try again.",
      0,
    );
  }

  if (!response.ok) {
    const payload = await parsePayload<ApiErrorPayload | null>(response).catch(() => null);
    throw new AdminApiError(errorMessage(payload, fallback), response.status, payload?.code);
  }

  return { data: await parsePayload<T>(response), response };
};

const toSession = (payload: SupabaseAuthResponse): AdminSession => {
  if (!payload.access_token || !payload.refresh_token || !payload.user?.id || !payload.user.email) {
    throw new AdminApiError("Supabase returned an incomplete authentication session.", 500);
  }

  const expiresAt =
    typeof payload.expires_at === "number"
      ? payload.expires_at * 1_000
      : Date.now() + Math.max(60, payload.expires_in ?? 3_600) * 1_000;

  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    expiresAt,
    email: payload.user.email,
    userId: payload.user.id,
  };
};

export const loadStoredAdminSession = (): AdminSession | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as Partial<AdminSession>;

    if (
      typeof session.accessToken !== "string" ||
      typeof session.refreshToken !== "string" ||
      typeof session.expiresAt !== "number" ||
      typeof session.email !== "string" ||
      typeof session.userId !== "string"
    ) {
      clearStoredAdminSession();
      return null;
    }

    return session as AdminSession;
  } catch {
    clearStoredAdminSession();
    return null;
  }
};

const saveAdminSession = (session: AdminSession) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const clearStoredAdminSession = () => {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
};

const authHeaders = (publishableKey: string) => ({
  apikey: publishableKey,
  "content-type": "application/json",
});

const dataHeaders = (publishableKey: string, accessToken: string) => ({
  apikey: publishableKey,
  Authorization: `Bearer ${accessToken}`,
  "content-type": "application/json",
});

const refreshSession = async (refreshToken: string) => {
  const { url, publishableKey } = getConfig();
  const { data } = await requestJson<SupabaseAuthResponse>(
    `${url}/auth/v1/token?grant_type=refresh_token`,
    {
      method: "POST",
      headers: authHeaders(publishableKey),
      body: JSON.stringify({ refresh_token: refreshToken }),
    },
    "The admin session could not be refreshed.",
  );

  const session = toSession(data);
  saveAdminSession(session);
  return session;
};

export const getValidAdminSession = async () => {
  const session = loadStoredAdminSession();
  if (!session) {
    throw new AdminApiError("Your admin session has ended. Sign in again.", 401);
  }

  if (session.expiresAt > Date.now() + 30_000) return session;

  try {
    return await refreshSession(session.refreshToken);
  } catch (error) {
    clearStoredAdminSession();
    throw error;
  }
};

const verifyAdmin = async (session: AdminSession) => {
  const { url, publishableKey } = getConfig();
  const { data } = await requestJson<boolean | { is_zen_admin?: boolean }>(
    `${url}/rest/v1/rpc/is_zen_admin`,
    {
      method: "POST",
      headers: dataHeaders(publishableKey, session.accessToken),
      body: "{}",
    },
    "Unable to verify administrator access.",
  );

  return data === true || (typeof data === "object" && data?.is_zen_admin === true);
};

export const restoreVerifiedAdminSession = async () => {
  try {
    const session = await getValidAdminSession();
    if (!(await verifyAdmin(session))) {
      clearStoredAdminSession();
      return null;
    }
    return session;
  } catch {
    clearStoredAdminSession();
    return null;
  }
};

export const signInAdmin = async (email: string, password: string) => {
  const { url, publishableKey } = getConfig();
  if (!url || !publishableKey) {
    throw new AdminApiError("Supabase environment variables are not configured.", 500);
  }

  const { data } = await requestJson<SupabaseAuthResponse>(
    `${url}/auth/v1/token?grant_type=password`,
    {
      method: "POST",
      headers: authHeaders(publishableKey),
      body: JSON.stringify({ email: email.trim(), password }),
    },
    "The email or password was not accepted.",
  );

  const session = toSession(data);
  const isAdmin = await verifyAdmin(session);

  if (!isAdmin) {
    throw new AdminApiError(
      "This account is signed in but is not authorized for the ZEN admin console.",
      403,
    );
  }

  saveAdminSession(session);
  return session;
};

export const signOutAdmin = async () => {
  const session = loadStoredAdminSession();
  const { url, publishableKey } = getConfig();

  clearStoredAdminSession();

  if (!session || !url || !publishableKey) return;

  await fetch(`${url}/auth/v1/logout?scope=local`, {
    method: "POST",
    cache: "no-store",
    headers: dataHeaders(publishableKey, session.accessToken),
  }).catch(() => undefined);
};

const normalizeObject = (value: unknown): Record<string, JsonValue> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, JsonValue>)
    : {};

const normalizeRegistration = (row: Partial<ProgramRegistration>): ProgramRegistration => ({
  id: String(row.id ?? ""),
  user_id: String(row.user_id ?? ""),
  program_key: String(row.program_key ?? ""),
  status: row.status ?? "waitlisted",
  email: row.email ? String(row.email) : null,
  display_name: row.display_name ? String(row.display_name) : null,
  phone: row.phone ? String(row.phone) : null,
  organization: row.organization ? String(row.organization) : null,
  role: row.role ? String(row.role) : null,
  audience_type: row.audience_type ? String(row.audience_type) : null,
  reason: row.reason ? String(row.reason) : null,
  source: row.source ? String(row.source) : null,
  referral_code: row.referral_code ? String(row.referral_code) : null,
  utm: normalizeObject(row.utm),
  metadata: normalizeObject(row.metadata),
  registered_at: String(row.registered_at ?? row.updated_at ?? ""),
  invited_at: row.invited_at ? String(row.invited_at) : null,
  enrolled_at: row.enrolled_at ? String(row.enrolled_at) : null,
  cancelled_at: row.cancelled_at ? String(row.cancelled_at) : null,
  updated_at: String(row.updated_at ?? row.registered_at ?? ""),
});

const REGISTRATION_COLUMNS = [
  "id",
  "user_id",
  "program_key",
  "status",
  "email",
  "display_name",
  "phone",
  "organization",
  "role",
  "audience_type",
  "reason",
  "source",
  "referral_code",
  "utm",
  "metadata",
  "registered_at",
  "invited_at",
  "enrolled_at",
  "cancelled_at",
  "updated_at",
].join(",");

export const listProgramRegistrations = async () => {
  const { url, publishableKey } = getConfig();
  const session = await getValidAdminSession();
  const isAdmin = await verifyAdmin(session);

  if (!isAdmin) {
    clearStoredAdminSession();
    throw new AdminApiError("This account is no longer authorized for the ZEN admin console.", 403);
  }

  const rows: ProgramRegistration[] = [];

  for (let offset = 0; offset < MAX_ROWS; offset += PAGE_SIZE) {
    const params = new URLSearchParams({
      select: REGISTRATION_COLUMNS,
      order: "registered_at.desc",
      limit: String(PAGE_SIZE),
      offset: String(offset),
    });
    const { data } = await requestJson<Partial<ProgramRegistration>[]>(
      `${url}/rest/v1/program_registrations?${params.toString()}`,
      {
        method: "GET",
        headers: dataHeaders(publishableKey, session.accessToken),
      },
      "Unable to load program registrations.",
    );

    const page = Array.isArray(data) ? data.map(normalizeRegistration) : [];
    rows.push(...page);
    if (page.length < PAGE_SIZE) {
      return { rows, truncated: false };
    }
  }

  return { rows, truncated: true };
};

const callAdminRpc = async (
  rpc: "grant_program_access" | "revoke_program_access",
  body: Record<string, unknown>,
) => {
  const { url, publishableKey } = getConfig();
  const session = await getValidAdminSession();

  await requestJson<unknown>(
    `${url}/rest/v1/rpc/${rpc}`,
    {
      method: "POST",
      headers: dataHeaders(publishableKey, session.accessToken),
      body: JSON.stringify(body),
    },
    rpc === "grant_program_access"
      ? "Unable to grant program access."
      : "Unable to revoke program access.",
  );
};

const updateRegistration = async (
  id: string,
  changes: Partial<
    Pick<
      ProgramRegistration,
      "status" | "invited_at" | "enrolled_at" | "cancelled_at" | "updated_at"
    >
  >,
) => {
  const { url, publishableKey } = getConfig();
  const session = await getValidAdminSession();
  const params = new URLSearchParams({ id: `eq.${id}` });

  await requestJson<unknown>(
    `${url}/rest/v1/program_registrations?${params.toString()}`,
    {
      method: "PATCH",
      headers: {
        ...dataHeaders(publishableKey, session.accessToken),
        Prefer: "return=minimal",
      },
      body: JSON.stringify(changes),
    },
    "Access changed, but the registration status could not be synchronized.",
  );
};

const entitlementProgramKey = (registrationProgramKey: string) =>
  registrationProgramKey === "ai-pioneer" ? "pioneer" : registrationProgramKey;

export const grantRegistrationAccess = async (registration: ProgramRegistration, note: string) => {
  const now = new Date().toISOString();
  await callAdminRpc("grant_program_access", {
    _user_id: registration.user_id,
    _program_key: entitlementProgramKey(registration.program_key),
    _source: "zenaiworld-admin",
    _access_ends_at: null,
    _note: note || "Access granted in ZEN AI World registration admin",
  });
  await updateRegistration(registration.id, {
    status: "enrolled",
    enrolled_at: now,
    cancelled_at: null,
    updated_at: now,
  });
};

export const revokeRegistrationAccess = async (registration: ProgramRegistration, note: string) => {
  const now = new Date().toISOString();
  await callAdminRpc("revoke_program_access", {
    _user_id: registration.user_id,
    _program_key: entitlementProgramKey(registration.program_key),
    _note: note || "Access revoked in ZEN AI World registration admin",
  });
  await updateRegistration(registration.id, {
    status: "cancelled",
    cancelled_at: now,
    updated_at: now,
  });
};
