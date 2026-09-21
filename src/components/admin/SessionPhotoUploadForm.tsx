"use client";

import { uploadSessionPhotosAction } from "@/app/admin/(dashboard)/sessions/actions";

export default function SessionPhotoUploadForm({ sessionId }: { sessionId: string }) {
  const action = uploadSessionPhotosAction.bind(null, sessionId);

  return (
    <form
      action={action}
      encType="multipart/form-data"
      className="mt-6 flex flex-wrap items-end gap-3 rounded-sm bg-bg-alt p-6"
    >
      <div>
        <label className="mb-1.5 block text-[13px] text-fg-muted" htmlFor="files">
          Photos de la séance
        </label>
        <input
          id="files"
          name="files"
          type="file"
          accept="image/*"
          multiple
          required
          className="text-sm"
        />
      </div>
      <button
        type="submit"
        className="rounded-sm bg-fg px-5 py-2.5 text-[13px] tracking-[0.03em] text-bg hover:opacity-85"
      >
        Ajouter
      </button>
    </form>
  );
}
