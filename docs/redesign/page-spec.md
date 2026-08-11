# Page Spec - Kytka z Beskyd Homepage Redesign

**Task:** 3 (Designer)
**Owns:** the section-by-section component spec and the final image-to-slot mapping.
**Consumed by:** Task 4 (Implementor) - follow this exactly for component reuse decisions, layout classes, and which filename goes in which `<img>`.

Inputs read in full: `docs/redesign/content-contract.md`, `docs/redesign/design-system.md`, `public/flowers-catalog.json` (`layout_slots`, `slot_candidates`, `images`), the mockup at `public/4225e624-95c5-49f9-8f9f-478c8345f397.png` (viewed directly), and every component listed in the plan's Task 3 Interfaces (`Section.astro`, `Hero.astro`, `Grid.astro`, `Card.astro`, `Heading.astro`, `Button.astro`, `Badge.astro`, `WideImage.astro`).

Every filename in this document was re-verified against a live `ls public/flowers/` on 2026-08-11 (23 files, see Section 5). None of the filenames in the plan's own worked example were assumed - all were re-derived from the current `flowers-catalog.json`.

---

## 0. Data-quality note on the catalog itself

`slot_candidates.category_susene` lists `"e65948e4-259b-4d0a-ab11-3febe5d7f817 (1).jpeg"` alongside `"e65948e4-259b-4d0a-ab11-3febe5d7f817.jpeg"`. The `(1)` file no longer exists on disk - the `images` array's single `e65948e4...` entry has `"duplicate_of": "e65948e4-259b-4d0a-ab11-3febe5d7f817 (1).jpeg"`, confirming the duplicate was already removed from `public/flowers/` and only stale metadata remains in `slot_candidates`. **The `(1)` filename is never used anywhere in this spec.** Task 4 should treat `slot_candidates` as advisory ranking data only and always resolve against the `images` array / `ls public/flowers/` for the real filename.

---

## 1. Component reuse decisions

Checked actual current usage with `grep -rl "import <Name> from" src/` before deciding what's safe to keep using:

