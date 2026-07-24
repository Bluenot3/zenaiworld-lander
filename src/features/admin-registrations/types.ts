export type RegistrationStatus = "waitlisted" | "invited" | "enrolled" | "cancelled";

export type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue | undefined };

export type ProgramRegistration = {
  id: string;
  user_id: string;
  program_key: string;
  status: RegistrationStatus;
  email: string | null;
  display_name: string | null;
  phone: string | null;
  organization: string | null;
  role: string | null;
  audience_type: string | null;
  reason: string | null;
  source: string | null;
  referral_code: string | null;
  utm: Record<string, JsonValue>;
  metadata: Record<string, JsonValue>;
  registered_at: string;
  invited_at: string | null;
  enrolled_at: string | null;
  cancelled_at: string | null;
  updated_at: string;
};

export type AdminSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  email: string;
  userId: string;
};

export type RegistrationFilters = {
  search: string;
  program: string;
  status: string;
  dateFrom: string;
  dateTo: string;
};
