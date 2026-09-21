# Handoff : admin — page Portfolio

## Overview

Écran d'administration des **photos du portfolio public**. Véronique y téléverse des photos, les
classe en « Portrait » et/ou « Boudoir », et fixe leur ordre d'affichage dans la grille publique
(`/portfolio`).

Cet écran refond la page admin existante (liste de rangées avec cases à cocher) en grille de
vignettes. Il partage son vocabulaire visuel avec `design_handoff_admin_seance/` : même barre
admin, même bande de métadonnées, même carte photo, même barre d'action en lot. Les deux écrans
doivent rester cohérents — toute évolution de l'un est à répercuter sur l'autre.

## About the Design Files

Les fichiers de ce dossier sont des **références de design écrites en HTML** — des prototypes qui
montrent l'apparence et le comportement visés, pas du code de production à copier tel quel.

Le travail consiste à **recréer ce design dans l'environnement existant du projet** (Next.js /
React) avec ses conventions et ses composants. `support.js` est le petit runtime qui fait
fonctionner le prototype ; il n'a aucune valeur pour l'implémentation.

## Fidelity

**Haute fidélité** pour la mise en page, la typographie, les états et les interactions.

Ce qui est **simulé** et doit être réellement branché :
- le téléversement (le sélecteur de fichiers et le glisser-déposer ajoutent des photos factices
  tirées d'une liste locale de 4 fichiers, sans upload) ;
- la persistance (tout l'état est en mémoire, perdu au rechargement) ;
- la suppression (immédiate, sans confirmation).

---

## Design Tokens

Identiques au reste du site. **Palette strictement monochrome, aucune couleur d'accent** — c'est
la différence la plus visible avec la page actuelle, dont les cases à cocher sont bleues (couleur
système). Les cases natives doivent être remplacées par les contrôles décrits plus bas.

| Rôle | Valeur |
|---|---|
| Fond de page | `#F7F6F4` |
| Fond de carte | `#FFFFFF` |
| Fond alterné / vignette vide | `#ececea` |
| Encre | `#191816` |
| Texte secondaire | `#6f6d68` |
| Texte désactivé / compteur à zéro | `#a9a6a0` |
| Traits | `#dddad4` |
| Trait de vignette | `#e6e3de` |
| Trait pointillé (dépôt) | `#c9c5bd` |
| Fond de dépôt actif | `#efece7` |

**Rayon :** 2px partout.

**Typographie :**

| Famille | Rôle ici |
|---|---|
| Italiana 400 | monogramme « VC » |
| Cormorant Garamond 300 italique | titre « Photos du portfolio » |
| Jost 300–600 | tout le reste |

Caveat n'est pas utilisée sur cet écran : c'est une vue de gestion, pas une page adressée au
client.

Libellés discrets : Jost, 10–11px, uppercase, `letter-spacing: .08em`–`.12em`.

---

## Screen — Admin Portfolio

**Fichier :** `Admin Portfolio.dc.html`
**Route suggérée :** `/admin/photos`

### Layout (de haut en bas)

**1. Barre admin sticky** — identique à celle de la page Séance : `position: sticky; top: 0;
z-index: 40`, padding `16px 4vw`, fond `#F7F6F4`, `border-bottom: 1px solid #dddad4`.
Monogramme encadré + navigation « Photos / Séances / Messages » (onglet actif souligné d'un filet
`#191816`), courriel et bouton « DÉCONNEXION » à droite.

**2. En-tête de page** — `flex`, `align-items: flex-end`, `space-between`, `flex-wrap: wrap`.
- Gauche (`max-width: 620px`) : titre « Photos du portfolio » en Cormorant italique
  `clamp(34px, 4.4vw, 52px)`, puis le paragraphe d'explication en 14px `#6f6d68`.
- Droite : lien-bouton bordé « VOIR LA PAGE PUBLIQUE » → `/portfolio`.

**3. Bande de métadonnées** — une carte bordée `#dddad4`, fond `#fff`, découpée par des
`border-right: 1px solid #dddad4` ; `grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))`,
padding `20px 24px` par cellule. Eyebrow 10px uppercase `.12em` puis nombre 30px Jost 300.
- *Photos en ligne* — total.
- *Portrait* — nombre de photos portant la catégorie.
- *Boudoir* — idem. **Une photo peut compter dans les deux** ; la somme des deux colonnes n'égale
  donc pas le total, c'est voulu.
- *Sans catégorie* — photos sans aucune catégorie. Le nombre est en `#191816` s'il y en a,
  **en `#a9a6a0` quand il vaut zéro** : l'anomalie doit se voir, l'état sain doit se taire.

**4. Coquille deux colonnes** — `grid-template-columns: minmax(0,1fr) minmax(260px,330px)`,
gap 36px, `align-items: start`, `max-width: 1500px`, padding `36px 4vw 100px`.

### Colonne principale — la grille

**Barre d'outils.** À gauche, quatre onglets de filtre : « Toutes / Portrait / Boudoir / Sans
catégorie ». Onglet : 11px uppercase `.08em`, padding `9px 16px`, radius 2px ; actif = fond
`#191816`, texte `#F7F6F4` ; inactif = bordure `#dddad4`, texte `#6f6d68`, fond transparent.
À droite : bouton texte « Tout sélectionner » / « Tout désélectionner » (12px `#6f6d68`, souligné
d'un filet `#dddad4`) et le compteur de la vue courante.

> Remplace les deux sections empilées « PORTRAIT (7) » / « BOUDOIR (0) » de la page actuelle. Le
> filtre évite la duplication visuelle d'une photo classée dans les deux catégories, et fait tenir
> l'écran sans défilement interminable.

**« Tout sélectionner » agit sur la vue filtrée**, pas sur la bibliothèque entière.

**Barre d'action en lot.** Apparaît uniquement quand au moins une photo est cochée, au-dessus de
la grille : fond `#191816`, texte `#F7F6F4`, radius 2px, padding `12px 18px`, `flex`
`space-between`, boutons `flex-wrap: wrap`.
- Gauche : « {n} sélectionnée(s) ».
- Droite : « CLASSER EN PORTRAIT », « CLASSER EN BOUDOIR », « ANNULER » (tous bordés
  `rgba(247,246,244,.4)`, fond transparent) et « SUPPRIMER » (fond `#F7F6F4`, texte `#191816`).
- Les deux actions de classement **ajoutent** la catégorie sans retirer l'autre, et vident la
  sélection. Elles ne déclassent pas : le retrait se fait photo par photo.
- **Prévoir une confirmation** avant suppression — le prototype supprime directement.

**Grille.** `repeat(auto-fill, minmax(180px, 1fr))`, gap 14px.

**Vue vide.** Si le filtre ne renvoie rien : carte bordée `#dddad4`, radius 2px, padding
`56px 32px`, centrée, « Aucune photo dans cette vue. »

### La carte photo

Carte : `border: 1px solid #e6e3de`, radius 2px, `overflow: hidden`, fond `#fff`. **Bordure
`#191816` si la photo est cochée.**

**a) Le visuel** — `position: relative`, `aspect-ratio: 3/4`, fond `#ececea`, photo en
`object-fit: cover`, `loading="lazy"`. Trois couches :

| Couche | Position | Comportement |
|---|---|---|
| **Voile d'action** | `inset: 0`, `background: rgba(25,24,22,.4)` | `opacity: 0` → `1` au survol de la carte, `transition: opacity .16s ease`. Colonne en `space-between`, padding 8px |
| **Case à cocher** | `top: 8px; right: 8px`, 24px, radius 2px | Non cochée : fond `rgba(247,246,244,.85)`, bordure `rgba(247,246,244,.8)`, glyphe transparent. Cochée : fond et bordure `#191816`, coche `#F7F6F4`. **Toujours visible**, pas seulement au survol |
| **Numéro de position** | `top: 0; left: 0` | Fond `rgba(25,24,22,.75)`, texte `#F7F6F4`, 9px `.12em`, padding `5px 9px`, `border-bottom-right-radius: 2px`. Format `01`, `02`… |

Dans le voile : en haut, deux boutons carrés 30px « ↑ » et « ↓ » (bordure `rgba(247,246,244,.6)`,
fond transparent, texte `#F7F6F4`) ; en bas, « Supprimer » (fond `#F7F6F4`, texte `#191816`).

**b) Le pied de carte** — `border-top: 1px solid #e6e3de`, padding `10px 12px`.
- Première ligne : nom de fichier 12px (tronqué en `text-overflow: ellipsis`) et poids 11px
  `#6f6d68`.
- Deuxième ligne : deux **pastilles de catégorie** côte à côte (`flex: 1`), radius 2px, padding
  `7px 8px`, 10px uppercase `.08em`. Active : fond et bordure `#191816`, texte `#F7F6F4`.
  Inactive : bordure `#dddad4`, fond transparent, texte `#6f6d68`. Un clic bascule.

> Ce sont des **boutons à deux états**, pas des `<input type="checkbox">`. Ils doivent porter
> `aria-pressed` et un `aria-label` explicite (« Classer _B6A0927 en portrait »). Ne pas
> réintroduire de case native : sa couleur système casse la palette monochrome.

### Aside (sticky, `top: 96px`, colonne, gap 20px)

**1. Zone de dépôt** — `border: 1px dashed #c9c5bd`, radius 2px, fond `#fff`, padding 22px. Au
survol d'un glisser : bordure `#191816`, fond `#efece7`, `transition: background .15s ease`. Les
handlers `dragover` / `dragleave` / `drop` doivent tous `preventDefault()`.
- Eyebrow « AJOUTER DES PHOTOS », titre 14px « Glissez vos photos ici », contrainte 12px
  `#6f6d68`.
- **« Catégorie à l'ajout »** — les deux mêmes pastilles Portrait / Boudoir. Elles définissent la
  catégorie appliquée aux photos téléversées ensuite ; l'état persiste d'un ajout au suivant.
  Par défaut : Portrait seul. Les deux peuvent être désactivées (la photo arrive alors sans
  catégorie et rejoint le compteur « Sans catégorie »).
- Bouton pleine largeur « CHOISIR DES FICHIERS » déclenchant un
  `<input type="file" accept="image/*" multiple>` masqué.

> Dans la page actuelle, le bloc d'ajout occupe toute la largeur en haut et pousse la
> bibliothèque sous la ligne de flottaison. Ici il est dans l'aside, visible en permanence grâce
> au `position: sticky` — on peut déposer sans remonter.

**À implémenter :** upload réel avec progression par fichier, validation du type et du poids,
gestion des erreurs, affichage optimiste de la vignette pendant l'envoi.

**2. Carte « Ordre d'affichage »** — bordée, fond `#fff`, padding 22px. Explique que le numéro de
la vignette est la position dans la grille publique et que les flèches déplacent d'un cran.

**3. Carte « À surveiller »** — bordée, **sans fond blanc**. Message dynamique :
- s'il existe des photos sans catégorie : « {n} photo(s) n'apparaît/apparaissent sur aucune page
  publique, faute de catégorie. » (accord singulier/pluriel géré) ;
- sinon : « Toutes les photos sont classées dans au moins une catégorie. »

---

## Interactions & Behavior

| Déclencheur | Effet |
|---|---|
| Onglet de filtre | Filtre la grille. La sélection en cours n'est pas vidée — en tenir compte pour le compteur de la barre noire |
| « Tout sélectionner » | Coche toutes les photos **de la vue courante** ; le libellé devient « Tout désélectionner » |
| Clic case à cocher | Bascule la sélection ; fait apparaître/disparaître la barre noire |
| Pastille Portrait / Boudoir (carte) | Ajoute ou retire la catégorie sur cette photo ; met à jour la bande de stats et, si le filtre l'exclut désormais, la photo quitte la vue |
| « Classer en portrait/boudoir » (lot) | Ajoute la catégorie aux photos cochées, puis vide la sélection |
| « Annuler » | Vide la sélection sans rien modifier |
| « Supprimer » (lot ou carte) | Retire la ou les photos. **Confirmation à ajouter** |
| ↑ / ↓ | Échange la photo avec sa voisine **dans l'ordre global**, pas dans la vue filtrée. Aux extrémités, sans effet |
| Pastilles « Catégorie à l'ajout » | Définissent les catégories des prochaines photos téléversées |
| Glisser-déposer / « Choisir des fichiers » | Ajoute des photos. Dans le prototype, puise dans une liste locale de 4 fichiers puis n'ajoute plus rien |

**Transitions :** `opacity .16s ease` (voile) et `background .15s ease` (zone de dépôt).
Rien d'autre.

**Responsive.** Vue applicative fluide : `max-width` plutôt que `width`, pistes `minmax(0,1fr)`,
aucune hauteur fixe. Sous ~900px, l'aside passe sous la grille ; garder la zone de dépôt en
premier dans l'ordre empilé. Le voile de survol n'existe pas au tactile : prévoir les actions de
carte (↑, ↓, Supprimer) dans un menu accessible au tap.

**Accessibilité.** Cibles ≥ 44px au tactile (la case de 24px et les flèches de 30px doivent
grossir). Les pastilles de catégorie portent `aria-pressed`. Les onglets de filtre suivent le
motif tablist du codebase. La sélection est signalée par la bordure **et** par la coche — jamais
par la seule couleur.

---

## State Management

État de l'écran :

```
photos   : Photo[]            // id, nom, url, poids, cats: ('portrait'|'boudoir')[], ordre = index
view     : 'all' | 'portrait' | 'boudoir' | 'none'
selected : Set<photoId>
newCats  : ('portrait'|'boudoir')[]   // catégories appliquées aux prochains ajouts
dragging : boolean
```

**L'ordre est l'index dans le tableau `photos`.** En production, persister un champ `position`
entier et réindexer côté serveur après chaque déplacement ; le numéro affiché est
`index + 1` sur deux chiffres.

**À faire en production, absent du prototype :**
- persister chaque mutation (ajout, catégorie, ordre, suppression) immédiatement, avec debounce
  sur les déplacements successifs ;
- afficher la progression d'upload et gérer les échecs par fichier ;
- invalider le cache de la page `/portfolio` après toute modification ;
- avertir avant de supprimer une photo également utilisée ailleurs (page d'accueil, services) si
  le modèle le permet.

---

## Assets

- **Logo.** Aucune image : monogramme encadré codé (Italiana + filet). Reprendre le composant React
  existant du site.
- **Polices.** Google Fonts, sous-ensemble latin : Jost 300–600, Italiana 400, Cormorant Garamond
  300 italique.
- **Photos.** Démonstration seulement, issues de `uploads/portraits/` et `uploads/boudoir/` du
  projet de design. Aucune ne doit être embarquée en production.
- **Icônes.** Glyphes texte (`✓`, `↑`, `↓`). À remplacer par les icônes du codebase.

## Files

| Fichier | Contenu |
|---|---|
| `Admin Portfolio.dc.html` | L'écran d'administration du portfolio |
| `support.js` | Runtime du prototype. Aucune valeur pour l'implémentation |

Ouvrir le `.dc.html` directement dans un navigateur pour voir le comportement réel. Les chemins des
photos pointent vers `uploads/` du projet de design ; hors de ce projet les images ne se chargeront
pas — la mise en page et les interactions restent intactes.

## Questions ouvertes

1. **Catégories en dur.** « Portrait » et « Boudoir » sont figées dans le design. Si Véronique doit
   pouvoir en créer (couple, mariage…), la barre d'onglets et les pastilles doivent devenir
   dynamiques, et il faudra un écran de gestion des catégories.
2. **Ordre par catégorie.** Il n'existe qu'un seul ordre global. Si la page publique doit ordonner
   Portrait et Boudoir différemment, il faut une position par catégorie — décision à prendre avant
   implémentation.
3. **Glisser-déposer pour réordonner.** Les flèches déplacent d'un cran ; déplacer une photo de la
   fin vers le début demande beaucoup de clics. Un tri par glisser-déposer est le complément
   naturel.
4. **Photo mise en avant.** La page publique met-elle une photo en tête (couverture de section) ?
   Aucun mécanisme ici, contrairement à la page Séance qui a une couverture.
5. **Recadrage.** La grille publique impose-t-elle un format ? Si oui, prévoir un point de recadrage
   par photo, les fichiers sources n'ayant pas tous le même ratio.
