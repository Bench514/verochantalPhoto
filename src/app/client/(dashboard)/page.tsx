import Link from "next/link";
import { prisma } from "@/lib/db";
import { getClientUserId } from "@/lib/auth";

export default async function ClientHomePage() {
  const userId = await getClientUserId();

  // Scoped by clientId, not by anything the client could tamper with — this
  // is the isolation boundary: a client only ever sees rows where they are
  // the owner.
  const sessions = userId
    ? await prisma.photoSession.findMany({
        where: { clientId: userId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <div>
      <h1 className="text-2xl">Mes séances</h1>
      {sessions.length === 0 ? (
        <p className="mt-4 text-sm text-fg-muted">Aucune séance pour l&rsquo;instant.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {sessions.map((s) => (
            <li key={s.id}>
              <Link
                href={`/client/${s.id}`}
                className="flex items-center justify-between rounded-sm border border-border p-4 hover:border-fg"
              >
                <span className="text-sm">{s.title}</span>
                <span className="text-xs text-fg-muted">
                  {s.status === "SUBMITTED" ? "Sélection soumise" : "En attente de sélection"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
