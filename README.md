# Véronique Chantal Photo

Site vitrine (Next.js) pour une photographe portrait & boudoir : 6 pages publiques,
zone admin pour gérer la banque de photos du portfolio, et un formulaire de contact.

Le dossier `design_handoff_site_photographe/` contient la spec de design d'origine
(prototypes `.dc.html`) — référence visuelle uniquement, pas du code de production.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Prisma + PostgreSQL
- Auth admin: compte unique via variables d'environnement + cookie de session signé (JWT)
- Photos stockées sur Cloudflare R2 (S3-compatible), servies via une route qui proxy le bucket

## Développement local

Nécessite un Postgres accessible (local via Docker, ou une base de dev
Railway/Neon/Supabase) et un bucket R2 (voir `.env.example`).

```bash
npm install
cp .env.example .env   # puis éditer les valeurs (voir ci-dessous)
npx prisma migrate dev # applique les migrations
npm run dev
```

Site public: http://localhost:3000
Admin: http://localhost:3000/admin (identifiants définis dans `.env`)

### Générer le mot de passe admin

```bash
node -e "console.log(require('bcryptjs').hashSync('TON_MOT_DE_PASSE', 10))"
```

Copier le résultat dans `ADMIN_PASSWORD_HASH`. **Dans un fichier `.env` local**,
échapper chaque `$` en `\$` (Next.js interprète `$XXX` comme une référence de
variable dans les fichiers `.env` et corromprait sinon le hash silencieusement).
Ce piège ne s'applique pas aux variables saisies directement dans le dashboard
Railway — copier le hash tel quel là-bas, sans échappement.

## Déploiement sur Railway

1. Créer un projet Railway, connecter ce dépôt GitHub.
2. Ajouter l'**add-on PostgreSQL** de Railway — il fournit `DATABASE_URL`
   automatiquement.
3. Créer un bucket **Cloudflare R2** (compte Cloudflare > R2 > créer un bucket)
   et un jeton API avec accès lecture/écriture sur ce bucket.
4. Variables d'environnement à définir sur Railway (voir `.env.example`) :
   - `DATABASE_URL` (fournie par l'add-on Postgres)
   - `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET` (chaîne aléatoire longue)
   - `CALENDLY_URL`, `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`
   - `RESEND_API_KEY` + `CONTACT_NOTIFICATION_EMAIL` (optionnel, notification email des messages de contact)
5. Railway détecte Next.js automatiquement (Nixpacks). Les migrations Prisma
   (`prisma migrate deploy`) s'appliquent au **démarrage** du serveur (`npm run
   start`), pas pendant le build.
6. Premier déploiement : la base et le bucket sont vides. Se connecter à
   `/admin/photos` et uploader les photos.

## Structure

- `src/app/*` — pages publiques (accueil, portfolio, services, déroulement, bio, contact)
- `src/app/admin/*` — zone admin protégée (photos, messages)
- `src/app/uploads/[...path]/route.ts` — sert les photos depuis le bucket R2
- `prisma/schema.prisma` — modèles `Photo` et `ContactMessage`


***note***
1. Uploader les vraies photos du portfolio via /admin/photos (la base sur le volume est vide au départ — à moins que tu aies lancé npm run db:seed pour reprendre celles du dossier de design).
2. Coordonnées réelles — NEXT_PUBLIC_CONTACT_EMAIL / NEXT_PUBLIC_CONTACT_PHONE sur Railway si tu veux autre chose que le placeholder.
3. Calendly — si Véronique en a un, ajoute CALENDLY_URL sur Railway (sinon les boutons Calendly restent masqués, ce qui est déjà géré proprement).
4. Couleur d'accent — toujours en attente de votre décision.
5. Nom de domaine réel (veroniquechantalphoto.ca) — à connecter dans Settings → Networking si vous en achetez un, au lieu de l'URL *.up.railway.app.
6. Changer le mot de passe admin si celui utilisé pour tester n'est pas le mot de passe définitif de Véronique.