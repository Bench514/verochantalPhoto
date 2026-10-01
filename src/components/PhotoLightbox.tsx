"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "@/components/Logo";
import type { PhotoDTO } from "@/lib/types";

export default function PhotoLightbox({
  photo,
  onClose,
}: {
  photo: PhotoDTO;
  onClose: () => void;
}) {
  // Photo dimensions aren't stored, so the aspect ratio is read from the
  // loaded image. The frame is then sized to fill as much of the viewport as
  // possible (upscaling if needed) while keeping the watermark on the photo.
  const [ratio, setRatio] = useState<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const r = ratio ?? 3 / 2;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Fermer"
        className="absolute right-5 top-5 z-10 text-2xl text-on-dark hover:text-on-dark-muted"
      >
        ✕
      </button>
      <div
        className="relative transition-opacity duration-300"
        style={{
          width: `min(96vw, calc(94dvh * ${r}))`,
          aspectRatio: r,
          opacity: ratio ? 1 : 0,
        }}
        onClick={onClose}
      >
        <Image
          src={`/uploads/${photo.filename}`}
          alt={photo.alt || photo.name}
          fill
          sizes="96vw"
          className="object-contain"
          onLoad={(e) => {
            const img = e.currentTarget;
            if (img.naturalWidth && img.naturalHeight) {
              setRatio(img.naturalWidth / img.naturalHeight);
            }
          }}
        />
        <Logo shape="watermark" className="pointer-events-none absolute bottom-5 right-5" />
      </div>
    </div>
  );
}
