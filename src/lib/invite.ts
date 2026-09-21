import { prisma } from "@/lib/db";

const INVITE_TTL_DAYS = 7;

export async function createInviteToken(userId: string) {
  const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000);
  return prisma.inviteToken.create({
    data: { userId, expiresAt },
  });
}

// Most recent invite token that's still usable — lets the UI show whether a
// link is already active before the admin generates a new one.
export async function findActiveInviteToken(userId: string) {
  return prisma.inviteToken.findFirst({
    where: { userId, usedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
}

export type InviteCheck =
  | { ok: true; userId: string }
  | { ok: false; reason: "not_found" | "expired" | "used" };

export async function checkInviteToken(token: string): Promise<InviteCheck> {
  const invite = await prisma.inviteToken.findUnique({ where: { token } });
  if (!invite) return { ok: false, reason: "not_found" };
  if (invite.usedAt) return { ok: false, reason: "used" };
  if (invite.expiresAt < new Date()) return { ok: false, reason: "expired" };
  return { ok: true, userId: invite.userId };
}

export async function consumeInviteToken(token: string) {
  await prisma.inviteToken.update({
    where: { token },
    data: { usedAt: new Date() },
  });
}
