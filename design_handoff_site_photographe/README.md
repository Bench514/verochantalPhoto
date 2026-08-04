# Handoff: Site web — Véronique Chantal Photo

## Overview
Site vitrine pour une photographe freelance spécialisée en portrait personnalisé et photographie boudoir (domaine prévu : veroniquechantalphoto.ca). Le site compte 6 pages : Accueil, Portfolio (avec filtre Portrait/Boudoir), Services & forfaits, Déroulement d'une séance, Bio, Contact. Direction visuelle : monochrome chaud, feutré, intimiste, non intimidant — beaucoup d'espace laissé aux photos.

## About the Design Files
The files in this bundle are **design references built as HTML prototypes** (Design Components — a custom in-house format using a `<script src="./support.js">` runtime, `<image-slot>` custom elements as photo placeholders, and a shared `SiteNav` component). They are **not production code to copy directly**. The task is to **recreate these designs in the target codebase's actual stack** (plain HTML/CSS/JS, a static site generator, React, etc. — whichever the project uses, or the most appropriate lightweight choice if nothing exists yet), using this README + the HTML files as the visual/behavioral spec.

Things that are prototype-only scaffolding and should NOT be ported as-is:
- `<script src="./support.js"></script>` and the `<x-dc>` wrapper tag — these are the prototyping runtime, not needed in production.
- `<image-slot>` — a drag-and-drop placeholder custom element used only for mocking up photo placement in this tool. In production, replace with normal `<img>` tags (or `<picture>`/responsive image components) pointing at the final optimized photo assets. The `src="uploads/..."` attribute on each `<image-slot>` tells you exactly which provided photo goes in which spot.
- `<dc-import name="SiteNav" ...>` — replace with however the target codebase shares a header/nav component (partial, React component, etc.). The full nav markup/logic is documented below so it can be rebuilt directly.

## Fidelity
**High-fidelity.** Colors, typography, spacing, and copy are final/intentional (copy on the Bio page is a draft the client should personalize). Recreate pixel-for-pixel using the codebase's own component patterns.

## Design Tokens

**Colors**
- Background (primary): `#f7f2ea` — warm pale ivory
- Background (alternate sections / cards): `#f1e9dc`
- Text (primary): `#3c3531`
- Text (muted/secondary): `#8a7e6e`
- Accent — gold: `#b8915a` (primary accent: links, active states, buttons, numerals)
- Accent — velvety purple: `#6b4a5c` (secondary accent: "populaire" highlight, used sparingly)
- Dark surface (footer banners, CTA sections): background `#3c3531`, text `#f7f2ea`, muted text on dark `#cfc4b4`
- Borders (light): `#e1d6c4`

**Typography**
- Body / UI / headings: **Jost** (Google Font), weights 300, 400, 500, 600
- Signature / accent / numerals: **Caveat** (Google Font), weight 600 — used only for: the "Véronique Chantal" logo/signature, page-accent headings (e.g. "Travailler avec moi"), and decorative numerals (steps 1/2/3)
- Base body size ~14-15px, line-height 1.65-1.8, weight 300 for paragraph copy
- Headings: clamp()-based responsive sizing, e.g. `clamp(28px,3.4vw,40px)` for page titles, `clamp(24px,2.8vw,32px)` for section titles

**Spacing**
- Page horizontal padding: `6vw` on all pages
- Section vertical padding: 72-96px
- Card padding: 30-40px
- Common gaps: 16px (tight rows), 24px (cards), 40-60px (two-column layouts)

**Radius / borders**
- Buttons: pill, `border-radius: 18-24px`
- Cards / images: `4-10px`
- Borders: `1px solid #e1d6c4` (default), `1px solid #6b4a5c` (highlighted/"populaire" card)

**Shadows**: none used — the design is flat, relying on color and whitespace rather than elevation.

## Shared component: Site Nav
Appears on every page. Two variants:
- **Solid** (default): `background:#f7f2ea`, `border-bottom:1px solid #e6dcc8`, text `#3c3531` / muted `#8a7e6e`, used on Portfolio/Services/Déroulement/Bio/Contact.
- **Transparent/overlay** (Accueil hero only): `position:absolute`, no background, white/cream text (`#f8f3ea`) with `text-shadow:0 1px 6px rgba(0,0,0,.45)` for legibility over the photo.

Layout: flex row, `justify-content:space-between`, `padding:18-22px 5vw`. Left: signature wordmark "Véronique Chantal" in Caveat 600, ~20-26px, links to Accueil. Right: flex row of 6 links (Accueil, Portfolio, Services, Déroulement, Bio, Contact), 13px, letter-spacing .04em.

