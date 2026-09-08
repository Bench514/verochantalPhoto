# Handoff : logo Véro Chantal Photographe

## Overview
Identité typographique pour Véro Chantal, photographe (boudoir, portrait, couple). Le logo est un **lockup en deux parties** : un monogramme « VC » dans un cadre filet, et le nom en italique. Quatre planches validées : deux en bichromie prune (2A, 2B) et deux en monochrome (3A, 3B).

Livrables à intégrer sur le site : le lockup complet (pied de page, page d'accueil), le monogramme encadré seul (en-tête, favicon, avatar), et le filigrane sur photo.

## About the Design Files
Les fichiers de ce dossier sont des **références de design réalisées en HTML** — des maquettes qui montrent l'apparence et les proportions voulues, pas du code de production à copier tel quel. Le travail consiste à **recréer ces designs dans l'environnement existant du site** (React, Astro, WordPress, Squarespace, etc.) en suivant ses conventions : composants, tokens, feuilles de style. S'il n'existe pas encore d'environnement, choisir le framework adapté au projet et y implémenter les designs.

Le logo étant purement typographique, l'intégration idéale est **un composant `<Logo>`** paramétré (variante, taille), pas une image — sauf pour les usages où un fichier est requis (favicon, Open Graph, e-mail), où il faut exporter un SVG/PNG à partir du même lockup.

## Fidelity
**High-fidelity.** Couleurs, familles typographiques, tailles, interlettrage et proportions sont définitifs. Reproduire fidèlement ; les tailles en px des maquettes sont des rapports à respecter, pas des valeurs absolues à toutes les échelles.

## Typographie
Deux familles Google Fonts, plus une sans-serif pour le texte courant :

| Rôle | Famille | Graisse / style |
|---|---|---|
| Monogramme « VC » | **Italiana** | 400 |
| Nom « Véro Chantal » | **Cormorant Garamond** | 300, *italique* |
| Baselines, texte courant | **Jost** | 300 / 400 / 500 |

Import :
```html
<link href="https://fonts.googleapis.com/css2?family=Italiana&family=Jost:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap" rel="stylesheet">
```

Le logo dépend de ces polices : les charger en `font-display: swap` avec preconnect, ou auto-héberger les deux fichiers (Italiana 400, Cormorant Garamond 300 italic) pour éviter tout FOUT sur le lockup de l'en-tête. Si le logo doit apparaître avant le chargement des polices, servir un SVG avec les glyphes vectorisés.

## Anatomie du lockup

### 1. Monogramme encadré (le « carré »)
- Cadre : `border: 1px solid <encre à 40 % d'opacité>`, aucun arrondi.
- Padding intérieur : `20px 28px 18px` pour un « VC » à 46px (rapport ≈ 0,43 / 0,61 / 0,39 de la taille de police).
- Contenu, empilé et centré, `gap: 9px` :
  - « VC » — Italiana, `letter-spacing: .08em`, `line-height: 1`.
  - Un filet horizontal : `height: 1px; width: 38px` (≈ 0,83 × la taille du VC), même couleur que le cadre.
- Le monogramme est autonome : utilisable seul en en-tête, avatar, tampon, filigrane.

### 2. Nom
- « Véro Chantal » — Cormorant Garamond 300 italique, `line-height: 1`, pas d'interlettrage ajouté.
- « PHOTOGRAPHE » — Jost 300, `text-transform: uppercase`, `letter-spacing: .5em`, `padding-left: .5em` (compense l'interlettrage sur la dernière lettre pour garder l'optique centrée). Taille ≈ 0,17 × celle du nom.
- « BOUDOIR · PORTRAIT · COUPLE » — Jost 300, uppercase, `letter-spacing: .3em`, `padding-left: .3em`. Taille ≈ 0,15 × celle du nom. Ligne optionnelle : à retirer aux petites tailles.
- Séparateurs : point médian `·` (U+00B7), entouré d'espaces.

### 3. Lockup vertical complet
Colonne centrée : monogramme, `gap: 22–26px`, puis le bloc nom (empilé, `gap: 11px`).

### 4. Lockup horizontal (carte de visite, en-tête)
`display: flex; align-items: center; gap: 22px` — monogramme encadré à gauche (VC ≈ 26px, padding `10px 12px`, sans le filet), à droite le nom (≈ 27px) au-dessus de la ligne de services (9px, `.26em`). Mettre `white-space: nowrap` sur les deux lignes de texte et `min-width: 0` sur leur conteneur : sans cela le nom se casse en deux lignes dans les colonnes étroites.

## Variantes (les 4 planches)

| Code | Nom | Fond | Encre principale | Encre secondaire |
|---|---|---|---|---|
| **2A** | Ivoire, encre prune | `#FBF4EE` | `#4A2F3A` (monogramme), `#3B322D` (nom) | `#6B5E56` baseline, `#7A6E66` services |
| **2B** | Prune plein, lettrage rosé | `#4A2F3A` | `#F0E2E0` (monogramme), `#F3E4DC` (nom) | `#D9C4C2` baseline, `#C9B0AE` services |
| **3A** | Monochrome positif | `#F7F6F4` | `#1C1A19` | `#4A4642` baseline, `#6E6863` services |
| **3B** | Monochrome négatif | `#1C1A19` | `#F7F6F4` | `#BDB8B2` baseline, `#A39D97` services |

Filet du cadre et trait : encre principale à 40 % d'opacité sur fond clair, 50 % sur fond sombre.

Règle d'usage : 2A est la version principale (site, papeterie, album) ; 2B pour les fonds pleins et les réseaux sociaux ; 3A pour tampon, gravure et impression une couleur ; 3B pour l'avatar et le filigrane sur photo sombre.

## Déclinaisons à prévoir dans le code
- **En-tête de site** — monogramme encadré seul, VC à 20–24px, aligné à gauche. Lien vers l'accueil, `aria-label="Véro Chantal Photographe — accueil"`, et le texte « VC » accessible (pas une image sans alternative).
- **Avatar rond** — `border-radius: 50%`, fond en aplat (encre principale), monogramme en négatif dans un cadre carré de 82px pour un disque de 160px (≈ 51 %), VC à 34px, sans filet.
- **Filigrane sur photo** — nom seul en Cormorant italique blanc `#FFFFFF`, `text-shadow: 0 1px 6px rgba(0,0,0,.4)`, en bas à droite, marge de 20px. Sur fond clair, préférer le monogramme encadré en blanc.
- **Carte de visite** — lockup horizontal, ratio 1,75.
- **Favicon** — le VC seul, sans cadre (le filet à 1px disparaît à 32px et en dessous).

## Zone de protection et tailles minimales
- Marge de respect autour du lockup : la hauteur du « V » sur les quatre côtés.
- Lockup vertical complet : ne pas descendre sous 44px pour le nom ; en dessous, retirer la ligne de services, puis la baseline.
- Monogramme encadré : minimum 20px pour le VC. Sous cette taille, utiliser le VC sans cadre.
- Ne jamais étirer, incliner, ajouter d'ombre portée, de dégradé ou de contour au lockup ; ne pas recolorer le nom et le monogramme dans deux teintes différentes hors des paires du tableau ci-dessus.

## Interactions & Behavior
Le logo n'a qu'un seul état interactif, en en-tête : au survol du lien, faire passer l'opacité de `1` à `0.7` sur `180ms ease`. Pas de changement de couleur, pas de déplacement. Focus visible : contour de 2px dans l'encre principale, `outline-offset: 4px`.

Aucun état de chargement ni gestion d'erreur : le logo est statique.

Responsive : sous 768px, l'en-tête garde le monogramme seul ; le lockup vertical complet, s'il est présent en pied de page, passe la taille du nom de 52px à 34px et conserve les deux baselines.

## State Management
Aucun. Un composant de présentation, dont les seules entrées sont la variante (`2a | 2b | 3a | 3b`), la forme (`lockup | monogramme | horizontal | avatar`) et la taille.

## Design Tokens
```
/* Bichromie */
--vc-prune:        #4A2F3A
--vc-ivoire:       #FBF4EE
--vc-encre:        #3B322D
--vc-rose:         #F3E4DC
--vc-rose-clair:   #F0E2E0
--vc-sable:        #EFE0D8
--vc-baseline:     #6B5E56
--vc-services:     #7A6E66

/* Monochrome */
--vc-noir:         #1C1A19
--vc-blanc-casse:  #F7F6F4
--vc-gris-mid:     #4A4642
--vc-gris-clair:   #BDB8B2

/* Interlettrage */
--vc-track-mono:   .08em   /* VC */
--vc-track-base:   .5em    /* PHOTOGRAPHE */
--vc-track-serv:   .3em    /* BOUDOIR · PORTRAIT · COUPLE */

/* Rapports typographiques (base = taille du nom) */
baseline  = .17 × nom
services  = .15 × nom
VC (lockup vertical) ≈ .79 × nom

/* Filets */
border: 1px solid  (encre à 40 % sur fond clair, 50 % sur fond sombre)
rule width = .83 × taille du VC

/* Rayons, ombres */
border-radius: 0  partout, sauf l'avatar (50 %)
box-shadow: aucune, sauf le filigrane (text-shadow 0 1px 6px rgba(0,0,0,.4))
```

## Assets
Aucune image. Le logo est entièrement typographique : deux polices Google Fonts (Italiana, Cormorant Garamond) et une sans-serif (Jost). Les zones rayées des maquettes sont des **emplacements photo** — remplacer par les photos de la cliente.

Pour les usages qui exigent un fichier (favicon, Open Graph, signature e-mail, imprimeur), exporter un SVG avec les glyphes convertis en courbes à partir de la planche correspondante.

## Files
- `Planches Vero Chantal.dc.html` — le document de présentation : couverture avec les intentions de design, puis une planche par variante (3A, 3B, 2A, 2B) avec lockup, avatar et carte de visite. **La référence principale.**
- `Logo Vero Chantal.dc.html` — l'historique des explorations (tours 1 à 3), utile pour comprendre les arbitrages ; les tours 1 et 2 ne sont pas les versions finales.
- `doc-page.js` — moteur de mise en page paginée utilisé par le document de présentation. Aucun rapport avec le logo, ne pas porter dans le site.

Les deux fichiers `.dc.html` s'ouvrent directement dans un navigateur.
