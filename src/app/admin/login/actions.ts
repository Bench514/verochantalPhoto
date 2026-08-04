"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession } from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const expectedEmail = (process.env.ADMIN_EMAIL || "").toLowerCase();
  const expectedHash = process.env.ADMIN_PASSWORD_HASH || "";

  if (!expectedEmail || !expectedHash) {
    return { error: "Compte admin non configuré (ADMIN_EMAIL / ADMIN_PASSWORD_HASH manquants)." };
  }

  if (email !== expectedEmail) {
    return { error: "Identifiants invalides." };
  }

  const ok = await bcrypt.compare(password, expectedHash);
  if (!ok) {
    return { error: "Identifiants invalides." };
  }

  await createSession(email);
  redirect("/admin/photos");
}
