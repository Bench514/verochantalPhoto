export function inviteEmailSubject(): string {
  return "Vos photos sont prêtes";
}

export function inviteEmailText(data: {
  clientName: string | null;
  sessionTitle: string;
  link: string;
  expiresAt: Date;
  loginUrl: string;
}): string {
  const greeting = data.clientName ? `Bonjour ${data.clientName},` : "Bonjour,";
  const expires = data.expiresAt.toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `${greeting}

Merci de m'avoir fait confiance pour votre séance « ${data.sessionTitle} ». Ce fut un vrai plaisir, et j'ai hâte que vous découvriez le résultat!

Vos photos sont maintenant disponibles dans votre galerie privée. Voici comment y accéder :

1. Cliquez sur le lien ci-dessous pour créer un mot de passe :
${data.link}

2. Choisissez un mot de passe que vous retiendrez facilement.

3. Vous arriverez ensuite dans votre galerie. Vous pourrez parcourir vos photos, marquer vos favorites et sélectionner celles que vous souhaitez faire retoucher.

Ce lien est personnel et ne peut servir qu'une seule fois. Il expire le ${expires}.

Plus tard, vous pourrez revenir à votre galerie en tout temps en vous connectant avec votre courriel et votre mot de passe ici :
${data.loginUrl}

Si le lien ne fonctionne plus ou si vous avez la moindre question, répondez simplement à ce courriel.

À bientôt,
Véronique Chantal
Photographe`;
}
