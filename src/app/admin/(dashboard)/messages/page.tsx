import { prisma } from "@/lib/db";
import { toggleReadAction, resendNotificationAction } from "./actions";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-[1000px] px-6 py-10">
      <h1 className="text-2xl">Messages reçus</h1>
      {messages.length === 0 ? (
        <p className="mt-4 text-sm text-fg-muted">Aucun message pour le moment.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`rounded-sm bg-bg-alt p-6 ${m.read ? "" : "border border-fg"}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="font-medium">
                  {!m.read && <span className="mr-2 inline-block h-2 w-2 rounded-full bg-fg" />}
                  {m.name} — {m.email}
                </span>
                <span className="text-fg-muted">
                  {m.createdAt.toLocaleDateString("fr-CA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="mt-1 text-[13px] uppercase tracking-[0.06em] text-fg-muted">
                {m.sessionType}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm">{m.message}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <form
                  action={async () => {
                    "use server";
                    await toggleReadAction(m.id, !m.read);
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-sm border border-border px-3 py-1.5 text-xs uppercase tracking-[0.06em] text-fg hover:bg-fg hover:text-bg"
                  >
                    {m.read ? "Marquer non lu" : "Marquer comme lu"}
                  </button>
                </form>
                {!m.notifiedAt && (
                  <form
                    action={async () => {
                      "use server";
                      await resendNotificationAction(m.id);
                    }}
                  >
                    <button
                      type="submit"
                      className="rounded-sm border border-border px-3 py-1.5 text-xs uppercase tracking-[0.06em] text-fg-muted hover:bg-fg hover:text-bg"
                    >
                      Renvoyer la notification
                    </button>
                  </form>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
