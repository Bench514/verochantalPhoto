import { prisma } from "@/lib/db";

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
            <div key={m.id} className="rounded-sm bg-bg-alt p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="font-medium">
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
