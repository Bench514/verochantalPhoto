import { readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { uploadsPath } from "@/lib/uploads";

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  // basename strips any directory traversal — only a bare filename is ever
  // looked up on disk, regardless of what the URL contains.
  const filename = path.basename(segments.join("/"));
  const ext = path.extname(filename).toLowerCase();
  const mime = MIME_BY_EXT[ext];
  if (!mime) return new NextResponse("Not found", { status: 404 });

  try {
    const data = await readFile(uploadsPath(filename));
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