| Component | Currently used in | Decision for the new homepage | Why |
|---|---|---|---|
| `Section.astro` | all 7 pages | **Reuse as-is.** `<Section id="..." class="bg-...">` for every top-level band (hero, category grid, about, portfolio, and optionally header/footer if they want the same container). It's a pure `id` + padded `container` wrapper with no colors/fonts baked in, so it composes cleanly with the new tokens. | Generic, already the site-wide convention, zero risk. |
| `Hero.astro` | `about-us.astro`, `index.astro` | **Reuse for both the Hero section and the About-me section.** Despite the name, it has no hero-specific styling - it's a generic `grid-cols-1 lg:grid-cols-2 lg:items-center` layout with two named slots, `hero-content-left` / `hero-content-right`. That is exactly the "text column + photo column" shape both Hero and About need. `about-us.astro` already reuses it the same way today, which confirms this is the intended pattern, not a hack. | Avoids a redundant near-identical component; matches existing site convention. |
| `Grid.astro` | `index.astro` only (nowhere else) | **Do not reuse.** It hardcodes exactly 3 named slots (`grid-content-1/2/3`) and `grid-cols-3`. Neither the 6-card category grid nor the 6-image portfolio grid fits 3 slots without modifying the component, and component code changes are Task 4's job, not something to mandate blindly here. Since it's only imported by the file Task 4 is rewriting anyway, dropping it has zero blast radius on other pages. | Use plain Tailwind grid markup directly in `index.astro` instead (see Sections 2.3 and 2.5). |
| `Card.astro` | not imported anywhere currently (dead code) | **Do not reuse.** It's a bare `flex flex-col gap-8 p-8 bg-white shadow` box with no photo region, no cream surface, no arrow-link slot - it doesn't resemble the mockup's category card at all. | Build the real look directly in the new `CategoryCard.astro` (Section 2.3). |
| `Heading.astro` | `gallery.astro`, `contact.astro`, `book.astro`, `index.astro` | **Do not reuse for the new sections.** It's a centered, two-title prose block; the new design needs left-aligned hero headings, a script-font "O mně ♡" with an inline SVG heart, and a centered "Moje tvorba 🌿" with an inline SVG leaf - three different shapes that don't fit one rigid centered template. Still used correctly by the untouched pages, so leaving it alone is safe. | Write heading markup per-section directly in `index.astro` using `font-display` / `font-script` tokens. |
| `Button.astro` | `about-us.astro`, `index.astro` | **Reuse as-is**, `color="red"` for filled pink CTAs (`OBJEDNAT KYTICI`, `ZOBRAZIT DALŠÍ`, `VÍCE O MNĚ`... see note below) and a new outline treatment for `PROHLÉDNOUT TVORBU`. Per `design-system.md`, `--color-brand-red` now resolves to `--color-accent-pink-deep`, so `button-red` already renders the correct rose fill with no CSS changes needed. `VÍCE O MNĚ` in the mockup is a dark olive filled button, not pink - use `color="green"` for that one (`--color-brand-green` now resolves to `--color-ink-green`). | Token re-pointing in Task 2 means this component already "just works" for the new palette. |
| `Badge.astro` | `about-us.astro`, `index.astro` | **Not used anywhere in the new homepage.** It renders a `rounded-full` pill with a ring border - the design system's handoff flags explicitly call out that buttons/chips in this design are near-rectangular, not pill-shaped, and nothing in the mockup (footer badges are icon+title+body stacked, not pills) matches this shape. | No section needs a pill badge; the footer's "badges" are a different visual pattern, built directly (Section 2.6). |
| `WideImage.astro` | `index.astro` only | **Do not reuse.** It wraps `astro:assets`' `Picture`, which requires the source image to live under `src/` for build-time optimization. All flower photos live in `public/flowers/`, so per the plan's own Task 4 Interfaces note, images must be referenced as plain `<img src="/flowers/...">` (or `<Image>`... no, plain `<img>`), not through `astro:assets`. | Using it would silently break at build time or require moving 23 photos into `src/`, which is out of scope. |

**New components to create (Task 4):**

- `src/components/CategoryCard.astro` - props exactly `{ image: string, alt: string, title: string, subtitle?: string, body: string, href: string }` (fixed by the plan's own Task 4 step, do not change), **plus** a default `<slot />` for an optional inline-SVG decorative icon rendered above the title (the mockup shows a small line-art flower/leaf glyph on each card - this must be inline SVG per the design system's handoff flags, never a font glyph). The `id` attribute for anchor targets is **not** a `CategoryCard` prop - see Section 3.
- No `PortfolioGrid.astro`. **Decision: plain markup in `index.astro`.** The portfolio grid is used exactly once, has no reusable prop surface beyond "image + alt", and Tailwind's grid utilities express a 6-image responsive grid in about four lines with no component indirection needed. Introducing a component for a single call site adds an abstraction without a second consumer - skip it (see Section 2.5 for the exact markup shape).

---

## 2. Section-by-section spec

### 2.1 Nav / Header

Reuses the existing `src/components/Header.astro` (Task 4 restyles in place - not a new component). Structural requirements, cross-referenced with `content-contract.md`'s Section 2 nav table:

- Logo: circular badge, wordmark `Kytka z Beskyd` in `font-script text-ink-green`, per the mockup's hand-drawn circle border (inline SVG or CSS border-radius circle with a thin `border-ink-green` ring - either is fine, Task 4's call).
- 8 nav items in order (`ÚVOD`, `KYTICE`, `VĚNCE A DEKORACE`, `SVATBY`, `ZAHRADY`, `OBCHOD`, `O MNĚ`, `KONTAKT`), `font-body uppercase tracking-[0.12em] text-sm text-ink-green`, hrefs exactly as `content-contract.md` Section 2 specifies (5 in-page anchors, 2 existing-page routes, 1 home route).
- Active/current nav item gets the `border-accent-pink` underline treatment (decorative only, per design-system.md - never `accent-pink` as text color).
- Cart icon (inline SVG, links to `/book` per content-contract, stopgap) and Instagram icon (inline SVG, links to the real Instagram URL, `target="_blank" rel="noopener noreferrer"`) on the far right, both `text-ink-green`.
- Mobile: existing hamburger + slide-out pattern in `Header.astro` is retained; all 8 items plus the two icons appear in the mobile panel too.
- No new component needed here; `Section.astro`'s container convention is optional for the header (Task 4's call depending on how `Header.astro` is currently structured).

