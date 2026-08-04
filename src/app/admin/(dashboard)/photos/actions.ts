"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { saveUpload, deleteUpload } from "@/lib/uploads";
import type { PhotoCategory } from "@/lib/types";
import path from "path";

function isCategory(v: unknown): v is PhotoCategory {
  return v === "PORTRAIT" || v === "BOUDOIR";
}

export async function uploadPhotoAction(formData: FormData) {
  const file = formData.get("file");
  const categories = formData.getAll("categories").filter(isCategory);
  if (!(file instanceof File) || file.size === 0) throw new Error("Aucun fichier fourni");
  if (categories.length === 0) throw new Error("Choisir au moins une catégorie");

  const filename = await saveUpload(file);
  const originalName = path.basename(file.name, path.extname(file.name));

  await prisma.photo.create({
    data: {
      filename,
      name: originalName,
      alt: "",
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

  revalidatePath("/admin/photos");
  revalidatePath("/portfolio");
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
    const remaining = await prisma.photoCategoryLink.count({ where: { photoId } });
    if (remaining <= 1) {
      throw new Error("Une photo doit garder au moins une catégorie");
    }
    await prisma.photoCategoryLink.delete({
      where: { photoId_category: { photoId, category } },
    });
  }

  revalidatePath("/admin/photos");
  revalidatePath("/portfolio");
}

export async function moveAction(photoId: string, category: PhotoCategory, direction: "up" | "down") {
  const current = await prisma.photoCategoryLink.findUniqueOrThrow({
    where: { photoId_category: { photoId, category } },
  });
  const neighbor = await prisma.photoCategoryLink.findFirst({
    where: {
      category,
      order: direction === "up" ? { lt: current.order } : { gt: current.order },
    },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await prisma.$transaction([
    prisma.photoCategoryLink.update({ where: { id: current.id }, data: { order: neighbor.order } }),
    prisma.photoCategoryLink.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);

  revalidatePath("/admin/photos");
  revalidatePath("/portfolio");
}
