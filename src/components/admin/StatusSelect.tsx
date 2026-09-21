"use client";

import { useTransition } from "react";
import { updateSessionStatusAction } from "@/app/admin/(dashboard)/sessions/actions";
import { ALL_SESSION_STATUSES, SESSION_STATUS_LABEL, type SessionStatus } from "@/lib/types";

export default function StatusSelect({
  sessionId,
  status,
}: {
  sessionId: string;
  status: SessionStatus;
}) {
  const [pending, startTransition] = useTransition();
  const pale = status === "PENDING";

  return (
    <div>
      <label
        htmlFor="session-status"
        className="mb-1.5 block text-[10px] uppercase tracking-[0.12em] text-fg-muted"
      >
        Statut
      </label>
      <div className="relative">
        <select
          id="session-status"
          value={status}
          disabled={pending}
          onChange={(e) =>
            startTransition(() =>
              updateSessionStatusAction(sessionId, e.target.value as SessionStatus)
            )
          }
          className={`appearance-none rounded-sm border py-2.5 pl-4 pr-9 text-sm disabled:opacity-60 ${
            pale ? "border-border bg-bg text-fg-muted" : "border-fg bg-fg text-bg"
          }`}
        >
          {ALL_SESSION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {SESSION_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <span
          className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs ${
            pale ? "text-fg-muted" : "text-bg"
          }`}
        >
          ▾
        </span>
      </div>
    </div>
  );
}
