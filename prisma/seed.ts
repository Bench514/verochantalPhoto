/**
 * Seeds the portfolio with the client's real photos from the original
 * design handoff bundle, so the site isn't empty before Véronique starts
 * managing the bank herself from /admin/photos. Safe to re-run: skips
 * entirely if any Photo rows already exist.
 */
import { mkdir, copyFile, readdir } from "fs/promises";
import path from "path";
import { PrismaClient, type PhotoCategory } from "@prisma/client";

const prisma = new PrismaClient();
const SOURCE_ROOT = path.resolve("design_handoff_site_photographe/uploads");
const UPLOADS_DIR = path.resolve(process.env.UPLOADS_DIR || "./uploads-dev");

const FOLDERS: { dir: string; category: PhotoCategory }[] = [
  { dir: "portraits", category: "PORTRAIT" },
  { dir: "boudoir", category: "BOUDOIR" },
];

async function main() {
  const existing = await prisma.photo.count();
  if (existing > 0) {
    console.log(`Skip: ${existing} photo(s) déjà en base.`);
    return;
  }

  await mkdir(UPLOADS_DIR, { recursive: true });

  for (const { dir, category } of FOLDERS) {
    const sourceDir = path.join(SOURCE_ROOT, dir);
    const files = (await readdir(sourceDir)).filter((f) =>
      /\.(jpe?g|png|webp)$/i.test(f)
    );

    for (let i = 0; i < files.length; i++) {
      const src = path.join(sourceDir, files[i]);
      const filename = `${crypto.randomUUID()}${path.extname(files[i]).toLowerCase()}`;
      await copyFile(src, path.join(UPLOADS_DIR, filename));
      await prisma.photo.create({
        data: { filename, category, order: i, alt: "" },
      });
    }
    console.log(`Seeded ${files.length} photo(s) pour ${category}.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
