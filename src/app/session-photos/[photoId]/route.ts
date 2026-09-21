import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getClientUserId, getSessionEmail } from "@/lib/auth";
import { readUpload } from "@/lib/uploads";

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

// Session photos are never public: every request re-checks that the caller
// is either the admin or the owning client, looked up server-side from the
// photo's own session row — never trusted from the URL or a client claim.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ photoId: string }> }
) {
  const { photoId } = await params;

  const photo = await prisma.sessionPhoto.findUnique({
    where: { id: photoId },
    include: { session: true },
  });
  if (!photo) return new NextResponse("Not found", { status: 404 });

  const [adminEmail, clientUserId] = await Promise.all([getSessionEmail(), getClientUserId()]);
  const isAdmin = !!adminEmail;
  const isOwner = clientUserId === photo.session.clientId;
  if (!isAdmin && !isOwner) return new NextResponse("Not found", { status: 404 });

  const ext = path.extname(photo.filename).toLowerCase();
  const mime = MIME_BY_EXT[ext] || "application/octet-stream";

  try {
    const data = await readUpload(photo.storageKey);
    if (!data) return new NextResponse("Not found", { status: 404 });
    return new NextResponse(Buffer.from(data), {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
