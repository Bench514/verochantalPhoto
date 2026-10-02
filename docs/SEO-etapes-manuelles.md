# Référencement : étapes manuelles

Guide pas à pas des actions à faire **hors du code** pour que verochantalphotographie.ca soit bien trouvé sur Google, Bing et les réseaux sociaux.

Le site lui-même est déjà prêt : titres et descriptions par page, image d'aperçu, `sitemap.xml`, `robots.txt`, données structurées (schema.org) et région desservie. Il reste à le faire connaître aux moteurs de recherche.

## Informations de référence

À utiliser **exactement pareil** partout (Google, Bing, réseaux sociaux). La cohérence du nom, du site et du courriel aide le référencement local.

| Élément | Valeur |
|---|---|
| Nom de l'entreprise | Véronique Chantal Photographie |
| Site | https://verochantalphotographie.ca |
| Courriel | info@verochantalphotographie.ca |
| Sitemap | https://verochantalphotographie.ca/sitemap.xml |
| Région desservie | Montréal et les environs, Laurentides, Lanaudière |
| Services | Photographie boudoir, photographie portrait |

## Ordre recommandé

- [ ] 1. Google Search Console (environ 20 minutes)
- [ ] 2. Google Business Profile (environ 30 minutes, puis vérification de quelques jours)
- [ ] 3. Bing Webmaster Tools (environ 5 minutes)
- [ ] 4. Rafraîchir les aperçus de liens (environ 2 minutes)
- [ ] 5. Redirection www (environ 10 minutes)
- [ ] 6. Liens depuis les réseaux sociaux
- [ ] 7. Expéditeur des courriels automatiques (Resend)

---

## 1. Google Search Console

**À quoi ça sert :** dire à Google que le site existe, lui donner la liste des pages, et suivre ensuite les recherches qui mènent au site.

**Adresse :** https://search.google.com/search-console

### Étapes

