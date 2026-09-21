"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { toggleSelectionAction } from "@/app/client/(dashboard)/[sessionId]/actions";
import type { SessionPhotoDTO } from "@/lib/types";

export default function SelectablePhoto({
  photo,
  sessionId,
  locked,
}: {
  photo: SessionPhotoDTO;
  sessionId: string;
  locked: boolean;
}) {
  const [selected, setSelected] = useState(photo.selected);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !selected;
    setSelected(next);
    startTransition(async () => {
      try {
        await toggleSelectionAction(sessionId, photo.id, next);
      } catch {
        setSelected(!next);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={locked || pending}
      className={`relative aspect-square overflow-hidden rounded-sm border-2 transition-colors disabled:cursor-default ${
        selected ? "border-fg" : "border-transparent"
      }`}
    >
      <Image
        src={`/session-photos/${photo.id}`}
        alt=""
        fill
        unoptimized
        className="object-cover"
      />
      {selected && (
        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-fg text-xs text-bg">
          ✓
        </span>
      )}
    </button>
  );
}