### 2.2 Hero

**Component:** `<Section id="hero"><Hero> ... </Hero></Section>`, `bg-cream`.

- `hero-content-left` slot: H1 `KYTKA` / `Z BESKYD` two lines, `font-display font-bold text-ink-green tracking-[0.08em]` (per design-system.md's recommended usage); tagline `Květiny tvořené srdcem, inspirované přírodou.` in `font-script text-ink-green` (large, italic-style connected script, no letter-spacing) with an inline SVG outline heart to its right (mockup shows a small heart glyph after the tagline - matches the `♡` motif, must be SVG per handoff flag 1); bullet list `KYTICE`, `VĚNCE`, `SVATBY` / `DEKORACE`, `ZAHRADY` as two lines, bullet-separated (`·` character or a tiny inline SVG dot - a plain `·` glyph is fine, it's not one of the flagged special glyphs), `font-body uppercase tracking-[0.1em] text-ink-green`; two buttons side by side, `OBJEDNAT KYTICI` (`<Button color="red" url="#kytice">`, or `/book` - Task 4's call on which is more useful, content-contract doesn't fix this one) and `PROHLÉDNOUT TVORBU` (`<Button>` styled outline: `border border-ink-green text-ink-green bg-transparent`, url `#portfolio`).
- `hero-content-right` slot: single hero photo, `<img src="/flowers/157b55da-b44f-4e52-ae33-42be1a7b0df9.jpeg" alt="...">` per Section 4's table, `class="w-full h-full object-cover rounded-sm"` (mockup shows a very slight corner radius, not sharp corners but not heavily rounded either - matches the design system's "near-rectangular" note).
- Layout: `grid-cols-1 lg:grid-cols-2` (from `Hero.astro` itself), image stacks below text on mobile.

### 2.3 Category grid (6 cards)

**Component:** `<Section id="kategorie" class="bg-cream-alt">`, then a plain Tailwind grid (not `Grid.astro` - see Section 1) containing six `<CategoryCard>` instances.

