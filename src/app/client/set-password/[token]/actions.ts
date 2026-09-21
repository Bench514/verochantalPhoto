"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { createClientSession } from "@/lib/auth";
import { checkInviteToken, consumeInviteToken } from "@/lib/invite";

export type SetPasswordState = { error?: string };

export async function setPasswordAction(
  token: string,
  _prev: SetPasswordState,
  formData: FormData
): Promise<SetPasswordState> {
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caractères." };
  }
  if (password !== confirm) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  const check = await checkInviteToken(token);
  if (!check.ok) {
    return {
      error:
        check.reason === "expired"
          ? "Ce lien d'invitation a expiré. Contactez Véronique pour en recevoir un nouveau."
          : check.reason === "used"
            ? "Ce lien d'invitation a déjà été utilisé."
            : "Lien d'invitation invalide.",
    };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: check.userId },
    data: { passwordHash },
  });
  await consumeInviteToken(token);
  await createClientSession(check.userId);
  redirect("/client");
}
