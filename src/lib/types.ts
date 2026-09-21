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
  sizeBytes: number;
  createdAt: string;
  categories: PhotoCategoryEntry[];
};

export const CATEGORY_LABEL: Record<PhotoCategory, string> = {
  PORTRAIT: "Portrait",
  BOUDOIR: "Boudoir",
};

export const ALL_CATEGORIES: PhotoCategory[] = ["PORTRAIT", "BOUDOIR"];

export type SessionStatus = "PENDING" | "SUBMITTED";

export type SessionPhotoDTO = {
  id: string;
  filename: string;
  sizeBytes: number;
  selected: boolean;
};

export type PhotoSessionDTO = {
  id: string;
  title: string;
  status: SessionStatus;
  clientEmail: string;
  hasPassword: boolean;
  submittedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  photoCount: number;
};

export const EXPIRY_PRESETS = [
  { value: "30", label: "30 jours" },
  { value: "90", label: "90 jours" },
  { value: "180", label: "180 jours" },
  { value: "", label: "Aucune expiration" },
] as const;