Active-link state:
- Solid variant: active link colored gold `#b8915a` with a `1px solid #b8915a` bottom border.
- Transparent variant: active link is **white/cream, bold (600)** with the same gold bottom border — gold text alone was tested and found too low-contrast against photos, so the active indicator is the underline + weight, not a color change, in this variant.

## Screens / Views

### 1. Accueil (`index.dc.html`)
**Purpose**: Landing page — establish mood, funnel to Portfolio/Services/Déroulement/Contact.

**Layout (top to bottom)**:
1. **Hero** — `position:relative`, `height:92vh` (`min-height:600px`), full-bleed cover photo. A dark gradient scrim overlays it: `linear-gradient(to bottom, rgba(35,28,18,.5) 0%, rgba(35,28,18,0) 28%, rgba(35,28,18,0) 62%, rgba(35,28,18,.55) 100%)` (darkens top for nav legibility and bottom for CTA legibility). Nav (transparent variant) is absolutely positioned at the top. Centered vertically: signature wordmark in Caveat 600, `clamp(40px,7vw,68px)`, white, with a soft text-shadow; below it a one-line tagline in Jost 300, `clamp(14px,1.6vw,18px)`, color `#f3ead9`. Near the bottom (48px from bottom, centered): a pill CTA button, outline style (`1px solid #f7f2ea`, transparent fill, white text), "Voir le portfolio →", links to Portfolio.
2. **Bio teaser** — max-width 1100px centered, flex row (wraps on narrow viewports), 56px gap. Left: circular photo, 200×200px. Right: small gold uppercase label "Bonjour" (13px, letter-spacing .1em), a 1-paragraph intro (Jost 300, `clamp(17px,2vw,21px)`, max-width 560px), then a gold underlined text link "En savoir plus sur moi →" to Bio.
3. **Portfolio teaser** — edge-to-edge 3-column image grid (`grid-template-columns:1fr 1fr 1fr`, `gap:3px`, each cell 380px tall, `object-fit:cover`). A gradient bar overlays the top 110px (`linear-gradient(to bottom, rgba(35,28,18,.55), rgba(35,28,18,0))`) containing, in a flex row: "Portfolio" heading (white, `clamp(22px,2.6vw,30px)`) on the left and a "Voir tout →" link (cream, underlined) on the right. Whole section links conceptually to the Portfolio page (heading/link click through).
4. **Services teaser** — background `#f1e9dc`, centered heading "Services & forfaits", then 3 cards in a wrapping flex row (`gap:24px`, each `min-width:240px max-width:320px`, `background:#f7f2ea`, `border-radius:6px`, `padding:34px 28px`, centered text): Portrait classique (dès 250 $), Séance boudoir (dès 350 $, this card has a `1px solid #6b4a5c` border and a small pill badge "Populaire" in purple), Forfait duo (dès 450 $). Below the cards: a centered text link "Voir tous les forfaits →" to Services.
5. **Déroulement teaser** — centered heading "Déroulement d'une séance", then 3 numbered mini-steps in a flex row (equal width, centered text): each has a large Caveat-600 numeral in gold (~34px) and a short line of body copy. Below: centered link "Voir le déroulement complet →" to Déroulement.
6. **Contact CTA banner** — full-width, dark background `#3c3531`, cream text, centered: heading "Prête à vivre l'expérience?", a muted-cream supporting line, then two pill buttons side by side: solid gold "Réserver via Calendly" (external link, placeholder href) and outline cream "Envoyer un message" (links to Contact).
7. **Footer** — background `#f1e9dc`, max-width 1100px centered, flex row (wraps): left = signature wordmark + domain text; middle = 5 nav text links (muted `#8a7e6e`); right = 2 empty circular placeholders (32×32px outline circles) reserved for social icons. Below, a hairline border and small copyright line "© 2026 Véronique Chantal Photo".

**Photos used** (already placed in the prototype, paths relative to project root):
- Hero: `uploads/portraits/_MG_0780.jpg`
- Bio teaser avatar: **intentionally left empty** — meant to be Véronique's own headshot, not yet supplied
- Portfolio teaser (3 images): `uploads/portraits/IMG_3268.jpg`, `uploads/boudoir/_B6A6508.jpg`, `uploads/portraits/_B6A0863.jpg`

### 2. Portfolio (`portfolio.dc.html`)
**Purpose**: Browse the full body of work, filterable by category.

