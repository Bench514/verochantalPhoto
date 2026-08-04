"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { saveUpload, deleteUpload } from "@/lib/uploads";
import type { PhotoCategory } from "@/lib/types";

const CATEGORIES: PhotoCategory[] = ["PORTRAIT", "BOUDOIR"];

function isCategory(v: FormDataEntryValue | null): v is PhotoCategory {
  return v === "PORTRAIT" || v === "BOUDOIR";
}

export async function uploadPhotoAction(formData: FormData) {
  const file = formData.get("file");
  const category = formData.get("category");
  if (!(file instanceof File) || file.size === 0) throw new Error("Aucun fichier fourni");
  if (!isCategory(category)) throw new Error("Catégorie invalide");

  const filename = await saveUpload(file);
  const last = await prisma.photo.findFirst({
    where: { category },
    orderBy: { order: "desc" },
  });

  await prisma.photo.create({
    data: {
      filename,
      category,
      alt: "",
      order: (last?.order ?? -1) + 1,
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

export async function updateCategoryAction(id: string, category: PhotoCategory) {
  if (!CATEGORIES.includes(category)) throw new Error("Catégorie invalide");
  const last = await prisma.photo.findFirst({
    where: { category },
    orderBy: { order: "desc" },
  });
  await prisma.photo.update({
    where: { id },
    data: { category, order: (last?.order ?? -1) + 1 },
  });
  revalidatePath("/admin/photos");
  revalidatePath("/portfolio");
}

export async function moveAction(id: string, direction: "up" | "down") {
  const current = await prisma.photo.findUniqueOrThrow({ where: { id } });
  const neighbor = await prisma.photo.findFirst({
    where: {
      category: current.category,
      order: direction === "up" ? { lt: current.order } : { gt: current.order },
    },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await prisma.$transaction([
    prisma.photo.update({ where: { id: current.id }, data: { order: neighbor.order } }),
    prisma.photo.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);

  revalidatePath("/admin/photos");
  revalidatePath("/portfolio");
}
