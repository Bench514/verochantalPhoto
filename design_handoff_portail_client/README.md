# Handoff : portail client — Véro Chantal Photographe

## Overview

Portail privé livré à une cliente après sa séance photo. Véronique crée une session unique et
envoie le lien à la cliente. Ce lien mène à deux écrans :

1. **Espace Client** — page d'accueil pédagogique. La cliente néophyte y comprend ce qu'elle doit
   faire, comment, et ce que ça donnera.
2. **Galerie Client** — la galerie privée où elle voit toutes les photos de sa séance, les ouvre en
   plein écran, coche celles qu'elle veut faire retoucher, marque ses coups de cœur, puis confirme
   sa sélection.

Le portail est privé mais doit rester visuellement indissociable du site vitrine public.

## About the Design Files

Les fichiers de ce dossier sont des **références de design écrites en HTML** — des prototypes qui
montrent l'apparence et le comportement visés, pas du code de production à copier tel quel.

Le travail consiste à **recréer ces designs dans l'environnement existant du projet** (Next.js /
React dans le cas présent, d'après le guide graphique) en utilisant ses conventions et ses
bibliothèques. Si aucun environnement n'existe encore, choisir le framework le plus approprié et y
implémenter les designs.

Les fichiers `.dc.html` s'ouvrent directement dans un navigateur. `support.js` est le petit runtime
qui les fait fonctionner — il n'a aucune valeur pour l'implémentation, il est inclus uniquement
pour que les prototypes soient consultables hors ligne.

## Fidelity

**Haute fidélité.** Couleurs, typographie, espacements, états et interactions sont définitifs et
conformes au guide graphique « Véro Chantal ». L'interface doit être recréée fidèlement avec les
composants existants du codebase.

Seule exception : les photos de démonstration proviennent du dossier `uploads/portraits/` du projet
de design. En production, les photos viennent de la session de la cliente.

---

## Design Tokens

Repris tels quels du guide graphique (`globals.css`). **Palette strictement monochrome — aucune
couleur d'accent.** Le token `accent` existe mais vaut la même valeur que `ink` ; ne pas introduire
de couleur sans en discuter avec Véronique.

| Rôle | Token | Valeur |
|---|---|---|
| Fond clair | `surface-bg` | `#F7F6F4` |
| Fond clair alterné | `surface-bg-alt` | `#ececea` |
| Encre / fond sombre | `ink` | `#191816` |
| Texte secondaire (clair) | `ink-muted` | `#6f6d68` |
| Traits | `border` | `#dddad4` |
| Texte sur fond sombre | `on-dark` | `#F7F6F4` |
| Texte secondaire sur fond sombre | `on-dark-muted` | `#b9b6b0` |

**Rayons.** `radius-sm` = **2px** partout : boutons, champs, cartes, vignettes de la galerie.
`radius-full` (9999px) **uniquement** sur la pastille de coche d'une photo et sur le bouton cœur.

**Espacement.** Échelle Tailwind par défaut. Valeurs employées ici : 3, 4, 6, 8, 9, 12, 14, 16, 18,
20, 22, 28, 32, 36, 40, 48, 56, 80, 88, 96, 120 px.

**Typographie.** Quatre familles, rôles non interchangeables (Google Fonts, sous-ensemble latin) :

| Famille | Graisse | Rôle dans le portail |
|---|---|---|
| Italiana | 400 | monogramme « VC » uniquement |
| Cormorant Garamond | 300 italique | nom de marque, **et nom de la cliente** (en-tête galerie, héros) |
| Caveat | 600 | titres de section informels — 36px (accent-grand), 24px (accent-petit) |
| Jost | 300–600 | tout le reste : titres, corps, boutons, libellés |

Libellés discrets (eyebrows, boutons) : Jost, 10–11px, `text-transform: uppercase`,
`letter-spacing: .08em`–`.12em`.

Corps de texte : Jost 300, 13–15px, `line-height: 1.55`–`1.65`.

**Note sur Cormorant italique.** Le guide la réserve au lockup du logo. Le portail l'emploie
en plus pour le nom de la cliente, volontairement : c'est la signature manuscrite qui personnalise
la session. Confirmer avec Véronique si cette extension d'usage est acceptée.

---

## Screen 1 — Espace Client (accueil du portail)

