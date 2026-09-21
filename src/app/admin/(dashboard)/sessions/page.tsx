import Link from "next/link";
import { prisma } from "@/lib/db";
import NewSessionForm from "@/components/admin/NewSessionForm";

export default async function AdminSessionsPage() {
  const sessions = await prisma.photoSession.findMany({
    include: { client: true, _count: { select: { photos: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl">Séances clients</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Crée une séance, uploade les photos, puis invite le client à se connecter pour faire sa
        sélection.
      </p>

      <NewSessionForm />

      {sessions.length === 0 ? (
        <p className="mt-8 text-sm text-fg-muted">Aucune séance pour l&rsquo;instant.</p>
      ) : (
        <ul className="mt-8 space-y-3">
          {sessions.map((s) => (
            <li key={s.id}>
              <Link
                href={`/admin/sessions/${s.id}`}
                className="flex items-center justify-between rounded-sm border border-border p-4 hover:border-fg"
              >
                <div>
                  <span className="text-sm">{s.title}</span>
                  <span className="ml-2 text-xs text-fg-muted">{s.client.email}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-fg-muted">
                  <span>{s._count.photos} photo(s)</span>
                  <span>{s.status === "SUBMITTED" ? "Soumise" : "En attente"}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
