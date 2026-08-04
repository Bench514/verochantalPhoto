export type PhotoCategory = "PORTRAIT" | "BOUDOIR";

export type PhotoDTO = {
  id: string;
  filename: string;
  category: PhotoCategory;
  alt: string;
  order: number;
};

export const CATEGORY_LABEL: Record<PhotoCategory, string> = {
  PORTRAIT: "Portrait",
  BOUDOIR: "Boudoir",
};
