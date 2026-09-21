# Handoff : admin — page Séance

## Overview

Écran d'administration d'**une** séance, côté Véronique. C'est ici qu'elle téléverse les photos de
la séance, choisit la photo de couverture, suit le statut du dossier, et envoie au client le lien
qui lui permettra de créer son mot de passe.

Cet écran est la contrepartie interne du **portail client** (voir
`design_handoff_portail_client/`) : ce qui est téléversé ici apparaît dans « Galerie Client ».

## About the Design Files

Les fichiers de ce dossier sont des **références de design écrites en HTML** — des prototypes qui
montrent l'apparence et le comportement visés, pas du code de production à copier tel quel.

Le travail consiste à **recréer ce design dans l'environnement existant du projet** (Next.js /
React) avec ses conventions et ses composants. `support.js` est le petit runtime qui fait
fonctionner le prototype ; il n'a aucune valeur pour l'implémentation.

## Fidelity

**Haute fidélité** pour la mise en page, la typographie, les états et les interactions : tout est
conforme au guide graphique « Véro Chantal » et aux deux écrans du portail client.

Ce qui est **simulé** dans le prototype et doit être réellement branché :
- le téléversement (le sélecteur de fichiers et le glisser-déposer ajoutent des photos factices
  tirées d'une liste locale, sans upload) ;
- la génération du lien de mot de passe (URL en dur) ;
- la copie presse-papiers (change seulement le libellé du bouton) ;
- la suppression de séance (bouton sans action).

---

## Design Tokens

Identiques au portail client. **Palette strictement monochrome, aucune couleur d'accent** — y
compris pour les états destructifs (voir « Zone sensible »).

| Rôle | Valeur |
|---|---|
| Fond de page | `#F7F6F4` |
| Fond de carte | `#FFFFFF` |
| Fond alterné / vignette vide | `#ececea` |
| Encre | `#191816` |
| Texte secondaire | `#6f6d68` |
| Texte désactivé | `#a9a6a0` |
| Traits | `#dddad4` |
| Trait de vignette | `#e6e3de` |
| Trait pointillé (dépôt) | `#c9c5bd` |
| Fond de dépôt actif | `#efece7` |

**Rayon :** 2px partout. Aucun élément arrondi complet sur cet écran.

**Typographie :**

| Famille | Rôle ici |
|---|---|
| Italiana 400 | monogramme « VC » |
| Cormorant Garamond 300 italique | nom de la séance (titre de page) |
| Caveat 600 | « Photos de la séance » (32px) |
| Jost 300–600 | tout le reste |

Libellés discrets : Jost, 10–11px, uppercase, `letter-spacing: .08em`–`.12em`.

---

## Screen — Admin Séance

**Fichier :** `Admin Séance.dc.html`
**Route suggérée :** `/admin/seances/[id]`

### Layout (de haut en bas)

**1. Barre admin sticky** — `position: sticky; top: 0; z-index: 40`, padding `16px 4vw`, fond
`#F7F6F4`, `border-bottom: 1px solid #dddad4`.
- Gauche : monogramme encadré (→ accueil du site) puis la navigation admin « Séances / Photos /
  Messages » en 12px uppercase `.08em`. L'onglet actif est souligné d'un filet `#191816` ; les
  autres sont en `#6f6d68`.
- Droite : courriel de l'administratrice + bouton « DÉCONNEXION » (bordure `#dddad4`, radius 2px).

Cette barre est **distincte** de l'en-tête client : elle porte une navigation, pas une identité de
séance.

**2. En-tête de séance** — `flex`, `align-items: flex-end`, `justify-content: space-between`,
`flex-wrap: wrap`, gap 24px.
- Gauche : lien de retour « ← TOUTES LES SÉANCES » (11px uppercase `#6f6d68`), le **nom de la
  séance** en Cormorant italique `clamp(34px, 4.4vw, 52px)`, puis la ligne client
  « Prénom Nom · courriel » en 14px `#6f6d68`.
- Droite : le **sélecteur de statut** — libellé « STATUT » 10px uppercase puis un `<select>`
  stylé (`appearance: none`, padding `10px 38px 10px 16px`, radius 2px) avec un chevron `▾` en
  `position: absolute`, `pointer-events: none`, à 14px du bord droit.
  - Statut « En attente » (valeur par défaut) : fond `#F7F6F4`, bordure `#dddad4`, texte
    `#6f6d68`, chevron `#6f6d68`.
  - Tout autre statut : fond et bordure `#191816`, texte et chevron `#F7F6F4`.
  - Valeurs : `En attente`, `Galerie envoyée`, `Sélection reçue`, `Terminée`.
  - En production, prévoir un `<select>` natif (accessible) ou le composant select du codebase ;
    conserver le double codage clair/sombre, qui donne l'état du dossier d'un coup d'œil.

**3. Bande de métadonnées** — une seule carte bordée `#dddad4`, fond `#fff`, radius 2px, découpée
en colonnes par des `border-right: 1px solid #dddad4` :
`grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))`, padding `20px 24px` par cellule.
- *Photos en ligne* — nombre 30px Jost 300, **dynamique** (suit les ajouts/suppressions).
- *Retouches incluses* — nombre 30px, vient du forfait.
- *Date de séance* — 16px Jost 400.
- *Accès expire le* — 16px Jost 400.

Chaque cellule : eyebrow 10px uppercase `.12em` `#6f6d68` puis la valeur.

**4. Coquille deux colonnes** — `grid-template-columns: minmax(0,1fr) minmax(260px,330px)`,
gap 36px, `align-items: start`, `max-width: 1500px`, padding `36px 4vw 100px`.

### Colonne principale — photos

**Ligne de titre.** « Photos de la séance » en Caveat 32px à gauche ; à droite, le bouton texte
« Tout sélectionner » / « Tout désélectionner » (12px `#6f6d68`, souligné d'un filet `#dddad4`) et
le compteur. Le compteur affiche « {n} photos » quand rien n'est coché, « {n} sélectionnée(s) »
sinon.

**Zone de dépôt.** `border: 1px dashed #c9c5bd`, radius 2px, padding `44px 24px`, centrée.
Titre 15px « Glissez vos photos ici », sous-titre 12px `#6f6d68` « JPEG ou PNG, 20 Mo maximum par
fichier », puis un bouton sombre « CHOISIR DES FICHIERS » qui déclenche un
`<input type="file" accept="image/*" multiple>` masqué.
- Au survol d'un glisser : bordure `#191816`, fond `#efece7`, `transition: background .15s ease`.
- Les handlers `dragover` / `dragleave` / `drop` doivent tous `preventDefault()`.
- **À implémenter :** upload réel avec progression par fichier, validation du type et du poids,
  gestion des erreurs, et affichage optimiste de la vignette pendant l'envoi.

**Barre d'action contextuelle.** Apparaît **uniquement** quand au moins une photo est cochée,
entre la zone de dépôt et la grille : fond `#191816`, texte `#F7F6F4`, radius 2px, padding
`12px 18px`, `flex` `space-between`.
- Gauche : « {n} sélectionnée(s) ».
- Droite : « ANNULER » (bordure `rgba(247,246,244,.4)`, fond transparent) et « SUPPRIMER LA
  SÉLECTION » (fond `#F7F6F4`, texte `#191816`).
- **Prévoir une confirmation** avant suppression — le prototype supprime directement.

**Grille de vignettes.** `repeat(auto-fill, minmax(160px, 1fr))`, gap 14px.

### La carte photo (composant central)

Carte : `border: 1px solid #e6e3de`, radius 2px, `overflow: hidden`, fond `#fff`. **Si la photo est
cochée, la bordure passe à `#191816`.**

Deux parties :

**a) Le visuel** — `position: relative`, `aspect-ratio: 3/4`, fond `#ececea`, photo en
`object-fit: cover`, `loading="lazy"`. Trois couches par-dessus :

| Couche | Position | Comportement |
|---|---|---|
| **Voile d'action** | `inset: 0`, `background: rgba(25,24,22,.35)` | `opacity: 0` → `1` au survol de la carte, `transition: opacity .16s ease`. Colonne alignée en bas, gap 6px, padding 8px |
| **Case à cocher** | `top: 8px; right: 8px`, 24px, radius 2px | Non cochée : fond `rgba(247,246,244,.85)`, bordure `rgba(247,246,244,.8)`, glyphe transparent. Cochée : fond et bordure `#191816`, coche `#F7F6F4`. **Toujours visible**, pas seulement au survol |
| **Bandeau « COUVERTURE »** | `top: 0; left: 0` | Fond `#191816`, texte `#F7F6F4`, 9px uppercase `.12em`, padding `5px 9px`, `border-bottom-right-radius: 2px`. Ancré au coin pour ne pas gêner les boutons du bas |

Dans le voile, deux boutons pleine largeur empilés :
- « Définir en couverture » — bordure `#F7F6F4`, fond transparent, texte `#F7F6F4`. **Masqué sur
  la photo déjà en couverture.**
- « Supprimer » — fond `#F7F6F4`, texte `#191816`.

**b) Le pied de carte** — `border-top: 1px solid #e6e3de`, padding `10px 12px`, `flex`
`space-between` : nom de fichier 12px (tronqué en `text-overflow: ellipsis`) et poids 11px
`#6f6d68`.

