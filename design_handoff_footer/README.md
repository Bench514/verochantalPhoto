# Handoff — Footer du site

Un seul livrable : le footer tel que validé. Rien d'autre de la page n'est inclus.

## Fichiers
- `footer.html` — page autonome contenant uniquement le footer (polices chargées, responsive).
- `footer.snippet.html` — le markup du footer seul, à coller dans un gabarit existant.

## Structure
Rangée à largeur max 1100px, `justify-content:space-between` :
1. **Bloc marque** (gauche) — deux colonnes côte à côte, tout aligné à gauche :
   - le monogramme encadré (colonne seule),
   - le bloc texte : signature, PHOTOGRAPHE, Boudoir · Portrait · Couple, URL.
2. **Navigation** (droite) — 5 liens en majuscules.
3. **Barre copyright** — séparée par un filet 1px, sous la rangée.

## Monogramme — proportions
Le cadre du footer est une homothétie ×2,7 du logo de l'entête. Toutes les valeurs sont liées ; si la taille change, multiplier chacune par le même facteur.

| Élément | Entête | Footer (×2,7) |
|---|---|---|
| Bordure | 1px | 1px (non mise à l'échelle, trait de contour) |
| Padding | 9px 13px 8px | 24px 35px 22px |
| Taille « VC » | 22px | 59px |
| Gap VC / filet | 7px | 19px |
| Filet (L × H) | 18 × 1px | 49 × 3px |

Le filet est à 3px et non 1px : à cette échelle un trait de 1px paraît optiquement trop fin par rapport au logo d'origine.

Le cadre n'a **ni largeur ni hauteur fixée** — sa taille vient du padding et du texte, ce qui garantit le ratio. Ne pas utiliser `width`/`height`/`aspect-ratio` dessus.

## Tokens
- Fond `#F7F6F4` · encre `#191816` · texte secondaire `#6f6d68` · filets `#dddad4`
- Polices : Italiana (monogramme), Cormorant Garamond italic 300 (signature), Jost 300 (reste)
- Rayon des angles : 0 (le cadre du logo est un rectangle net)

## Responsive
Sous ~760px, le bloc marque passe en colonne (logo au-dessus du texte), toujours aligné à gauche. La nav passe à la ligne via `flex-wrap`.

## À brancher
- Les `href` de la nav sont des chemins de placeholder (`/portfolio`, `/services`, …) — à remplacer par les vraies routes.
- L'année du copyright est en dur (2026) — à rendre dynamique si souhaité.
- Le monogramme est du texte en Italiana, pas une image. Si un fichier SVG du logo existe, le substituer en conservant les proportions du tableau ci-dessus.
