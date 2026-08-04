"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { PhotoDTO } from "@/lib/types";

export default function PhotoLightbox({
  photo,
  onClose,
}: {
  photo: PhotoDTO;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="absolute right-5 top-5 text-2xl text-on-dark hover:text-on-dark-muted"
      >
        ✕
      </button>
      <Image
        src={`/uploads/${photo.filename}`}
        alt={photo.alt || photo.name}
        width={0}
        height={0}
        sizes="90vw"
        onClick={onClose}
        style={{ width: "auto", height: "auto", maxWidth: "90vw", maxHeight: "90vh" }}
      />
    </div>
  );
}
