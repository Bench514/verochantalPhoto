import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import path from "path";

/**
 * Uploaded photos live in Cloudflare R2 (S3-compatible object storage),
 * decoupled from wherever the app itself is hosted. Files are served back
 * out through the /uploads/[...path] route handler, which proxies the R2
 * object rather than exposing the bucket publicly.
 */
function r2Client() {
  return new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

function bucket() {
  return process.env.R2_BUCKET_NAME!;
}

export async function saveUpload(file: File): Promise<string> {
  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  const key = `${crypto.randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await r2Client().send(
    new PutObjectCommand({
      Bucket: bucket(),
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    })
  );
  return key;
}

export async function readUpload(key: string) {
  const result = await r2Client().send(
    new GetObjectCommand({ Bucket: bucket(), Key: key })
  );
  return result.Body?.transformToByteArray();
}

export async function deleteUpload(key: string) {
  try {
    await r2Client().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
  } catch {
    // already gone — fine, DB row is the source of truth for existence
  }
}
