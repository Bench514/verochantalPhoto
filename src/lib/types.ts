export type PhotoCategory = "PORTRAIT" | "BOUDOIR";

export type PhotoCategoryEntry = {
  category: PhotoCategory;
  order: number;
};

export type PhotoDTO = {
  id: string;
  filename: string;
  name: string;
  alt: string;
  createdAt: string;
  categories: PhotoCategoryEntry[];
};

export const CATEGORY_LABEL: Record<PhotoCategory, string> = {
  PORTRAIT: "Portrait",
  BOUDOIR: "Boudoir",
};

export const ALL_CATEGORIES: PhotoCategory[] = ["PORTRAIT", "BOUDOIR"];