Grid classes: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 lg:gap-4`. This stacks fully on mobile (1 col), pairs up at `sm`, three-across at `lg` (tablet/small desktop), and reaches the mockup's full 6-across only at `xl` (wide desktop) where there's enough width for six narrow cards without cramming.

Each grid cell in `index.astro` is a wrapper `<div>` around one `<CategoryCard>`; **the anchor `id` for nav targets goes on this wrapper div, not inside `CategoryCard.astro`** (keeps the component's prop contract exactly as Task 4's brief already fixed it: `image, alt, title, subtitle?, body, href`). Four of the six cards need an id (the two without a nav entry - `Květinářství v Hrádku` and `Doplňky pro váš den` - get no id):

```
<div id="kytice"><CategoryCard title="Kytice" subtitle="z čerstvých květin" body="Čerstvé, sezónní a pokaždé trochu jiné." image="/flowers/b93a5688-e6e8-4fff-832f-a70aaa3d29a9.jpeg" alt="..." href="#kytice" /></div>
<div id="vence-a-dekorace"><CategoryCard title="Sušené květiny & věnce" body="Originální dekorace, které vydrží." image="/flowers/70716e83-e783-46dc-b101-cf77095b8bf1.jpeg" alt="..." href="#vence-a-dekorace" /></div>
<div id="svatby"><CategoryCard title="Svatební floristika" body="Kytice, korsáže, výzdoba obřadů i hostiny." image="/flowers/b9f32fee-f3c2-4abb-9299-bed936e8a813.jpeg" alt="..." href="#svatby" /></div>
<div id="zahrady"><CategoryCard title="Zahrady a výsadby" body="Návrhy, osazování a péče o zahrady." image="/flowers/86fd9a45-b676-4bda-8bac-1cf22319571e.jpeg" alt="..." href="#zahrady" /></div>
<div><CategoryCard title="Květinářství v Hrádku" body="Řezané květiny, pokojovky, trvalky a drobné dárky." image="/flowers/d42669aa-56a3-47ca-8fd0-507a6c0a6a7c.jpeg" alt="..." href="/book" /></div>
<div><CategoryCard title="Doplňky pro váš den" body="Korsáže, hřebínky a další detaily." image="/flowers/16a8dc86-7d99-4e1a-a50b-01c17811688b.jpeg" alt="..." href="/book" /></div>
```

`href` for the two no-anchor cards points to `/book` (same stopgap treatment as `OBCHOD` in `content-contract.md` - no dedicated page exists yet). Exact `alt` text for every image is in Section 4's table - don't hand-write generic alt text, pull `alt_text_cs` from the catalog.

Card internal structure (for `CategoryCard.astro`, Task 4 to build): photo fills the top ~60% with a very small top corner radius, `object-cover`; below it a `bg-cream-card` body with the optional icon slot, `font-display text-ink-green` title, `font-body text-ink-body text-sm` subtitle (if present), `font-body text-ink-body` body copy, and a bottom-aligned `→` arrow link in `text-accent-pink-deep` (inline SVG per handoff flag 2, never the literal `→` character styled with a custom font).

### 2.4 About-me

**Component:** `<Section id="o-mne" class="bg-cream"><Hero> ... </Hero></Section>` (reusing the same 2-column primitive as the Hero section - see Section 1's rationale).

- `hero-content-left` slot: heading `O mně ♡` in `font-script text-ink-green` with the inline SVG heart (handoff flag 1); the four body paragraphs in `font-body text-ink-body leading-relaxed`; the highlighted sentence `Každý kus vzniká ručně a žádné dvě kytice nejsou úplně stejné.` in `text-accent-pink-deep` (this is text carrying color, so it must be `accent-pink-deep`, never plain `accent-pink` per the contrast table in `design-system.md`); button `VÍCE O MNĚ` as `<Button color="green" url="/about-us">` (dark olive fill, matches the mockup - see Section 1's Button note; links to the existing deeper `/about-us` page per content-contract.md's nav table note about the duplication).
- `hero-content-right` slot: the about photo, `<img src="/flowers/502ebd7d-ee28-4288-bf5d-bde666a90f60.jpeg" alt="...">`. **This is a flagged gap - see Section 5, item 1.** There is no real owner-portrait photo in the catalog; this is a deliberately faceless "hands at work with dried flowers" stand-in chosen specifically to avoid implying it depicts a specific person who it doesn't. Task 4 should not caption or alt-text this image in any way that claims it shows the owner.

### 2.5 Portfolio gallery

**Component:** `<Section id="portfolio" class="bg-cream-alt">`, plain Tailwind grid, no new component (see Section 1).

- Heading `Moje tvorba 🌿` centered, `font-script text-ink-green` with an inline SVG leaf glyph (handoff flag 1 - `🌿` is not in Sacramento either).
- Grid: `grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4` - 2-across on phones, 3-across on tablet, full 6-across at `lg` and up, matching the mockup's tighter, near-seamless portfolio thumbnails (smaller gap than the category grid, which has visible card chrome around each photo).
- Six `<img>` tags, each `class="w-full aspect-square object-cover"`, filenames and alt text from Section 4's table (6 distinct filenames, not reused from hero/category/about - verified in Section 4).
- Button `ZOBRAZIT DALŠÍ` centered below the grid, `<Button color="red" url="/gallery">` (existing gallery page is the only real place "more" could point to today - flag as a stopgap for `suggestions.md` since a public portfolio may eventually want its own richer view than the current `gallery.astro`).

### 2.6 Footer

Reuses the existing `src/components/Footer.astro` (Task 4 restructures in place). Structural requirements:

- Top band, `bg-blush`: 4-column (stacked on mobile) feature badges, each icon (inline SVG - a small leaf/heart/pin/handshake-style glyph matching the mockup, not a `Badge.astro` pill) + `font-display text-ink-green` title + `font-body text-ink-body text-sm` body, content from `content-contract.md` Section 1's four footer badges.
- Bottom bar, `bg-footer-dark`: phone (`config.ts` `phone.href`/`phone.label`) and email (`email.href`/`email.label`) in `text-cream`, Facebook + Instagram icon links (`text-blush`, real URLs), the script-font signature `Děkuji za vaši důvěru ♡` in `font-script text-accent-pink` (this one is decorative/large-display text on a dark background, not small body text, so `accent-pink` at `text-cream`/`footer-dark` context is acceptable per the contrast table's "large text only" allowance - if rendered smaller than ~24px, use `accent-pink-deep` instead), and the copyright line reusing the existing `© {year} {siteName}. Všechna práva vyhraná.` pattern + privacy-policy link.

---

## 3. Anchor IDs (from `content-contract.md` Section 2)

All 5 required anchor IDs are placed as follows:

| ID | Where |
|---|---|
| `kytice` | Wrapper `<div>` around category card 1 (Section 2.3) |
| `vence-a-dekorace` | Wrapper `<div>` around category card 2 (Section 2.3) |
| `svatby` | Wrapper `<div>` around category card 3 (Section 2.3) |
| `zahrady` | Wrapper `<div>` around category card 4 (Section 2.3) |
| `o-mne` | The `<Section id="o-mne">` element itself (Section 2.4) |

---

## 4. Final image-to-slot table

Resolved from `slot_candidates` by giving each slot its highest-confidence candidate first, **except** where a lower-confidence candidate in the same tier is a substantially better content match to the slot's own `content_description` / the mockup photo (each such override is called out explicitly below) - this prevents two visually-similar-but-thematically-wrong photos (e.g. a bridal portrait vs. an actual bouquet) from winning a slot on confidence alone. No filename appears twice.

| Slot | Chosen filename | Confidence | Alt text (`alt_text_cs`) | Notes |
|---|---|---|---|---|
| `hero` | `157b55da-b44f-4e52-ae33-42be1a7b0df9.jpeg` | 0.95 | Velká, svěží kytice s růžovými a bílými květy v rustikálním balení. | **Override:** top-ranked candidates were `b93a5688` (0.98) and `b9f32fee` (0.98). `b9f32fee` is a bride's portrait, not a floral arrangement, and doesn't satisfy the slot's own `content_description` ("lush, colorful floral arrangement...emphasizing freshness and abundance") despite the confidence tie - it's reserved for `category_svatebni` instead, where it's a near-perfect match. `157b55da`'s kraft-paper wrap + blurred green outdoor background is the closest holistic match to the actual mockup hero photo; `b93a5688` (also excellent) is used for `category_kytice` instead so both top bouquet photos still get used. |
| `category_kytice` | `b93a5688-e6e8-4fff-832f-a70aaa3d29a9.jpeg` | 0.98 | Bohatý a romantický květinový buket v rustikálním stylu s růžovými a bílými květy. | Highest-confidence candidate not already claimed by `hero`. |
| `category_susene` | `70716e83-e783-46dc-b101-cf77095b8bf1.jpeg` | 1.0 | Sušený květinový věnec z hnědých a zlatých suchých rostlin. | Highest confidence of any candidate in the whole catalog; no conflict. |
| `category_svatebni` | `b9f32fee-f3c2-4abb-9299-bed936e8a813.jpeg` | 0.98 | Paní v svatební šatě se dívá z okna, s květinami na okraji. | Matches mockup card 3 (bride looking away from camera) almost exactly. |
| `category_zahrady` | `86fd9a45-b676-4bda-8bac-1cf22319571e.jpeg` | n/a (gap fallback) | Rustikální buket s modrými a zlatými květy v přírodním prostředí. | **Gap - see Section 5, item 2.** `slot_candidates.category_zahrady` is empty; catalog has zero true garden/landscaping photos. This is the best available stand-in: an outdoor, natural-setting wildflower bouquet, closer to a "grown, not florist-arranged" look than any indoor/studio photo. |
| `category_rezane` | `d42669aa-56a3-47ca-8fd0-507a6c0a6a7c.jpeg` | 0.98 | Bohatá oranžová kytice slunečnic v skleněné váze. | **Gap - see Section 5, item 3.** This is genuinely the top-ranked candidate and a real cut-flowers-in-a-vase photo, but the mockup's card 5 image looks like a shop/greenhouse interior with potted plants on shelves, which no catalog photo depicts. Flagged as weak coverage even though a candidate exists. |
| `category_doplnky` | `16a8dc86-7d99-4e1a-a50b-01c17811688b.jpeg` | 0.98 | Jemný květinový korsáž z bílé růže a modrých květů na dřevě. | Tied at 0.98 with `7f8f3457`; chosen for closer visual match to the mockup's single-item hair-comb/corsage shot (rustic wood surface, one flower). `7f8f3457` used in the portfolio gallery instead. |
| `portrait_owner` | `502ebd7d-ee28-4288-bf5d-bde666a90f60.jpeg` | n/a (gap fallback) | Rustikální aranžmá z sušených modrých květin a trávy. | **Gap - see Section 5, item 1.** `slot_candidates.portrait_owner` is empty; no owner photo exists at all. Deliberately chose a faceless, hands-visible "artisan at work" photo rather than any of the catalog's other people-containing photos (a bride's face, a stitched collage), to avoid implying a specific fake identity. Do not caption this as "the owner." |
| Portfolio gallery 1 | `4ca37b28-088d-4b7c-9272-384a611304e0.jpeg` | - | Rustikální květinový okras s bohatými růžovými a červenými květy. | Fresh bouquet, pink/red/green/cream. |
| Portfolio gallery 2 | `42fe18bc-ea5a-4fe9-9158-0392bd9775c2.jpeg` | - | Rustikální sušená květinová kytice v hnědé obálce s sušenými květy. | Dried bouquet, brown/muted blue/cream/pink. |
| Portfolio gallery 3 | `55c3d768-209a-4763-a853-c2bc27177f94.jpeg` | - | Rustikální květinový dárek s bílými květy a zeleným listím. | Fresh bouquet, white/green/brown - lightest-toned of the six. |
| Portfolio gallery 4 | `18ef0981-1389-43a7-b918-2546a229fa74.jpeg` | - | Rustikální sušený květinový věnec s muchornicemi a osusíchlým listím. | Autumn wreath, landscape orientation, brown/rust/gold/deep-red - the only landscape-format image in the set, breaks up the grid rhythm. |
| Portfolio gallery 5 | `7f8f3457-17db-4f52-bf2e-1e5493235670.jpeg` | - | Oranžové a modré korsáže na kamenné ploše pro svatební doplnky. | Accessories, landscape orientation, orange/blue/yellow - only orange-dominant photo, biggest color contrast in the set. |
| Portfolio gallery 6 | `74d78256-be34-4ad7-8b51-a3d8cc7f31ba.jpeg` | - | Rustikový věnec z purpurové a modré květiny a zeleně. | Wreath, purple/blue/green/cream. |

**Variety check for the 6 portfolio images (task requirement):** categories span kytice (2), doplňky (1), sušené (3); colors span pink/red, brown/blue/pink, white/green, rust/gold/red, orange/blue/yellow, and purple/blue - no two adjacent-feeling photos share a dominant palette, and 2 of the 6 are landscape orientation against 4 portrait, which breaks up the grid visually the way the mockup's own row does. All 6 are distinct from each other and from all 8 filenames used in hero/category/about slots above (14 distinct filenames total, verified against each other by direct string comparison).

`portfolio_main` / `portfolio_gallery_1-3` catalog slot IDs are **not used 1:1** - see Section 6 for why: the mockup's "Moje tvorba" row is 6 visually uniform tiles, not a large "main" photo plus 3 small ones, so this spec treats it as 6 equal portfolio slots instead of the catalog's 4-slot naming.

---

## 5. Gap list

1. **`portrait_owner` - no owner photo exists at all.** `slot_candidates.portrait_owner` is `[]` and no image in the 23-photo catalog is tagged `category: "portret kvetinarky"`. **Fallback used:** `502ebd7d-ee28-4288-bf5d-bde666a90f60.jpeg` (a faceless hands-arranging-dried-flowers shot) in the About-me section (Section 2.4). **This needs a real photo shoot before launch** - flag for `disclaimers.md`.
2. **`category_zahrady` - no garden/landscaping photos.** `slot_candidates.category_zahrady` is `[]` and no image is tagged `category: "zahrady a vysadby"`. **Fallback used:** `86fd9a45-b676-4bda-8bac-1cf22319571e.jpeg` (an outdoor, natural-light wildflower bouquet - thematically adjacent but not actual garden/planting work) for the "Zahrady a výsadby" category card (Section 2.3). **Real garden-work photography is needed** - flag for `disclaimers.md`/`suggestions.md`.
3. **`category_rezane` - only a bouquet-in-vase photo, no shop-interior photo.** `slot_candidates.category_rezane` does have real candidates (`d42669aa` at 0.98), so this isn't a hard gap like the two above, but the mockup's own card 5 image reads as a florist-shop/greenhouse interior with shelved potted plants, which the catalog has nothing like. **Used:** `d42669aa-56a3-47ca-8fd0-507a6c0a6a7c.jpeg` (real cut flowers, in a vase - the closest available match) for "Květinářství v Hrádku" (Section 2.3). Flag as weak coverage for `disclaimers.md`.

Three gaps flagged total, matching the plan's own expectation of "at least" these three.

---

## 6. Note on the catalog's `portfolio_main` slot vs. this spec's 6-equal-tile gallery

The catalog's `layout_slots` defines `portfolio_main` plus `portfolio_gallery_1/2/3` (4 slots), and the plan's brief for Task 3 mentions "the 6 portfolio gallery images" as a fixed requirement. Looking directly at the mockup, the "Moje tvorba" row renders as six same-size square tiles with no single photo rendered larger or featured differently - there is no visually distinct "main" tile to map `portfolio_main` onto. This spec therefore treats the whole row as 6 equal slots (Section 2.5, Section 4) rather than 1 "main" + 3 "gallery" per the catalog's naming. This is a deliberate, documented deviation from the catalog's own slot names, driven by what the mockup actually shows, not an oversight.

---

## 7. Verification

- Ran `ls public/flowers/` (23 files) and cross-checked every one of the 14 filenames referenced in Section 4 by exact string match - all 14 exist.
- Confirmed no filename appears twice across the 14 assignments in Section 4 (hero: 1, category cards: 6, about: 1, portfolio: 6).
- Confirmed the stale `(1)`-suffixed filename from `slot_candidates.category_susene` (Section 0) is not used anywhere in this document.
- Confirmed all 5 anchor IDs required by `content-contract.md` (`kytice`, `vence-a-dekorace`, `svatby`, `zahrady`, `o-mne`) are placed exactly once each (Section 3).
- Cross-checked `category` field for every category-card image against that card's theme (Section 4's per-row notes); the one case where confidence-ranking alone would have picked a thematically wrong photo (`hero` almost defaulting to a bridal portrait) is called out explicitly with the override rationale.
