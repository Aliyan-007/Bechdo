"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  createSessionToken,
  getCookieName,
  type UserRole,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function loginAction(email: string, pass: string) {
  const cleanEmail = email.trim().toLowerCase();

  // Environment-aware behavior: demo credentials are disabled in production unless ALLOW_DEMO_CREDENTIALS is explicitly set
  const isProd = process.env.NODE_ENV === "production";
  const allowDemo = process.env.ALLOW_DEMO_CREDENTIALS === "true" || !isProd;

  if (!allowDemo) {
    return {
      success: false,
      error:
        "Demo credentials are disabled in production. Please sign in via authorized Supabase Auth or configured production administrator accounts.",
    };
  }

  let role: UserRole | null = null;
  let name = "RASTA Administrator";

  if (cleanEmail === "admin@rasta.pk" && pass === "admin123") {
    role = "ADMIN";
    name = "Chief Editor & Admin";
  } else if (cleanEmail === "editor@rasta.pk" && pass === "editor123") {
    role = "EDITOR";
    name = "Catalog Editor";
  } else if (cleanEmail === "user@rasta.pk" && pass === "user123") {
    role = "USER";
    name = "Public User";
  }

  if (!role) {
    return {
      success: false,
      error:
        "Invalid email or password. In development mode, try 'admin@rasta.pk' / 'admin123'.",
    };
  }

  const token = createSessionToken({
    id: cleanEmail,
    email: cleanEmail,
    name,
    role,
  });

  const cookieStore = await cookies();
  cookieStore.set(getCookieName(), token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  // Record audit log
  await prisma.auditLog.create({
    data: {
      userId: cleanEmail,
      userEmail: cleanEmail,
      userRole: role,
      action: "ADMIN_LOGIN",
      entity: "Session",
      entityId: cleanEmail,
      newValue: JSON.stringify({
        role,
        name,
        timestamp: new Date().toISOString(),
      }),
    },
  });

  revalidatePath("/admin");
  return { success: true, role, name };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(getCookieName());

  revalidatePath("/admin");
  return { success: true };
}
