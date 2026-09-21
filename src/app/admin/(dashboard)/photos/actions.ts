"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { saveUpload, deleteUpload } from "@/lib/uploads";
import type { PhotoCategory } from "@/lib/types";
import path from "path";

function isCategory(v: unknown): v is PhotoCategory {
  return v === "PORTRAIT" || v === "BOUDOIR";
}

export type UploadPhotoState = { error?: string };

export async function uploadPhotoAction(
  _prev: UploadPhotoState,
  formData: FormData
): Promise<UploadPhotoState> {
  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  // Zero categories is valid — the photo lands in "Sans catégorie" and can
  // be classified afterward from the grid.
  const categories = formData.getAll("categories").filter(isCategory);
  if (files.length === 0) return { error: "Choisissez au moins une photo avant d'ajouter." };

  // Sequential, not Promise.all: each insert's order depends on reading the
  // previous photo's order in the same category, so concurrent inserts
  // would race and could assign duplicate order values.
  for (const file of files) {
    const filename = await saveUpload(file);
    const originalName = path.basename(file.name, path.extname(file.name));

    await prisma.photo.create({
      data: {
        filename,
        name: originalName,
        alt: "",
        sizeBytes: file.size,
        categories: {
          create: await Promise.all(
            categories.map(async (category) => {
              const last = await prisma.photoCategoryLink.findFirst({
                where: { category },
                orderBy: { order: "desc" },
              });
              return { category, order: (last?.order ?? -1) + 1 };
            })
          ),
        },
      },
    });
  }

  revalidatePath("/admin/photos");
  revalidatePath("/portfolio");
  return {};
}

export async function deletePhotoAction(id: string) {
  const photo = await prisma.photo.delete({ where: { id } });
  await deleteUpload(photo.filename);
  revalidatePath("/admin/photos");
  revalidatePath("/portfolio");
}

export async function toggleCategoryAction(
  photoId: string,
  category: PhotoCategory,
  enabled: boolean
) {
  if (!isCategory(category)) throw new Error("Catégorie invalide");

  if (enabled) {
    const last = await prisma.photoCategoryLink.findFirst({
      where: { category },
      orderBy: { order: "desc" },
    });
    await prisma.photoCategoryLink.upsert({
      where: { photoId_category: { photoId, category } },
      create: { photoId, category, order: (last?.order ?? -1) + 1 },
      update: {},
    });
  } else {
    // A photo can end up with zero categories ("Sans catégorie") — it just
    // won't show on any public page until re-classified. Surfacing that
    // state is the point of the "Sans catégorie" tab and stat, not an error.
    await prisma.photoCategoryLink.deleteMany({ where: { photoId, category } });
  }

  revalidatePath("/admin/photos");
  revalidatePath("/portfolio");
}

// Sequential — order assignment reads the previous "last order" each time,
// so concurrent inserts could race and assign duplicate positions.
async function addCategoryToPhotos(photoIds: string[], category: PhotoCategory) {
  for (const photoId of photoIds) {
    const last = await prisma.photoCategoryLink.findFirst({
      where: { category },
      orderBy: { order: "desc" },
    });
    await prisma.photoCategoryLink.upsert({
      where: { photoId_category: { photoId, category } },
      create: { photoId, category, order: (last?.order ?? -1) + 1 },
      update: {},
    });
  }
}

// Adds `category` alongside whatever categories the photos already have.
export async function bulkAddCategoryAction(photoIds: string[], category: PhotoCategory) {
  if (!isCategory(category)) throw new Error("Catégorie invalide");
  if (photoIds.length === 0) return;

  await addCategoryToPhotos(photoIds, category);

  revalidatePath("/admin/photos");
  revalidatePath("/portfolio");
}

// Makes `category` the only category on these photos — removes the other
// one first, so "Portrait seulement" actually declassifies from Boudoir.
export async function bulkSetOnlyCategoryAction(photoIds: string[], category: PhotoCategory) {
  if (!isCategory(category)) throw new Error("Catégorie invalide");
  if (photoIds.length === 0) return;

  const other: PhotoCategory = category === "PORTRAIT" ? "BOUDOIR" : "PORTRAIT";
  await prisma.photoCategoryLink.deleteMany({ where: { photoId: { in: photoIds }, category: other } });
  await addCategoryToPhotos(photoIds, category);

  revalidatePath("/admin/photos");
  revalidatePath("/portfolio");
}

export async function bulkDeletePhotosAction(photoIds: string[]) {
  if (photoIds.length === 0) return;
  const photos = await prisma.photo.findMany({ where: { id: { in: photoIds } } });
  if (photos.length === 0) return;

  await prisma.photo.deleteMany({ where: { id: { in: photos.map((p) => p.id) } } });
  await Promise.all(photos.map((p) => deleteUpload(p.filename)));

  revalidatePath("/admin/photos");
  revalidatePath("/portfolio");
}

// Drag-and-drop reorder: the client sends the full photo id order for one
// category after a drop, and this rewrites every position in one
// transaction — cheaper and less racy than swapping pairs one at a time.
export async function reorderCategoryAction(category: PhotoCategory, orderedPhotoIds: string[]) {
  if (!isCategory(category)) throw new Error("Catégorie invalide");
  if (orderedPhotoIds.length === 0) return;

  await prisma.$transaction(
    orderedPhotoIds.map((photoId, index) =>
      prisma.photoCategoryLink.update({
        where: { photoId_category: { photoId, category } },
        data: { order: index },
      })
    )
  );

  revalidatePath("/admin/photos");
  revalidatePath("/portfolio");
}