1. Se connecter avec le compte Google qui gérera le site (idéalement celui de Véro, ou un compte partagé de l'entreprise).
2. Cliquer **Ajouter une propriété**.
3. Choisir le type **Domaine** (colonne de gauche), pas « Préfixe d'URL ».
4. Entrer `verochantalphotographie.ca` (sans `https://` ni `www`), puis **Continuer**.
5. Google affiche un **enregistrement TXT** qui ressemble à `google-site-verification=abc123...`. Le copier.
6. Dans un autre onglet, se connecter chez le **registraire** où le domaine a été acheté (GoDaddy, Namecheap, OVH, etc.), puis ouvrir la gestion DNS du domaine.
7. Ajouter un nouvel enregistrement :
   - Type : `TXT`
   - Nom / Hôte : `@` (ou laisser vide, selon le registraire)
   - Valeur : le texte copié à l'étape 5
   - TTL : valeur par défaut
8. Enregistrer, revenir dans Search Console et cliquer **Valider**. Si ça échoue, attendre de 15 minutes à quelques heures (le temps que le DNS se propage), puis réessayer.

### Soumettre le sitemap

1. Dans le menu de gauche, ouvrir **Sitemaps**.
2. Dans « Ajouter un sitemap », entrer `sitemap.xml` (l'adresse complète est `https://verochantalphotographie.ca/sitemap.xml`).
3. Cliquer **Envoyer**. Le statut doit passer à « Opération effectuée » (parfois après quelques heures).

### Demander l'indexation de l'accueil

1. Dans la barre du haut (**Inspection de l'URL**), coller `https://verochantalphotographie.ca`.
2. Cliquer **Demander l'indexation**.
3. Optionnel : refaire la même chose pour `/services`, `/portfolio` et `/contact`.

### Ensuite

- L'apparition dans Google prend de **quelques jours à quelques semaines**.
- Revenir de temps en temps dans **Performances** pour voir les recherches qui mènent au site, et dans **Pages** pour vérifier que les 6 pages publiques sont indexées.

---

## 2. Google Business Profile

**À quoi ça sert :** créer la fiche qui apparaît dans **Google Maps** et à droite des résultats de recherche. Pour une recherche comme « photographe boudoir Laurentides », c'est souvent elle qui apparaît en premier, avant les sites web. C'est l'action la plus importante pour le référencement local.

**Adresse :** https://business.google.com

### Étapes

1. Se connecter avec un compte Google (de préférence le même que pour Search Console).
2. Cliquer **Ajouter votre entreprise** (ou **Gérer maintenant**).
3. **Nom de l'entreprise :** `Véronique Chantal Photographie`.
4. **Catégorie principale :** commencer à taper « Photographe » et choisir **Photographe**. On peut ajouter **Photographe portraitiste** comme catégorie secondaire plus tard.
5. **Emplacement que les clients peuvent visiter ?** Répondre **Non**. Les séances se font à domicile, et cette réponse garde l'adresse de Véro privée.
6. **Zones desservies :** ajouter Montréal, les Laurentides et Lanaudière (taper chaque nom et choisir la suggestion de Google).
7. **Coordonnées :** ajouter le site `https://verochantalphotographie.ca`. Le téléphone est facultatif.
8. **Vérification :** Google propose une méthode (vidéo de l'espace de travail, carte postale, téléphone ou courriel selon le cas). Suivre les instructions. Ça peut prendre **quelques jours**, et la fiche n'est pas visible avant la vérification.

### Une fois la fiche vérifiée

- **Description :** reprendre le ton du site, par exemple : « Photographe boudoir et portrait à Montréal, dans les Laurentides et Lanaudière. Des séances en douceur, à domicile, pour se voir autrement : lumière naturelle et images sans artifice. »
- **Services :** ajouter les forfaits (Oser, S'affirmer, Briller, Rayonner) avec leurs prix de départ.
- **Photos :** ajouter le logo (le carré VC), une photo de couverture et une dizaine de photos du portfolio. Les fiches avec photos reçoivent beaucoup plus de clics.
- **Avis :** dans la fiche, utiliser **Demander des avis** pour obtenir un lien à envoyer aux clientes satisfaites. Le nombre et la qualité des avis comptent beaucoup dans le classement local.
- **Publications :** de temps en temps, publier une photo ou une nouvelle (disponibilités, promotion). Une fiche active est mieux classée.

---

## 3. Bing Webmaster Tools

**À quoi ça sert :** référencer le site sur Bing, et du même coup sur DuckDuckGo, Yahoo et la recherche de ChatGPT, qui utilisent les données de Bing.

**Adresse :** https://www.bing.com/webmasters

### Étapes

1. Se connecter (un compte Google fonctionne).
2. Choisir **Importer depuis Google Search Console** et autoriser l'accès. Le site, sa vérification et le sitemap sont repris automatiquement.
3. C'est tout. (Faire l'étape 1 d'abord, sinon il n'y a rien à importer.)

---

## 4. Rafraîchir les aperçus de liens

**À quoi ça sert :** les applications gardent en mémoire l'ancien aperçu du site (celui avec la photo de Véro). Cette étape force la mise à jour avec la nouvelle image (logo blanc sur fond noir).

### Facebook et Messenger

1. Aller sur https://developers.facebook.com/tools/debug (se connecter avec un compte Facebook).
2. Coller `https://verochantalphotographie.ca` et cliquer **Déboguer**.
3. Cliquer **Récupérer à nouveau** (« Scrape Again »). La nouvelle image et le nouveau titre doivent apparaître.

### LinkedIn

1. Aller sur https://www.linkedin.com/post-inspector
2. Coller l'adresse du site et cliquer **Inspect**.

### iMessage, WhatsApp et autres

Il n'y a pas d'outil : l'ancien aperçu expire tout seul, généralement en quelques jours. Les nouveaux envois du lien affichent rapidement le nouvel aperçu.

---

## 5. Redirection www

**À quoi ça sert :** s'assurer que le site n'existe qu'à une seule adresse. Si `www.verochantalphotographie.ca` et `verochantalphotographie.ca` affichent tous les deux le site sans redirection, Google peut le voir comme un doublon.

### Vérifier

1. Ouvrir `https://www.verochantalphotographie.ca` dans un navigateur.
2. Résultats possibles :
   - L'adresse se transforme en `https://verochantalphotographie.ca` : **tout est bon**, rien à faire.
   - Le site s'affiche mais l'adresse garde le `www` : il faut ajouter une redirection (ci-dessous).
   - Erreur, page introuvable : rien de grave pour le référencement, mais une redirection reste plus pratique pour les visiteurs qui tapent le `www`.

### Corriger

La redirection se configure chez le **registraire** du domaine, souvent dans une section « Redirection » ou « Transfert de domaine » : rediriger `www.verochantalphotographie.ca` vers `https://verochantalphotographie.ca` en **redirection permanente (301)**.

---

## 6. Liens depuis les réseaux sociaux

**À quoi ça sert :** les liens qui pointent vers le site renforcent sa crédibilité aux yeux de Google.

- **Instagram :** mettre `https://verochantalphotographie.ca` dans le champ « Site web » du profil.
- **Facebook :** l'ajouter dans la section « À propos » de la page.
- **Autres :** annuaires de photographes, partenaires (maquilleuses, coiffeuses, boutiques de lingerie) qui accepteraient de mettre un lien, etc.

---

## 7. Expéditeur des courriels automatiques (Resend)

**À quoi ça sert :** aujourd'hui, les courriels envoyés par le site (notification d'un nouveau message de contact, confirmation à la cliente) partent de l'adresse de test `onboarding@resend.dev`. Pour qu'ils partent de `info@verochantalphotographie.ca` (plus professionnel, et moins souvent classé en indésirables), il faut vérifier le domaine dans Resend.

**Adresse :** https://resend.com/domains

### Étapes

1. Se connecter au compte Resend utilisé par le site (celui de la clé `RESEND_API_KEY` sur Railway).
2. Cliquer **Add Domain** et entrer `verochantalphotographie.ca`.
3. Resend affiche quelques enregistrements DNS (généralement des `TXT` et un `MX`). Les ajouter un par un chez le registraire, comme à l'étape 1 de Search Console.
4. Revenir dans Resend et cliquer **Verify DNS Records**. Le statut doit passer à « Verified » (parfois après quelques heures).
5. **Ensuite seulement**, demander la modification du code pour changer l'expéditeur des courriels. Ne pas le faire avant la vérification : l'envoi échouerait.

---

## Outils de vérification utiles

- **Données structurées du site :** https://validator.schema.org (coller l'adresse du site). La fiche « ProfessionalService » doit apparaître sans erreur.
- **Aperçu mobile et vitesse :** https://pagespeed.web.dev (coller l'adresse du site).
- **Sitemap :** https://verochantalphotographie.ca/sitemap.xml doit lister les 6 pages publiques.
- **Robots :** https://verochantalphotographie.ca/robots.txt doit bloquer `/admin`, `/client` et `/session-photos`.
