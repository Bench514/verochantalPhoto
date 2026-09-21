import { checkInviteToken } from "@/lib/invite";
import SetPasswordForm from "./SetPasswordForm";

export default async function SetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const check = await checkInviteToken(token);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      {check.ok ? (
        <SetPasswordForm token={token} />
      ) : (
        <div className="w-full max-w-sm space-y-2 rounded-sm bg-bg-alt p-9 text-center">
          <h1 className="font-signature text-3xl">Lien invalide</h1>
          <p className="text-sm text-fg-muted">
            {check.reason === "expired"
              ? "Ce lien d'invitation a expiré. Contactez Véronique pour en recevoir un nouveau."
              : check.reason === "used"
                ? "Ce lien d'invitation a déjà été utilisé."
                : "Ce lien d'invitation n'existe pas."}
          </p>
        </div>
      )}
    </div>
  );
}
