import { prisma } from "@/lib/db";

const INVITE_TTL_DAYS = 7;

export async function createInviteToken(userId: string) {
  const expiresAt = new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000);
  const invite = await prisma.inviteToken.create({
    data: { userId, expiresAt },
  });
  return invite.token;
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