**Layout**:
- Nav (solid variant, active = Portfolio).
- Centered header block: title "Portfolio" (`clamp(28px,3.4vw,40px)`), one-line muted intro, then a **segmented filter control**: pill-shaped container (`border:1px solid #e1d6c4`, `border-radius:24px`, overflow hidden), 3 segments "Tous / Portrait / Boudoir" (each `padding:9px 22px`, 12px text). The active segment has `background:#b8915a` and white text; inactive segments are transparent with muted text.
- Below: a CSS grid gallery, max-width 1280px, `grid-template-columns:repeat(3,1fr)`, `grid-auto-rows:200px`, `gap:8px`. Some images span 2 rows (`grid-row:span 2`) to create a masonry-like rhythm — roughly every 3rd–4th item is "tall". 12 photos total alternating category portrait/boudoir.

**Interaction (must be reimplemented, not just visual)**: Clicking a filter segment filters the grid to show only items of that category (or all). This is client-side state — no page reload. In the prototype this is a simple array `.filter()` re-render; implement equivalently (React state, vanilla JS class toggling, etc.).

**Photo → category → "tall" mapping used in the prototype** (id : category : tall? : source file):
1. portrait, tall, `uploads/portraits/_MG_0780.jpg`
2. boudoir, `uploads/boudoir/_B6A6508.jpg`
3. portrait, `uploads/portraits/IMG_3268.jpg`
4. boudoir, tall, `uploads/boudoir/_B6A3891.jpg`
5. portrait, `uploads/portraits/_MG_9814.jpg`
6. boudoir, `uploads/boudoir/_B6A2016.jpg`
7. portrait, tall, `uploads/portraits/_B6A4896.jpg`
8. boudoir, `uploads/boudoir/_B6A6786.jpg`
9. portrait, `uploads/portraits/_B6A0863.jpg`
10. boudoir, tall, `uploads/boudoir/_B6A3403.jpg`
11. portrait, `uploads/portraits/_B6A3213.jpg`
12. boudoir, `uploads/boudoir/_MG_9890.jpg`

### 3. Services & forfaits (`services.dc.html`)
**Purpose**: Detail the 3 packages and drive bookings.

**Layout**:
- Nav (solid, active = Services).
- Centered header: title + one-line intro (mentions consultation + private gallery included with every package).
- 3 pricing cards, flex row wrapping, centered, each `min-width:260px max-width:340px`, `border-radius:8px`, `padding:38px 30px`, flex column with the price/CTA pinned to the bottom (`margin-top:auto`):
  - **Portrait classique** — bg `#f1e9dc`, no border. 1h, 2 tenues, 15 photos retouchées, galerie privée. Price "dès 250 $" in gold. Outline button "Réserver".
  - **Séance boudoir** — bg `#f7f2ea`, `1px solid #6b4a5c` border, a centered pill badge "Populaire" (purple bg, cream text) overlapping the top edge (`top:-12px`). 1h30, accompagnement pose & style, 20 photos, galerie confidentielle. Price "dès 350 $" in purple. Solid purple button "Réserver".
  - **Forfait duo** — bg `#f1e9dc`, no border. 1h30, 2 personnes, 25 photos, galerie privée. Price "dès 450 $" in gold. Outline button "Réserver".