**Gestes :** clic case → bascule la sélection ; clic « Définir en couverture » → désigne la
couverture ; clic « Supprimer » → retire la photo. Le survol seul ne fait rien d'autre que révéler
le voile.

> **Manque au prototype, à prévoir :** ouverture en grand au clic sur le visuel, et **réordonnance
> par glisser-déposer** — l'ordre de la grille est l'ordre vu par le client.

### Aside (sticky, `top: 96px`, colonne, gap 20px)

**1. Carte « Accès client »** — bordée, fond `#fff`, padding 22px.
- Paragraphe 13px `#6f6d68` : le lien sert à **créer le mot de passe**. Le client se connecte
  ensuite normalement sur `/client/login` (interface déjà existante, hors périmètre de ce handoff).
- Champ d'affichage du lien : bordure `#dddad4`, fond `#F7F6F4`, padding `10px 12px`, 12px
  `#6f6d68`, `word-break: break-all`.
  - Avant génération : « Aucun lien de mot de passe actif ».
  - Après : l'URL seule, p. ex.
    `veroniquechantalphoto.ca/client/mot-de-passe/8f3a-c21b-4e90`.
- Deux boutons côte à côte (`flex: 1`, `min-width: 130px`) :
  - « GÉNÉRER UN LIEN » — primaire sombre. Même libellé avant et après (une régénération invalide
    le lien précédent).
  - « COPIER LE LIEN » — secondaire bordé ; **désactivé visuellement** tant qu'aucun lien n'existe
    (bordure `#dddad4`, texte `#a9a6a0`, `cursor: default`). Passe à « COPIÉ » après copie.

