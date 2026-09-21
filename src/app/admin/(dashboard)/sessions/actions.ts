"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { saveUpload, deleteUpload } from "@/lib/uploads";
import { createInviteToken } from "@/lib/invite";

export type CreateSessionState = { error?: string };

export async function createSessionAction(
  _prev: CreateSessionState,
  formData: FormData
): Promise<CreateSessionState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const title = String(formData.get("title") || "").trim();
  const expiryDays = String(formData.get("expiryDays") || "");

  if (!email) return { error: "Courriel du client requis." };
  if (!title) return { error: "Titre de la séance requis." };

  const expiresAt = expiryDays
    ? new Date(Date.now() + Number(expiryDays) * 24 * 60 * 60 * 1000)
    : null;

  const client = await prisma.user.upsert({
    where: { email },
    create: { email },
    update: {},
  });

  const session = await prisma.photoSession.create({
    data: { clientId: client.id, title, expiresAt },
  });

  revalidatePath("/admin/sessions");
  redirect(`/admin/sessions/${session.id}`);
}

export type InviteLinkState = { link?: string; error?: string };

export async function generateInviteLinkAction(
  _prev: InviteLinkState,
  formData: FormData
): Promise<InviteLinkState> {
  const sessionId = String(formData.get("sessionId") || "");
  const session = await prisma.photoSession.findUnique({
    where: { id: sessionId },
    include: { client: true },
  });
  if (!session) return { error: "Séance introuvable." };

  // Also used to reset access for an existing client (mot de passe oublié,
  // ou pour renvoyer le lien) — using it overwrites their current password
  // once they open the link, it doesn't require they have none yet.
  const token = await createInviteToken(session.clientId);
  const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";
  return { link: `${baseUrl}/client/set-password/${token}` };
}

export async function uploadSessionPhotosAction(sessionId: string, formData: FormData) {
  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) throw new Error("Aucun fichier fourni");

  // Sequential to keep this predictable and avoid hammering R2 with a burst
  // of concurrent uploads for a large batch.
  for (const file of files) {
    const storageKey = await saveUpload(file);
    await prisma.sessionPhoto.create({
      data: {
        sessionId,
        storageKey,
        filename: file.name,
        sizeBytes: file.size,
      },
    });
  }

  revalidatePath(`/admin/sessions/${sessionId}`);
}

export async function deleteSessionPhotoAction(photoId: string, sessionId: string) {
  const photo = await prisma.sessionPhoto.delete({ where: { id: photoId } });
  await deleteUpload(photo.storageKey);
  revalidatePath(`/admin/sessions/${sessionId}`);
}

export async function deleteSessionAction(sessionId: string) {
  const photos = await prisma.sessionPhoto.findMany({ where: { sessionId } });
  await prisma.photoSession.delete({ where: { id: sessionId } });
  await Promise.all(photos.map((p) => deleteUpload(p.storageKey)));
  revalidatePath("/admin/sessions");
  redirect("/admin/sessions");
}
