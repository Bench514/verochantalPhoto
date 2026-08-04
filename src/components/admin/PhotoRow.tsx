"use client";

import Image from "next/image";
import { useTransition } from "react";
import { deletePhotoAction, moveAction, updateCategoryAction } from "@/app/admin/(dashboard)/photos/actions";
import { CATEGORY_LABEL, type PhotoDTO } from "@/lib/types";

export default function PhotoRow({
  photo,
  isFirst,
  isLast,
}: {
  photo: PhotoDTO;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-4 border-b border-border py-3">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-bg-alt">
        <Image src={`/uploads/${photo.filename}`} alt="" fill className="object-cover" />
      </div>

      <select
        value={photo.category}
        disabled={pending}
        onChange={(e) =>
          startTransition(() =>
            updateCategoryAction(photo.id, e.target.value as PhotoDTO["category"])
          )
        }
        className="rounded-sm border border-border bg-bg px-2 py-1.5 text-sm"
      >
        {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          disabled={pending || isFirst}
          onClick={() => startTransition(() => moveAction(photo.id, "up"))}
          className="rounded-sm border border-border px-2 py-1 text-xs disabled:opacity-30"
        >
          ↑
        </button>
        <button
          type="button"
          disabled={pending || isLast}
          onClick={() => startTransition(() => moveAction(photo.id, "down"))}
          className="rounded-sm border border-border px-2 py-1 text-xs disabled:opacity-30"
        >
          ↓
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm("Supprimer cette photo ?")) {
              startTransition(() => deletePhotoAction(photo.id));
            }
          }}
          className="rounded-sm border border-border px-2 py-1 text-xs hover:bg-fg hover:text-bg"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
