"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { saveUpload, deleteUpload } from "@/lib/uploads";
import { createInviteToken, findActiveInviteToken } from "@/lib/invite";
import { sendEmail } from "@/lib/email";
import { inviteEmailSubject, inviteEmailText } from "@/lib/inviteEmail";
import { APP_BASE_URL, CONTACT_EMAIL } from "@/lib/site";
import { isSessionLocked, type SessionStatus } from "@/lib/types";

export type CreateSessionState = { error?: string };

export async function createSessionAction(
  _prev: CreateSessionState,
  formData: FormData
): Promise<CreateSessionState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const clientName = String(formData.get("clientName") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const expiryDays = String(formData.get("expiryDays") || "");
  const includedCount = Number(formData.get("includedCount") || 15);
  const sessionDateRaw = String(formData.get("sessionDate") || "");

  if (!email) return { error: "Courriel du client requis." };
  if (!clientName) return { error: "Nom du client requis." };
  if (!title) return { error: "Titre de la galerie requis." };

  const expiresAt = expiryDays
    ? new Date(Date.now() + Number(expiryDays) * 24 * 60 * 60 * 1000)
    : null;
  const sessionDate = sessionDateRaw ? new Date(sessionDateRaw) : new Date();

  const client = await prisma.user.upsert({
    where: { email },
    create: { email, name: clientName },
    update: { name: clientName },
  });

  const session = await prisma.photoSession.create({
    data: { clientId: client.id, title, expiresAt, includedCount, sessionDate },
  });

  revalidatePath("/admin/sessions");
  redirect(`/admin/sessions/${session.id}`);
}

export type InviteLinkState = { link?: string; expiresAt?: string; error?: string };

export async function generateInviteLinkAction(
  _prev: InviteLinkState,
  formData: FormData
): Promise<InviteLinkState> {
  const sessionId = String(formData.get("sessionId") || "");
  const session = await prisma.photoSession.findUnique({
    where: { id: sessionId },
    include: { client: true },
  });
  if (!session) return { error: "Galerie introuvable." };

  // Also used to reset access for an existing client (mot de passe oublié,
  // ou pour renvoyer le lien) — using it overwrites their current password
  // once they open the link, it doesn't require they have none yet.
  const invite = await createInviteToken(session.clientId);
  const baseUrl = APP_BASE_URL;
  return {
    link: `${baseUrl}/client/set-password/${invite.token}`,
    expiresAt: invite.expiresAt.toISOString(),
  };
}

export type SendInvitationState = {
  sent?: boolean;
  to?: string;
  link?: string;
  expiresAt?: string;
  error?: string;
};

export async function sendInvitationAction(sessionId: string): Promise<SendInvitationState> {
  const session = await prisma.photoSession.findUnique({
    where: { id: sessionId },
    include: { client: true },
  });
  if (!session) return { error: "Galerie introuvable." };
  if (!session.client.email) return { error: "Aucun courriel au dossier du client." };

  // Reuse the active link if there is one so the link shown in the admin
  // stays the one the client received.
  const invite =
    (await findActiveInviteToken(session.clientId)) ??
    (await createInviteToken(session.clientId));
  const baseUrl = APP_BASE_URL;
  const link = `${baseUrl}/client/set-password/${invite.token}`;

  const ok = await sendEmail({
    to: session.client.email,
    subject: inviteEmailSubject(),
    text: inviteEmailText({
      clientName: session.client.name,
      sessionTitle: session.title,
      link,
      expiresAt: invite.expiresAt,
      loginUrl: `${baseUrl}/client/login`,
    }),
    replyTo: CONTACT_EMAIL,
  });
  if (!ok) {
    return {
      error:
        "L'envoi a échoué. Vérifiez la configuration du courriel (RESEND_API_KEY) ou copiez le lien manuellement.",
    };
  }

  revalidatePath(`/admin/sessions/${sessionId}`);
  return {
    sent: true,
    to: session.client.email,
    link,
    expiresAt: invite.expiresAt.toISOString(),
  };
}

export type UploadSessionPhotosState = { error?: string };

export async function uploadSessionPhotosAction(
  _prev: UploadSessionPhotosState,
  formData: FormData
): Promise<UploadSessionPhotosState> {
  const sessionId = String(formData.get("sessionId") || "");
  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (!sessionId) return { error: "Galerie introuvable." };
  if (files.length === 0) return { error: "Choisissez au moins une photo avant d'ajouter." };

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
  return {};
}

// Once the client has confirmed (or the session is marked done), the photos
// backing that selection can't be deleted from here — otherwise the
// client's confirmed selection would lose its references.
async function requireDeletablePhotos(sessionId: string) {
  const session = await prisma.photoSession.findUnique({ where: { id: sessionId } });
  if (!session) throw new Error("Galerie introuvable.");
  if (isSessionLocked(session.status)) {
    throw new Error("La sélection du client a été reçue — les photos ne peuvent plus être supprimées.");
  }
}

export async function deleteSessionPhotoAction(photoId: string, sessionId: string) {
  await requireDeletablePhotos(sessionId);
  const photo = await prisma.sessionPhoto.delete({ where: { id: photoId } });
  await deleteUpload(photo.storageKey);
  revalidatePath(`/admin/sessions/${sessionId}`);
}

export async function deleteSessionPhotosAction(photoIds: string[], sessionId: string) {
  await requireDeletablePhotos(sessionId);
  const photos = await prisma.sessionPhoto.findMany({
    where: { id: { in: photoIds }, sessionId },
  });
  if (photos.length === 0) return;

  await prisma.sessionPhoto.deleteMany({ where: { id: { in: photos.map((p) => p.id) } } });
  await Promise.all(photos.map((p) => deleteUpload(p.storageKey)));
  revalidatePath(`/admin/sessions/${sessionId}`);
}

export async function setCoverPhotoAction(sessionId: string, photoId: string) {
  const photo = await prisma.sessionPhoto.findUnique({ where: { id: photoId } });
  if (!photo || photo.sessionId !== sessionId) throw new Error("Photo introuvable.");
  await prisma.photoSession.update({ where: { id: sessionId }, data: { coverPhotoId: photoId } });
  revalidatePath(`/admin/sessions/${sessionId}`);
  revalidatePath(`/client/${sessionId}`);
}

export async function updateSessionStatusAction(sessionId: string, status: SessionStatus) {
  await prisma.photoSession.update({ where: { id: sessionId }, data: { status } });
  revalidatePath(`/admin/sessions/${sessionId}`);
  revalidatePath("/admin/sessions");
}

export async function deleteSessionAction(sessionId: string) {
  const photos = await prisma.sessionPhoto.findMany({ where: { sessionId } });
  await prisma.photoSession.delete({ where: { id: sessionId } });
  await Promise.all(photos.map((p) => deleteUpload(p.storageKey)));
  revalidatePath("/admin/sessions");
  redirect("/admin/sessions");
}