**Fichier :** `Espace Client.dc.html`
**Route suggérée :** `/session/[token]`
**But :** rassurer et expliquer. La cliente ne doit avoir aucune question avant d'entrer dans la
galerie.

### Layout (de haut en bas)

**1. Barre d'en-tête** — `flex`, `justify-content: space-between`, padding `20px 6vw`, fond
`#F7F6F4`, `border-bottom: 1px solid #dddad4`, `z-index: 5`.
- Gauche : monogramme encadré (lien vers l'accueil du site). Bordure `1px solid #191816`, padding
  `9px 13px 8px`, colonne centrée : « VC » en Italiana 22px `letter-spacing: .08em`, puis un filet
  `1px × 18px` en `#191816`, gap 7px.
- Droite : courriel de la cliente (13px, `#6f6d68`) + bouton « DÉCONNEXION » (bordure `#dddad4`,
  radius 2px, padding `8px 16px`, 12px uppercase `.06em`).

**2. Héros pleine largeur** — `min-height: 62vh`, `display:flex`, `align-items: flex-end`,
`overflow: hidden`.
- Photo de couverture de la séance en `object-fit: cover`, position absolue plein cadre.
- Voile dégradé par-dessus :
  `linear-gradient(to bottom, rgba(25,24,22,.2) 0%, rgba(25,24,22,.55) 45%, rgba(25,24,22,.88) 100%)`.
  **Ne pas alléger ce dégradé** — il garantit le contraste du texte sur des photos claires.
- Contenu, aligné en bas, `max-width: 1100px`, padding `0 6vw 56px` :
  - Nom complet de la cliente — Cormorant italique 300, `clamp(26px, 3.2vw, 40px)`, `#F7F6F4`.
  - Pastille date — bordure `1px solid rgba(247,246,244,.5)`, radius 2px, padding `6px 14px`,
    11px uppercase `.1em`, texte `#F7F6F4`. Ex. « Séance du 12 septembre 2026 ».
  - Titre — Jost 300, `clamp(30px, 4.4vw, 52px)`, `line-height: 1.15`, `#F7F6F4` :
    « Vos photos sont prêtes. »
  - Sous-titre — Jost 300, `clamp(15px, 1.7vw, 19px)`, **`#F7F6F4` (pas `on-dark-muted`)**,
    `max-width: 620px` : « Prenez le temps de les regarder, puis choisissez celles que vous
    souhaitez faire retoucher. Tout se fait ici, en trois étapes. »
  - Actions, gap 24px : bouton primaire inversé (fond `#F7F6F4`, texte `#191816`, radius 2px,
    padding `15px 32px`, 13px uppercase `.08em`) « VOIR MES {n} PHOTOS » → galerie ; lien
    « Comment ça marche ? » (`#F7F6F4`, souligné d'un filet `rgba(247,246,244,.45)`) → ancre
    `#comment`.

**3. Carte de statut** — chevauche le héros de 32px (`transform: translateY(-32px)`),
`max-width: 1100px`, fond `#F7F6F4`, bordure `#dddad4`, radius 2px, padding `28px 32px`, `flex`
avec `gap: 32px` et `flex-wrap: wrap`. Trois blocs :
- *Votre séance* — eyebrow, type de forfait (21px), puis « {n} photos à découvrir · {m} retouches
  incluses à votre forfait ».
- *Sélection en cours* — séparé par `border-left: 1px solid #dddad4`, padding-left 32px. Compteur
  `0 / {m} choisies` (nombre en 26px Jost 300), puis barre de progression : piste 3px `#dddad4`,
  remplissage `#191816`.
- *Délai* — puce bordée (`#dddad4`, radius 2px) avec un point plein 6px `#191816` :
  « Il vous reste {d} jours ».

**4. Section « Comment ça marche »** (`id="comment"`) — `max-width: 1100px`, padding
`48px 6vw 96px`.
- Titre Caveat 600 36px, intro Jost 300 15px `#6f6d68` (`max-width: 560px`).
- Grille `repeat(auto-fit, minmax(250px, 1fr))`, gap 36px, trois colonnes. Chaque colonne :
  1. une **vignette explicative** (fond `#ececea`, radius 2px, padding 22px) qui schématise le
     geste — une grille 3×2 de blocs `#dddad4` de 44px de haut ;
  2. le numéro en Caveat 600 36px + le titre en Jost 400 18px, alignés sur la ligne de base ;
  3. un paragraphe Jost 300 14px `#6f6d68`.
- Étape 1 — grille nue. « Regardez toutes vos photos ».
- Étape 2 — deux blocs portent une pastille de coche ronde (16px, fond `#191816`, coche
  `#F7F6F4`, coin supérieur droit). « Cochez vos préférées ».
- Étape 3 — une carte blanche bordée figurant la barre de confirmation remplie (« 15 / 15
  choisies », barre pleine, bouton « CONFIRMER » sombre). « Confirmez votre sélection ».

**5. Section « Bon à savoir »** — fond `#ececea`, padding `80px 6vw`. Titre Caveat 36px sur toute
la largeur (`grid-column: 1/-1`), puis grille `repeat(auto-fit, minmax(280px, 1fr))`, gap `34px
48px`. Six questions, chacune : question Jost 400 16px + réponse Jost 300 14px `#6f6d68`.
Questions couvertes : combien de photos, jusqu'à quand, photos déjà retouchées ?, et après la
confirmation, partage du lien, hésitation entre deux photos.

**6. Bandeau CTA sombre** — fond `#191816`, padding `88px 6vw`, centré. Titre Caveat 36px
`#F7F6F4` « Passons à la sélection », paragraphe `#b9b6b0` (`max-width: 440px`), puis deux
boutons : « OUVRIR MA GALERIE » (fond `#F7F6F4`, texte `#191816`) et « ÉCRIRE À VÉRONIQUE »
(bordure `rgba(247,246,244,.5)`, texte `#F7F6F4`).

**7. Pied de page** — registre clair, `border-top: 1px solid #dddad4`, padding `56px 6vw 36px`.
Lockup complet à gauche (monogramme encadré 30px, puis « Véro Chantal » en Cormorant italique
38px, « PHOTOGRAPHE » 11px `letter-spacing: .5em`, « BOUDOIR · PORTRAIT · COUPLE » 9px
`letter-spacing: .3em`, puis l'URL). Liens du site à droite en 11px uppercase `#6f6d68`. Ligne de
copyright séparée par un filet.

### Copy — notes

- **Vouvoiement** partout, conformément au guide.
- **Aucune formulation genrée.** Le portail sert aussi bien une cliente qu'un client :
  « Quand votre sélection vous convient, vous la validez », « Passons à la sélection ». Ne pas
  réintroduire « satisfaite » / « prête ».

---

## Screen 2 — Galerie Client

**Fichier :** `Galerie Client.dc.html`
**Route suggérée :** `/session/[token]/galerie`
**But :** voir, agrandir, cocher, marquer, confirmer.

### Layout

**1. Barre d'en-tête sticky** — `position: sticky; top: 0; z-index: 40`, mêmes fond/bordure que
l'accueil, padding `20px 5vw`.
- Gauche : monogramme encadré (→ Espace Client) + bloc identité de séance : nom de la cliente en
  Cormorant italique 22px, puis « SÉANCE DU 12 SEPTEMBRE 2026 » en 10px uppercase `.12em`
  `#6f6d68`.
- Droite : lien « ← ACCUEIL » et bouton « DÉCONNEXION ».

**2. Coquille deux colonnes** — `display: grid`,
`grid-template-columns: minmax(0,1fr) minmax(230px,300px)`, gap 32px, `max-width: 1500px`, padding
`40px 5vw 120px`, `align-items: start`.
**L'aside doit rester co-visible avec la grille** — c'est lui qui explique les gestes. Ne pas le
laisser passer sous la grille aux largeurs de prévisualisation (~900–1000px). En dessous de ~900px,
soit conserver deux colonnes, soit promouvoir le compteur + la légende en barre sticky compacte
**au-dessus** de la grille.

**3. Colonne principale**
- Ligne de titre : « Vos photos » en Caveat 36px + « 21 photos » en 13px `#6f6d68` à gauche ;
  à droite, trois onglets « Toutes / Sélectionnées / Favorites ». Onglet : 11px uppercase `.08em`,
  padding `9px 16px`, radius 2px ; actif = fond `#191816`, texte `#F7F6F4` ; inactif = bordure
  `#dddad4`, texte `#6f6d68`, fond transparent.
- Sous les onglets, aligné à droite : lien « Retirer toutes les favorites » (11px, souligné,
  `text-underline-offset: 3px`, `#6f6d68`, sans bordure ni fond). **Visible uniquement s'il existe
  au moins une favorite.** Il est délibérément placé ici, et non dans le bloc « Votre sélection »,
  pour ne pas être confondu avec les actions de la sélection officielle.
- **Grille photos** : `repeat(auto-fill, minmax(150px, 1fr))`, gap 14px.
- **Vide** : si l'onglet actif ne contient rien, une carte bordée `#dddad4`, radius 2px, padding
  `56px 32px`, centrée : « Aucune photo dans cette vue pour l'instant. »

### La vignette photo (composant central)

Conteneur `position: relative`, `aspect-ratio: 2/3`, fond `#ececea`, radius 2px,
`overflow: hidden`, `cursor: zoom-in`. Photo en `object-fit: cover`, `loading="lazy"`.

Quatre couches par-dessus :

| Couche | Position | Comportement |
|---|---|---|
| **Cadre de sélection** | `inset: 0`, `pointer-events: none` | `border: 3px solid #191816` si la photo est sélectionnée, sinon aucune bordure |
| **Voile de survol** | `inset: 0`, `background: rgba(25,24,22,.28)` | `opacity: 0` → `1` au survol de la vignette, `transition: opacity .18s ease` |
| **Bouton cœur** | centré dans le voile | 52px, `border-radius: 9999px`, bordure `rgba(247,246,244,.7)`. Non favorite : fond `rgba(25,24,22,.3)`, cœur `#F7F6F4`. Favorite : fond `#F7F6F4`, cœur `#191816`. Glyphe ♥ 20px |
| **Pastille de coche** | `top: 9px; right: 9px` | 28px, `border-radius: 9999px`. Non cochée : bordure `rgba(247,246,244,.8)`, fond `rgba(25,24,22,.25)`, coche `#F7F6F4`. Cochée : fond et bordure `#191816`, coche `#F7F6F4`. `transition: all .15s ease`. **Toujours visible**, pas seulement au survol |

Plus deux repères discrets : un ♥ 13px en haut à gauche (`text-shadow: 0 1px 3px rgba(25,24,22,.7)`)
qui persiste hors survol quand la photo est favorite, et le numéro de photo (`01`, `02`…) en bas à
gauche, 10px `#F7F6F4` avec la même ombre.

**Hiérarchie des trois gestes — à respecter :**
- clic **sur la vignette** → ouvre le plein écran ;
- clic **sur la pastille** → bascule la sélection officielle (`stopPropagation`) ;
- clic **sur le cœur** → bascule le coup de cœur (`stopPropagation`).

La sélection est l'engagement (elle alimente le compteur et la confirmation) ; le favori est un
simple marque-page sans conséquence. Cette distinction doit rester lisible : cadre + pastille
sombres pour la sélection, cœur clair au centre pour le favori.

### Aside (sticky, `top: 110px`, `max-width: 340px`, colonne, gap 20px)

**Bloc « Votre sélection »** — bordé `#dddad4`, radius 2px, padding 22px.
- Eyebrow, puis compteur `{n}` en 32px Jost 300 + `/ {m} incluses` en 14px `#6f6d68`.
- Barre de progression : piste 3px `#dddad4`, remplissage `#191816`,
  `width: min(100%, n/m × 100%)`, `transition: width .2s ease`.
- **Message contextuel** (13px `#6f6d68`), quatre états :
  - 0 → « Aucune photo choisie pour le moment. Cochez celles qui vous plaisent. »
  - < forfait → « Encore {m−n} photo(s) incluses à votre forfait. »
  - = forfait → « Votre forfait est complet. Vous pouvez confirmer. »
  - > forfait → « {n−m} photo(s) au-delà du forfait : Véronique vous indiquera le tarif. »
    *Le dépassement est autorisé, jamais bloqué.*
- Bouton « CONFIRMER MA SÉLECTION » pleine largeur, padding 14px, radius 2px. Actif : fond
  `#191816`, texte `#F7F6F4`. Inactif (0 sélection) : fond transparent, bordure `#dddad4`, texte
  `#6f6d68`, `cursor: not-allowed`.
- Sous le bouton : lien « Désélectionner tout » (même style souligné discret que l'action
  favorites ; grisé `#b9b6b0` et non cliquable si la sélection est vide).
- Mention finale 11px : « Rien n'est envoyé tant que vous n'avez pas confirmé. Il vous reste {d}
  jours. »

**Bloc « Comment faire »** — fond `#ececea`, radius 2px, padding 22px. Titre Caveat 24px, puis
trois entrées `flex` (gap 12px, icône 26px + texte) :
- carré sombre ✓ → « Le crochet, en haut à droite » / « Ajoute la photo à votre sélection
  officielle, celle que Véronique retouchera. »
- rond clair ♥ → « Le cœur, au centre » / « Apparaît quand la souris survole une photo. Un coup de
  cœur à garder de côté, sans engagement. »
- carré clair ⤢ → « Cliquez sur la photo » / « Elle s'ouvre en grand. Les flèches du clavier
  passent à la suivante. »
- Ligne de clôture séparée par un filet : « Vous pouvez revenir, ajouter et retirer autant de fois
  que vous le voulez avant de confirmer. »

**Bloc contact** — bordé, padding 20px. « Une question ? », un paragraphe, puis un bouton
« ÉCRIRE À VÉRONIQUE » (bordure `#191816`).

### Lightbox

`position: fixed; inset: 0; z-index: 100`, fond `rgba(25,24,22,.96)`, `display: flex` centré,
padding 32px. Un calque absolu plein cadre ferme au clic (clic à côté de la photo).

Contenu, colonne centrée, gap 18px :
- la photo, `height: 74vh; width: 78vw`, `background-size: contain`, centrée ;
- deux boutons — « CHOISIR CETTE PHOTO » / « ✓ CHOISIE » et « ♥ COUP DE CŒUR » / « ♥ FAVORITE ».
  État inactif : bordure `rgba(247,246,244,.5)`, texte `#F7F6F4`, fond transparent. État actif :
  fond `#F7F6F4`, texte `#191816`. 11px uppercase `.08em`, padding `12px 22px`, radius 2px ;
- une ligne « PHOTO 07 — 21 PHOTOS » en 11px uppercase `#b9b6b0`.

Trois contrôles en surimpression, tous 40–44px, bordure `rgba(247,246,244,.4)`, radius 2px, texte
`#F7F6F4`, fond transparent : flèche gauche (`left: 3vw`, centrée verticalement), flèche droite
(`right: 3vw`), fermeture ✕ (`right: 3vw; top: 28px`).

**Clavier :** `Échap` ferme, `←` / `→` naviguent. La navigation boucle **dans la vue filtrée
courante**, pas dans la liste complète — si la cliente est sur l'onglet « Favorites », les flèches
ne parcourent que ses favorites.

**Note d'implémentation.** Dans le prototype, la photo du lightbox est un `<div>` avec
`background-image`, pas un `<img>` : un `src` dynamique dans le template déclenchait une requête
parasite via le preload scanner du navigateur. En React ce problème n'existe pas — utiliser un
`<img>` normal avec `object-fit: contain`, et prévoir le préchargement des photos voisines.

---

## Interactions & Behavior

| Déclencheur | Effet |
|---|---|
| Clic vignette | Ouvre le lightbox sur cette photo |
| Clic pastille ✓ | Bascule la sélection ; met à jour compteur, barre, message, état du bouton Confirmer |
| Clic cœur | Bascule le favori ; fait apparaître/disparaître le lien « Retirer toutes les favorites » |
| Onglets | Filtrent la grille (toutes / sélectionnées / favorites) sans perdre l'état |
| Désélectionner tout | Vide la sélection. **Prévoir une confirmation** — le prototype ne la fait pas |
| Retirer toutes les favorites | Vide les favoris. Idem |
| Confirmer | Non implémenté dans le prototype. Doit être **irréversible côté cliente** : verrouiller la session, envoyer la liste à Véronique, envoyer un courriel de confirmation, afficher un état « sélection confirmée » |
| ← / → / Échap | Navigation et fermeture du lightbox |
| Survol vignette | Voile `.28` + cœur, `opacity` en `.18s ease` |

**Transitions utilisées :** `opacity .18s ease` (voile), `all .15s ease` (pastille),
`width .2s ease` (barre). Rien d'autre. L'interface est volontairement sobre.

**Responsive.** Ces deux écrans sont des vues applicatives fluides, pas des formats fixes. Tout doit
refluer : `max-width` plutôt que `width`, pistes de grille qui rétrécissent (`minmax(0,1fr)`),
aucune hauteur fixe sur les blocs de texte. Sur mobile, prévoir le cœur en tap (pas de survol) —
p. ex. la pastille toujours visible et le cœur dans une barre d'action sous la photo ouverte.

**Accessibilité.** Cibles tactiles ≥ 44px (la pastille à 28px doit passer à 44px sur mobile).
Chaque bouton porte un `title` / `aria-label` explicite. La sélection ne doit pas reposer sur la
seule couleur : le cadre 3px et la coche assurent le double codage.

---

## State Management

État minimal par session cliente :

```
selected   : Set<photoId>     // sélection officielle, alimente le compteur
favorites  : Set<photoId>     // coups de cœur, sans conséquence
view       : 'all' | 'selected' | 'favorites'
openIndex  : photoId | null   // lightbox
```

Données de session à charger depuis l'API :

```
sessionName    : string   // prénom + nom de la cliente — pas de date ici
sessionDate    : date     // affichée dans la pastille et l'en-tête
clientEmail    : string
photos         : Photo[]  // url, miniature, largeur, hauteur
includedCount  : number   // dépend du forfait, pas une constante
expiresAt      : date     // le délai varie selon le forfait (30 j par défaut)
status         : 'open' | 'confirmed'
```

**À faire en production, absent du prototype :**
- persister `selected` et `favorites` côté serveur à chaque bascule (debounce), pour que la cliente
  retrouve son travail sur un autre appareil ;
- gérer l'expiration : session en lecture seule passé `expiresAt`, avec un message clair invitant à
  écrire à Véronique — le délai est négociable selon le forfait ;
- gérer l'état `confirmed` : galerie verrouillée, récapitulatif de la sélection, puis livraison des
  fichiers haute résolution dans cette même galerie.

---

## Assets

- **Logo.** Aucune image : lockup typographique codé (monogramme Italiana + nom Cormorant italique
  + deux lignes Jost en petites majuscules). Trois formes : lockup complet (pied de page),
  monogramme encadré (en-têtes), watermark (non utilisé ici). Reprendre le composant React existant
  du site plutôt que le recoder.
- **Polices.** Google Fonts, sous-ensemble latin : Jost 300–600, Italiana 400, Caveat 600,
  Cormorant Garamond 300 (+ italique).
- **Photos.** Uniquement des photos de démonstration issues de `uploads/portraits/` du projet de
  design (21 fichiers). Aucune ne doit être embarquée en production.
- **Icônes.** Glyphes texte (`✓`, `♥`, `⤢`, `←`, `→`, `✕`). À remplacer par les icônes du codebase.

## Files

| Fichier | Contenu |
|---|---|
| `Espace Client.dc.html` | Écran 1 — accueil du portail |
| `Galerie Client.dc.html` | Écran 2 — galerie, sélection, lightbox |
| `support.js` | Runtime des prototypes. Aucune valeur pour l'implémentation |
| `image-slot.js` | Composant d'emplacement photo utilisé par l'écran 1 |

Ouvrir les deux `.dc.html` directement dans un navigateur pour voir le comportement réel. Les
chemins des photos pointent vers `uploads/portraits/` du projet de design ; hors de ce projet, les
images ne se chargeront pas — la mise en page et les interactions restent intactes.

## Questions ouvertes

1. **Adresse courriel.** Les boutons « Écrire à Véronique » utilisent un `mailto:` vers
   `bonjour@veroniquechantalphoto.ca`, avec l'objet pré-rempli « Ma séance du {date} ». Adresse à
   confirmer. Choix délibéré de ne pas réutiliser le formulaire de contact public : la cliente est
   déjà identifiée.
2. **Photos supplémentaires.** Le dépassement du forfait est permis et signalé, mais le tarif n'est
   affiché nulle part — Véronique répond au cas par cas. À formaliser si elle le souhaite.
3. **Cormorant italique pour le nom de la cliente** — voir la note dans Typographie.
4. **Téléchargement.** Les textes annoncent que les fichiers haute résolution arriveront « dans
   cette même galerie ». Cet écran de livraison n'est pas encore conçu.