**À implémenter :** génération d'un jeton à usage unique et à durée limitée, invalidation du
précédent, envoi du courriel, affichage de la date d'expiration du jeton et de son état
(actif / utilisé / expiré), et `navigator.clipboard.writeText` avec retour d'état.

**2. Carte « Aperçu client »** — bordée, fond `#fff`, padding 22px.
- Un rappel de la couverture : vignette 56×74px (radius 2px, `object-fit: cover`) + eyebrow
  « COUVERTURE » et nom de fichier. **Se met à jour quand la couverture change** ; si la photo de
  couverture est supprimée, la première photo restante prend le relais.
- Paragraphe 13px puis un lien-bouton bordé « OUVRIR LA GALERIE » → la galerie telle que le client
  la verra.

> **Note d'implémentation.** Dans le prototype, cette vignette est un `<div>` avec
> `background-image` plutôt qu'un `<img>` : un `src` dynamique déclenchait une requête parasite via
> le preload scanner. En React, utiliser un `<img>` normal.

**3. Carte « Zone sensible »** — bordée `#dddad4`, **sans fond blanc** (elle se détache par le vide,
pas par la couleur). Paragraphe d'avertissement puis bouton pleine largeur « SUPPRIMER LA SÉANCE »
(bordure `#191816`, fond transparent).
- La palette étant monochrome, **aucun rouge** : le poids de l'action est porté par le texte et par
  la confirmation. Prévoir une modale de confirmation exigeant la saisie du nom de la séance.

---

## Interactions & Behavior

| Déclencheur | Effet |
|---|---|
| Changement du `<select>` statut | Met à jour le statut ; bascule le style clair → sombre dès qu'on quitte « En attente » |
| « Tout sélectionner » | Coche toutes les photos ; le libellé devient « Tout désélectionner » |
| Clic case à cocher | Bascule la sélection ; fait apparaître/disparaître la barre d'action noire |
| « Annuler » (barre noire) | Vide la sélection sans rien supprimer |
| « Supprimer la sélection » | Retire les photos cochées et vide la sélection. **Confirmation à ajouter** |
| Glisser-déposer / « Choisir des fichiers » | Ajoute des photos. Dans le prototype, puise dans une liste locale de 4 fichiers supplémentaires puis n'ajoute plus rien |
| « Définir en couverture » | Désigne cette photo ; met à jour le bandeau de la grille et la carte « Aperçu client » |
| « Supprimer » (une photo) | Retire la photo ; si c'était la couverture, la première photo restante la remplace |
| « Générer un lien » | Crée le lien de mot de passe et réinitialise l'état « Copié » |
| « Copier le lien » | Inactif tant qu'aucun lien n'existe ; sinon passe à « COPIÉ » |

