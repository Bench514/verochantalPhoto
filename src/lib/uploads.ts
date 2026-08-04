import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

/**
 * Uploaded photos live outside `public/` on a directory that on Railway is a
 * mounted persistent volume (survives redeploys). Files are served back out
 * through the /uploads/[...path] route handler rather than Next static
 * serving, since `public/` is baked into the build and isn't writable at
 * runtime in every deploy target.
 */
function uploadsDir() {
  // turbopackIgnore: this path is runtime config (volume mount / local dev
  // folder), not a project source path — tracing it would bundle the whole
  // repo into the server output.
  return path.resolve(/* turbopackIgnore: true */ process.env.UPLOADS_DIR || "./uploads-dev");
}

export function uploadsPath(filename: string) {
  return path.join(/* turbopackIgnore: true */ uploadsDir(), filename);
}

export async function saveUpload(file: File): Promise<string> {
  await mkdir(uploadsDir(), { recursive: true });
  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const filename = `${crypto.randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(uploadsPath(filename), buffer);
  return filename;
}

export async function deleteUpload(filename: string) {
  try {
    await unlink(uploadsPath(filename));
  } catch {
    // already gone — fine, DB row is the source of truth for existence
  }
}