- Below the cards: centered muted note "Besoin de quelque chose de différent? [Écris-moi pour un forfait personnalisé →]" (gold link to Contact).
- Dark CTA banner (same pattern as Accueil): "Prête à choisir ton forfait?" + solid gold Calendly button.
- Footer (same as Accueil, minus "Services" in the link list since we're on that page).

### 4. Déroulement d'une séance (`deroulement.dc.html`)
**Purpose**: Walk through the client journey end to end ("Travailler avec moi").

**Layout**:
- Nav (solid, active = Déroulement).
- Centered header: title "Déroulement d'une séance", a Caveat-600 gold subtitle "Travailler avec moi", one-line intro.
- 5 alternating editorial rows, max-width 1100px, each a flex row with ~48px gap and ~80px vertical margin between rows, alternating image-left/text-right and text-left/image-right (`flex-wrap:wrap-reverse` on the reversed rows so mobile order stays text-then-image consistently — verify intended mobile order with design before assuming):
  1. **Consultation** (image left) — "On discute par message ou en appel de ta vision..."
  2. **Préparation** (text left) — "Choix du lieu, des tenues et de l'ambiance souhaitée..."
  3. **La séance** (image left) — "On avance à ton rythme, avec de la musique..."
  4. **Sélection** (text left) — "Tu reçois une galerie privée en ligne..."
  5. **Livraison** (image left) — "Tes photos retouchées te sont livrées en haute résolution..."
  Each step heading is Caveat 600, ~30px, gold, formatted "N. Titre"; each image is 300px tall, full width of its half.
- Dark CTA banner: "Prête à commencer?" + two buttons (gold solid Calendly + outline cream "Envoyer un message").
- Footer (standard).

**Photos used**: `uploads/portraits/_B6A0927.jpg` (consultation), `uploads/boudoir/_MG_9890.jpg` (préparation), `uploads/portraits/_MG_9814.jpg` (séance), `uploads/portraits/_B6A3213.jpg` (sélection), `uploads/portraits/EC7251E3-1179-4FBC-B63D-6AEA6D372D17_1_105_c.jpeg` (livraison).

### 5. Bio (`bio.dc.html`)
**Purpose**: Personal, warm introduction to build trust.

**Layout**:
- Nav (solid, active = Bio).
- Top section, max-width 1100px, flex row, 60px gap: left = large portrait photo (`max-width:420px`, `height:520px`, `border-radius:10px` — **left empty intentionally**, meant to be Véronique's own photo); right = Caveat-600 36px greeting "Bonjour, moi c'est Véronique", gold uppercase label "Photographe portrait & boudoir", then 3 short narrative paragraphs (Jost 300, 15px, line-height 1.8) — draft copy, to be personalized by the client — ending with an outline pill button "Réservons une séance →" to Contact.
- Values strip — bg `#f1e9dc`, 3 centered columns ("Douceur", "Authenticité", "Confidentialité"), each a Caveat-600 24px purple heading + one short supporting line.
- Footer (standard, on the same `#f1e9dc` background as the values strip above it).

### 6. Contact (`contact.dc.html`)
**Purpose**: Convert — direct contact info + booking link + a message form.

**Layout**:
- Nav (solid, active = Contact).
- Two-column layout, max-width 1100px, flex row, 64px gap:
  - **Left**: title "Contact", intro line (mentions 1-2 day response time), then labeled blocks for Courriel and Téléphone (12px gold uppercase label + 15px value), a solid dark pill button "Réserver directement via Calendly →", and 2 empty circular social-icon placeholders (34×34px outline).
  - **Right**: a card (`background:#f1e9dc`, `border-radius:8px`, `padding:40px 36px`) containing a simple form: Nom (text), Courriel (email), Type de séance (select: Portrait classique / Séance boudoir / Forfait duo / Je ne sais pas encore), Message (textarea, 5 rows), and a solid gold pill submit "Envoyer le message". All fields: `border:1px solid #e1d6c4`, `border-radius:6px`, `padding:11px 14px`, `background:#f7f2ea`.
- Footer (standard).

**Note**: the form has no submit handler wired up in the prototype — needs real form handling (validation + submission endpoint) in production.

## Interactions & Behavior Summary
- **Portfolio filter** (Tous/Portrait/Boudoir): client-side toggle, no page reload — see Portfolio section above.
- All nav links and most body links are plain anchor navigation between the 6 pages (no SPA routing in the prototype).
- No other JS-driven interactions (no carousels, modals, or animations) — the design relies on photography and whitespace, not motion.
- **Responsive behavior**: built fluidly with `%`/`vw` padding, `flex-wrap`, and `clamp()` type — there are no explicit breakpoints, so verify/tighten mobile behavior (especially the hero text sizing and the alternating image/text rows on Déroulement) when porting.

## Assets
All photos are real client-provided photography (not stock/placeholder), located in `uploads/portraits/` and `uploads/boudoir/` in this bundle. Two photo slots were intentionally left empty pending Véronique's own headshot: the small circular avatar on the Accueil bio teaser, and the large portrait on the Bio page. The signature wordmark "Véronique Chantal" is plain text in the Caveat font — there is no logo file.

## Files in this bundle
- `index.dc.html` — Accueil
- `portfolio.dc.html` — Portfolio (with working filter)
- `services.dc.html` — Services & forfaits
- `deroulement.dc.html` — Déroulement d'une séance
- `bio.dc.html` — Bio
- `contact.dc.html` — Contact
- `SiteNav.dc.html` — shared nav component referenced by every page
- `image-slot.js`, `support.js` — prototyping runtime files (only needed to view the `.dc.html` files in a browser; not for production)
- `uploads/portraits/` and `uploads/boudoir/` — the source photos referenced by `src=` attributes above

Open any `.dc.html` file in a browser to see it render (it self-loads its own runtime). To read the markup/styles, just open the file in a text editor — all styling is inline CSS (no external stylesheet), so each page is self-contained and easy to scan top to bottom.