**Transitions :** `opacity .16s ease` (voile) et `background .15s ease` (zone de dépôt).
Rien d'autre.

**Responsive.** Vue applicative fluide, pas de format fixe. `max-width` plutôt que `width`, pistes
`minmax(0,1fr)`, aucune hauteur fixe. Sous ~900px, l'aside passe sous la grille ; garder la carte
« Accès client » en premier dans l'ordre empilé. Le voile de survol n'existe pas au tactile :
prévoir les actions de carte (couverture / supprimer) dans un menu accessible au tap.

**Accessibilité.** Cibles ≥ 44px au tactile (la case de 24px doit grossir). Le `<select>` garde un
`<label for>`. Chaque bouton d'icône porte un `title` / `aria-label`. La sélection est signalée par
la bordure **et** par la coche — jamais par la seule couleur.

---

## State Management

État de l'écran :

```
photos     : Photo[]          // id, nom de fichier, poids, url, ordre
selected   : Set<photoId>     // sélection admin (actions en lot)
coverId    : photoId | null   // photo de couverture, retombe sur photos[0] si supprimée
status     : 'pending' | 'sent' | 'received' | 'done'
linkToken  : { url, expiresAt, state } | null
dragging   : boolean          // survol de la zone de dépôt
copied     : boolean          // retour visuel du bouton Copier
```

Données à charger depuis l'API : nom de la séance, client (nom, courriel), date de séance, date
d'expiration de l'accès, nombre de retouches incluses (forfait), photos, statut, jeton actif.

**À faire en production, absent du prototype :**
- persister chaque mutation (ajout, suppression, couverture, statut) immédiatement ;
- afficher la progression d'upload et gérer les échecs par fichier ;
- journaliser les changements de statut (qui, quand) ;
- verrouiller la suppression de photos une fois que le client a confirmé sa sélection — sinon sa
  sélection perd ses références.

---

## Assets

- **Logo.** Aucune image : monogramme encadré codé (Italiana + filet). Reprendre le composant React
  existant du site.
- **Polices.** Google Fonts, sous-ensemble latin : Jost 300–600, Italiana 400, Caveat 600,
  Cormorant Garamond 300 italique.
- **Photos.** Démonstration seulement, issues de `uploads/portraits/` du projet de design. Aucune
  ne doit être embarquée en production.
- **Icônes.** Glyphes texte (`✓`, `▾`, `←`). À remplacer par les icônes du codebase.

## Files

| Fichier | Contenu |
|---|---|
| `Admin Séance.dc.html` | L'écran d'administration d'une séance |
| `support.js` | Runtime du prototype. Aucune valeur pour l'implémentation |

Ouvrir le `.dc.html` directement dans un navigateur pour voir le comportement réel. Les chemins des
photos pointent vers `uploads/portraits/` du projet de design ; hors de ce projet les images ne se
chargeront pas — la mise en page et les interactions restent intactes.

## Questions ouvertes

1. **Liste des séances.** L'écran suppose une page `/admin/seances` en amont (le lien « ← Toutes
   les séances ») et des onglets « Photos » et « Messages ». Ces écrans ne sont pas conçus.
2. **Création d'une séance.** Le formulaire qui crée la séance (client, date, forfait, durée
   d'accès) n'existe pas encore. Les quatre métadonnées de la bande sont affichées en lecture
   seule ; il faudra décider si elles s'éditent ici ou ailleurs.
3. **Ordre des photos.** Le client voit la grille dans l'ordre de téléversement. Faut-il un tri
   manuel par glisser-déposer ?
4. **Expiration de l'accès.** Prolongeable depuis cet écran ? Aujourd'hui la date est en lecture
   seule.
5. **Après confirmation du client.** Cet écran ne montre pas la sélection reçue. Prévoir soit un
   filtre « photos choisies par le client » dans cette grille, soit un écran dédié.
