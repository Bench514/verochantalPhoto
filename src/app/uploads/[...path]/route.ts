import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { readUpload } from "@/lib/uploads";

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
  // basename strips any directory traversal — only a bare object key is ever
  // looked up in R2, regardless of what the URL contains.
  const key = path.basename(segments.join("/"));
  const ext = path.extname(key).toLowerCase();
  const mime = MIME_BY_EXT[ext];
  if (!mime) return new NextResponse("Not found", { status: 404 });

  try {
    const data = await readUpload(key);
    if (!data) return new NextResponse("Not found", { status: 404 });
    return new NextResponse(Buffer.from(data), {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
