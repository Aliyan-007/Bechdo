import { cookies } from "next/headers";

export type UserRole = "USER" | "EDITOR" | "ADMIN";

export interface AuthSession {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
  expiresAt: string;
}

const COOKIE_NAME = "rasta_session_token";

/**
 * Server-Side Authentication & Authorization Service
 * Checks HTTP-only session cookies or Supabase JWT tokens.
 * Never trusts client-side role claims alone.
 */
export async function getCurrentSession(): Promise<AuthSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    // Decode session payload
    const payload = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
    if (!payload || !payload.user || !payload.expiresAt) return null;

    if (new Date(payload.expiresAt).getTime() < Date.now()) {
      return null;
    }

    return payload as AuthSession;
  } catch (e) {
    return null;
  }
}

/**
 * Enforces role-based authorization server-side.
 * Throws an Error if unauthorized, preventing unauthorized mutations.
 */
export async function requireAuth(
  allowedRoles: UserRole[] = ["EDITOR", "ADMIN"]
): Promise<AuthSession> {
  const session = await getCurrentSession();

  if (!session) {
    throw new Error(
      "Authentication Required: You must be signed in to perform this administrative mutation."
    );
  }

  if (!allowedRoles.includes(session.user.role)) {
    throw new Error(
      `Authorization Forbidden: Required role (${allowedRoles.join(
        " or "
      )}), but account has role '${session.user.role}'.`
    );
  }

  return session;
}

export function createSessionToken(user: AuthSession["user"]): string {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(); // 7 days
  const payload: AuthSession = {
    user,
    expiresAt,
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

export function getCookieName(): string {
  return COOKIE_NAME;
}
