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

export type SessionStatus = "PENDING" | "GALLERY_SENT" | "SUBMITTED" | "COMPLETED";

export const SESSION_STATUS_LABEL: Record<SessionStatus, string> = {
  PENDING: "En attente",
  GALLERY_SENT: "Galerie envoyée",
  SUBMITTED: "Sélection reçue",
  COMPLETED: "Terminée",
};

export const ALL_SESSION_STATUSES: SessionStatus[] = [
  "PENDING",
  "GALLERY_SENT",
  "SUBMITTED",
  "COMPLETED",
];

// Once the client has confirmed their selection, their edits (selection,
// favorites) are frozen — and the photos backing that selection can no
// longer be deleted, at any later status.
export function isSessionLocked(status: SessionStatus): boolean {
  return status === "SUBMITTED" || status === "COMPLETED";
}

export type SessionPhotoDTO = {
  id: string;
  filename: string;
  sizeBytes: number;
  selected: boolean;
  favorite: boolean;
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
