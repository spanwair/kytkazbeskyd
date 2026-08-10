# Flower Shop Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (adapted — see "Process Adaptation" below) to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the leftover pizza/restaurant template content on this Astro site with a pixel-faithful implementation of the "Kytka z Beskyd" flower shop homepage design (`public/4225e624-95c5-49f9-8f9f-478c8345f397.png`), using the 23 real product photos in `public/flowers/` and their Gemma-generated metadata in `public/flowers-catalog.json` for image placement.

**Architecture:** Nine sequential, single-responsibility tasks mirror a small studio team (Organizer → Powerful Designer → Designer → Implementor → UX → Tester → Suggester → Disclaimer → Agent Owner). Each task's only inputs are the plan, its own brief, and named artifacts produced by earlier tasks — never the accumulated conversation history. Each task writes its deliverable to `docs/redesign/` (a permanent project record, not scratch) except the Implementor, which writes application code. Work happens on branch `redesign/flower-shop-homepage` (already created, based off `main`), never on `main` directly.

**Tech Stack:** Astro 5, Tailwind CSS 4 (`@theme` tokens in `src/styles/global.css`), Alpine.js for interactivity, `bun` as the package manager/runner. No test framework exists in this repo — "tests" in this plan mean `bun run build` succeeding, `astro check` (if available) passing, and explicit manual verification steps (grep checks, link/image existence checks, dev-server smoke check) in place of unit tests.

## Global Constraints

- Never edit `main` directly — all work happens on `redesign/flower-shop-homepage`.
- Never invent business facts (phone, email, address, hours) that aren't already in `src/data/config.ts` or visible in the design mockup. Where the mockup and `config.ts` disagree, prefer the existing real `config.ts` value (it is the client's real contact info) and record the discrepancy in `docs/redesign/disclaimers.md` — do not silently pick one.
- All body copy, headings, and captions must be Czech, matching the mockup's tone, except where this plan explicitly calls out a corrected typo.
- All new colors, fonts, and spacing must come from the `@theme` tokens defined in Task 2 — no ad hoc hex codes or inline font-families in later tasks.
- Every `<img>`/`<Picture>` needs real, non-generic Czech `alt` text (source: `public/flowers-catalog.json`'s `alt_text_cs` field, or written fresh if a slot has no catalog match).
- Do not delete `src/pages/about-us.astro`, `book.astro`, `contact.astro`, `gallery.astro`, `privacy-policy.mdx`, or `404.astro` — out of scope for this plan (homepage only). Note any inconsistency they now have with the new nav/design in `docs/redesign/suggestions.md`, don't fix it here.
- Commit after every task on the feature branch. Never push, never merge to `main`, never force anything — final integration is the human's call via `finishing-a-development-branch` at the end.
- Run `bun run build` before considering any code task done; it must exit 0.

## Process Adaptation

This plan intentionally departs from the letter of `subagent-driven-development` in two ways, because the work is a design/content pipeline, not pytest-style TDD:

1. **No test-first steps.** "Write the failing test" is replaced with concrete verification steps (build, grep, link-check) at the point the skill would normally ask for a test run.
2. **Reviewer weight is task-scoped.** Task 4 (Implementor) — the only task that changes shipped code broadly — gets a full independent task-reviewer subagent and fix loop, per the skill. Tasks 1, 2, 3, 5, 6, 7, 8 are lower-risk (scoped writes or docs-only); the controller (you) reviews their diff directly against the brief instead of dispatching a second subagent, and escalates to a real reviewer only if something is genuinely ambiguous. Task 9 (Agent Owner) doubles as the final whole-branch review required by the skill, run on the most capable model, over the full `main...HEAD` diff.

## Verbatim Copy Extracted From The Design Mockup

Use these strings exactly (Task 1 owns finalizing this list; later tasks consume it, they don't re-derive it). Two typos in the mockup are corrected here — flag both in `docs/redesign/disclaimers.md` as "mockup had a typo, corrected in implementation":

- Nav (left to right): `ÚVOD`, `KYTICE`, `VĚNCE A DEKORACE`, `SVATBY`, `ZAHRADY`, `OBCHOD`, `O MNĚ`, `KONTAKT` — plus a cart icon and an Instagram icon on the far right.
- Logo wordmark (script font, inside circular badge): `Kytka z Beskyd`
- Hero H1 (two lines): `KYTKA` / `Z BESKYD`
- Hero tagline (italic): `Květiny tvořené srdcem, inspirované přírodou.` *(mockup shows "inspiravané" — typo, corrected)*
- Hero bullet list: `KYTICE`, `VĚNCE`, `SVATBY`, `DEKORACE`, `ZAHRADY` (rendered as two lines of bullet-separated items)
- Hero buttons: `OBJEDNAT KYTICI` (filled/pink), `PROHLÉDNOUT TVORBU` (outline)
- Category card 1: title `Kytice`, subtitle `z čerstvých květin`, body `Čerstvé, sezónní a pokaždé trochu jiné.`
- Category card 2: title `Sušené květiny & věnce`, body `Originální dekorace, které vydrží.`
- Category card 3: title `Svatební floristika`, body `Kytice, korsáže, výzdoba obřadů i hostiny.`
- Category card 4: title `Zahrady a výsadby`, body `Návrhy, osazování a péče o zahrady.`
- Category card 5: title `Květinářství v Hrádku`, body `Řezané květiny, pokojovky, trvalky a drobné dárky.`
- Category card 6: title `Doplňky pro váš den`, body `Korsáže, hřebínky a další detaily.` *(mockup shows a stray period: "hřebínky. a další" — typo, corrected)*
- About heading: `O mně ♡`
- About paragraph 1: `Květiny jsou součástí mého života už od mládí.`
- About paragraph 2: `Po letech práce v zahradnictví a vlastní zahradnické praxi jsem se naplno věnovala floristice.`
- About paragraph 3: `Dnes pod značkou Kytka z Beskyd tvořím kytice, věnce a dekorace, při pravé svatební floristice a věnuji se také návrhům a výsadbám zahrad.`
- About paragraph 4: `Mám ráda přirozený, trochu rozkvetlý styl a květiny, které vyprávějí, jako by přišly ze zahrady nebo beskydské louky.`
- About highlighted line (pink): `Každý kus vzniká ručně a žádné dvě kytice nejsou úplně stejné.`
- About button: `VÍCE O MNĚ`
- Portfolio heading: `Moje tvorba 🌿`
- Portfolio button: `ZOBRAZIT DALŠÍ`
- Footer badge 1: `Čerstvé a sezónní` — `Pracuji s květinami, které jsou právě v sezóně.`
- Footer badge 2: `Ruční práce` — `Každou kytici nebo dekoraci vytvářím s láskou a pečlivostí.`
- Footer badge 3: `Lokálně z Beskyd` — `Inspiraci čerpám z přírody kolem nás.`
- Footer badge 4: `Osobní přístup` — `Ráda s vámi vše proberu a poradím.`
- Footer signature (script, pink): `Děkuji za vaši důvěru ♡`
- Footer copyright: reuse existing pattern from `src/components/Footer.astro` (`© {year} {siteName}. Všechna práva vyhraná.` + privacy policy link).
- Footer contact: use the REAL values from `src/data/config.ts` (`phone.label`, `email.label`), **not** the mockup's placeholder `+420 123 456 789` / `natalia.ruszova@email.cz` — see Global Constraints.

---

### Task 1: Organizer — Content Contract & Nav Routing

**Files:**
- Create: `docs/redesign/content-contract.md`
- Create: `docs/redesign/STATUS.md` (running handoff log — every later task appends one entry here before finishing)
- Modify: none (docs only)

**Interfaces:**
- Consumes: the "Verbatim Copy" section above, the design mockup image at `public/4225e624-95c5-49f9-8f9f-478c8345f397.png`, `src/data/config.ts`, `src/data/menus.js`, existing pages under `src/pages/`.
- Produces: `docs/redesign/content-contract.md` with (a) the full verbatim copy list from this plan reproduced verbatim, (b) a finalized nav table mapping each of the 8 nav labels to a concrete `href` (decide: on-page anchor within the new one-page homepage layout for items with a matching homepage section — `Kytice`, `Věnce a dekorace`→category card 2, `Svatby`→category card 3, `Zahrady`→category card 4, `O mně`→about section anchor AND note `/about-us` still exists as a deeper page; `Obchod` and `Kontakt` have no homepage section — route `Kontakt` to `/contact` (existing page) and `Obchod` to `/book` (existing page, closest existing equivalent) and flag both as needing a real dedicated page later in `docs/redesign/suggestions.md`'s follow-up, not this plan), (c) the corrected `src/data/config.ts` diff proposal (do not apply it yet — Task 4 applies it) fixing only genuinely wrong placeholder values (`siteSlogan`, `themeColor`, fake `address`, generic `socialMedia` URLs vs. the real ones already used in `Footer.astro` — `https://www.facebook.com/kytkazbeskyd`, `https://www.instagram.com/kytkazbeskyd`) — keep `phone` and `email` unchanged, they're already correct.

**Steps:**

- [ ] **Step 1: Write `docs/redesign/content-contract.md`** containing the three sections above (verbatim copy, nav table, config.ts diff proposal). Every nav `href` must be a concrete string, not a TBD.
- [ ] **Step 2: Write `docs/redesign/STATUS.md`** with a one-line header explaining its purpose ("Running handoff log for the flower-shop-homepage-redesign plan — each task appends one entry before finishing, newest at the bottom") and a first entry: `Task 1 (Organizer): content contract + nav routing finalized. See content-contract.md.`
- [ ] **Step 3: Verify** — re-read the design mockup image and confirm every one of the 8 nav labels and all copy strings in `content-contract.md` match the plan's "Verbatim Copy" section exactly (character-for-character, including diacritics).
- [ ] **Step 4: Commit**

```bash
git add docs/redesign/content-contract.md docs/redesign/STATUS.md
git commit -m "docs: finalize content contract and nav routing for homepage redesign"
```

---

### Task 2: Powerful Designer — Design System Tokens

**Files:**
- Modify: `src/styles/global.css` (only the `@theme` block and font-face declarations — do not touch existing utility classes like `.button`, `.loader`, etc. unless a color/font token they reference is being renamed, in which case update the reference)
- Create: `docs/redesign/design-system.md`

**Interfaces:**
- Consumes: the design mockup image (look at it directly — this task's whole job is precise visual analysis), `docs/redesign/content-contract.md` (read-only, for context).
- Produces: new/updated `@theme` tokens in `global.css` that Task 3 and Task 4 will reference by name. At minimum define: `--color-cream` (page background), `--color-cream-alt` (card/section alt background), `--color-ink-green` (dark olive heading/nav-active color, replaces `--color-brand-green`), `--color-accent-pink` (button/highlight color, replaces `--color-brand-red` semantically — keep the CSS variable name `--color-brand-red` only if reusing it, otherwise introduce `--color-brand-pink` and update the 3 usages in `global.css`'s `.button-red` / `.menu-item-highlighted` rules to match), `--color-footer-dark` (footer background), `--font-display` (serif font for H1/big headings, uppercase, wide letter-spacing — matches "KYTKA Z BESKYD"), `--font-script` (script/handwritten font for the logo wordmark and italic accents like "O mně ♡", "Moje tvorba", the footer signature). Both fonts must be self-hosted (download `.woff2` into `public/fonts/<family>/` following the existing `public/fonts/inter/` pattern, or use `@fontsource` npm packages if that's faster and add them to `package.json`) — no remote Google Fonts `<link>` (this site self-hosts Inter already; stay consistent, and remote font requests would violate the Artifact-style "no external calls" hygiene this codebase otherwise follows for assets). Pick specific real font names and justify the pick in the doc (e.g., "Playfair Display for --font-display: closest freely-licensed match to the mockup's wide-tracked serif caps" / "Sacramento for --font-script: closest match to the mockup's connected cursive logo lettering").

**Steps:**

- [ ] **Step 1: Analyze the mockup image directly** (`public/4225e624-95c5-49f9-8f9f-478c8345f397.png`) and sample exact-enough hex values for: page background cream, the dark olive-green used for the H1/nav-active/category-title text, the muted rose-pink used for the filled button and highlighted about-me sentence, the near-black footer background, the cream card background used in category cards. Record each as a named token with its hex value and one sentence on where it's used.
- [ ] **Step 2: Pick and source two fonts** (display serif + script) per the Interfaces section, download the actual font files into `public/fonts/<family-slug>/`, and add `@font-face` blocks to `global.css` following the exact pattern already used for Inter (weight-specific `.woff2` files, `font-display: swap`).
- [ ] **Step 3: Add the `@theme` tokens** to `global.css` and wire `--font-display` / `--font-script` so Tailwind utility classes `font-display` and `font-script` become available (mirror how `--font-inter` currently produces `font-inter`).
- [ ] **Step 4: Update existing color-token consumers** in `global.css` (`.button-red`, `.button-green`, `.menu-item-highlighted`, `.menu-item-active`) so they reference the new tokens instead of the old restaurant red/green if the token names changed. If you keep the old variable names and just change their hex values, say so explicitly in the doc instead — either is fine, but it must be a deliberate, documented choice, not an accidental leftover.
- [ ] **Step 5: Write `docs/redesign/design-system.md`** documenting every new/changed token (name, hex or font-family, usage), the two font choices with licensing note (must be open-license / free-for-commercial-use — say which license), and a copy-paste Tailwind class reference table (e.g. `font-display` → H1s, `font-script` → logo & italic accents, `bg-cream` → page background).
- [ ] **Step 6: Verify** — run `bun run build` and confirm it exits 0 (a broken `@theme` block or missing font file would fail the build or produce a visibly broken page; a clean build is the closest thing to a test this task has).
- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css public/fonts docs/redesign/design-system.md package.json bun.lock
git commit -m "feat: add flower-shop design system tokens (colors, display + script fonts)"
```
- [ ] **Step 8: Append to `docs/redesign/STATUS.md`**: `Task 2 (Powerful Designer): design tokens landed in global.css. See design-system.md for exact values and font choices.`

---

### Task 3: Designer — Page Spec & Image-to-Slot Mapping

**Files:**
- Create: `docs/redesign/page-spec.md`
- Modify: none (docs only, but read `src/components/*.astro` to decide what's reusable vs. what needs a new component)

**Interfaces:**
- Consumes: `docs/redesign/content-contract.md`, `docs/redesign/design-system.md`, `public/flowers-catalog.json` (the `images`, `layout_slots`, and `slot_candidates` arrays), the mockup image, existing components (`Section.astro`, `Hero.astro`, `Grid.astro`, `Card.astro`, `Heading.astro`, `Button.astro`, `Badge.astro`, `WideImage.astro`).
- Produces: `docs/redesign/page-spec.md`, a section-by-section build spec that Task 4 follows exactly. For each of the 8 page sections (nav/header, hero, 6-card category grid, about-me, portfolio gallery, footer), specify: which existing component to reuse vs. which new component to create (name it, e.g. `src/components/CategoryCard.astro`, `src/components/PortfolioGrid.astro`), the exact Tailwind layout approach (grid columns per breakpoint, matching the mockup's 6-across desktop / stacked mobile card grid and 6-across portfolio grid), and — critically — the exact image filename from `public/flowers/` assigned to every image slot, chosen from that photo's `suggested_slot_ids` in `flowers-catalog.json` with no two slots sharing the same filename. Also produce a **gap list**: any `layout_slots` entry from the catalog with no good real-photo candidate (expect at least: `portrait_owner` — there is no owner portrait photo in `public/flowers` at all — and weak coverage for `category_zahrady`/garden and a dedicated `category_rezane`/cut-flowers-in-vase shot) — for each gap, specify the fallback (reuse the best thematically-adjacent real photo, e.g. a bouquet photo standing in for the "cut flowers" card) and flag it for `docs/redesign/disclaimers.md` to pick up.

**Steps:**

- [ ] **Step 1: Read `public/flowers-catalog.json`** in full. Build a working table: slot_id → ranked candidates (from `slot_candidates`) → chosen filename, resolving conflicts (two slots wanting the same top photo) by giving the slot with the higher-confidence match first pick and moving the loser to its next-best candidate. The 6 portfolio gallery images must be 6 *distinct* filenames not already used by hero/category/about slots, favoring visual variety (don't pick 6 near-identical dried-wreath photos back to back — cross-check `category` and `dominant_colors` fields for variety).
- [ ] **Step 2: For each of the 6 category cards**, confirm the catalog-suggested photo's `category` field actually matches that card's theme (e.g. `category_svatebni` should get the one photo classified `svatební floristika`, filename `b9f32fee-f3c2-4abb-9299-bed936e8a813.jpeg` per the catalog — verify this is still true by re-reading the current `public/flowers-catalog.json`, don't assume the plan's example is still accurate at execution time).
- [ ] **Step 3: Decide reusable vs. new components** and name every new file under `src/components/`. At minimum expect to need `CategoryCard.astro` (photo + title + optional subtitle + body + arrow link, matching the 6 category cards) and a portfolio grid (either a new `PortfolioGrid.astro` or plain markup in `index.astro` using `astro:assets` `Picture` in a Tailwind grid — Designer's call, document which and why).
- [ ] **Step 4: Write `docs/redesign/page-spec.md`** with the full section-by-section spec, the final image-slot table (slot → filename → alt text sourced from that photo's `alt_text_cs` in the catalog), and the gap list.
- [ ] **Step 5: Verify** — cross-check every filename in the page-spec's image table actually exists in `public/flowers/` (`ls public/flowers/` and diff against the spec's filename list by hand) and that no filename is used twice.
- [ ] **Step 6: Commit**

```bash
git add docs/redesign/page-spec.md
git commit -m "docs: finalize homepage component spec and image-to-slot mapping"
```
- [ ] **Step 7: Append to `docs/redesign/STATUS.md`**: `Task 3 (Designer): page spec + image mapping done, N gaps flagged. See page-spec.md.`

---

### Task 4: Implementor — Build The Page

**Files:**
- Create: `src/components/CategoryCard.astro` (and any other new component named in `page-spec.md`)
- Modify: `src/pages/index.astro` (full rewrite of content, keep the `Layout` wrapper), `src/components/Header.astro` (nav items + styling), `src/components/Footer.astro` (full restructure to match the 4-badge + dark contact bar design), `src/data/menus.js` (nav items per `content-contract.md`'s nav table), `src/data/config.ts` (apply the diff proposed in `content-contract.md`), `src/layouts/Layout.astro` (only if `og:description`/title need updating to match the flower-shop copy — check, don't assume)
- Delete: none unless `page-spec.md` explicitly says a file is fully superseded

**Interfaces:**
- Consumes: `docs/redesign/content-contract.md` (exact copy + nav hrefs), `docs/redesign/design-system.md` (exact Tailwind token classes to use — `font-display`, `font-script`, `bg-cream`, etc.), `docs/redesign/page-spec.md` (exact component breakdown + image-to-filename table), `public/flowers/*.jpeg` (import via `astro:assets` `Image`/`Picture` from `public/` — note these are in `public/`, not `src/assets/`, so use plain `<img>` or reference by URL path `/flowers/<filename>` rather than an `astro:assets` import, since `astro:assets` optimization requires files under `src/`; document which approach you used).
- Produces: a working `bun run build` and a homepage that a human can open in `bun run dev` and see match the mockup section-for-section.

**Steps:**

- [ ] **Step 1: Update `src/data/config.ts`** applying exactly the diff from `content-contract.md` — nothing more, nothing less.
- [ ] **Step 2: Update `src/data/menus.js`** with the 8 nav items and hrefs from `content-contract.md`'s nav table.
- [ ] **Step 3: Restyle `src/components/Header.astro`**: render all 8 nav items (desktop + mobile menu), apply `font-display`/`font-script` tokens to the logo per `design-system.md`, add cart + Instagram icons matching the mockup (inline SVG is fine, follow the existing inline-SVG pattern already used for the hamburger icon), apply the new color tokens.
- [ ] **Step 4: Create `src/components/CategoryCard.astro`** (props: `image: string`, `alt: string`, `title: string`, `subtitle?: string`, `body: string`, `href: string`) per `page-spec.md`'s component contract, styled to match the mockup's rounded-top photo + cream card body + arrow link.
- [ ] **Step 5: Rewrite `src/pages/index.astro`** section by section per `page-spec.md`: hero (2-col, headline/tagline/bullets/buttons left, hero photo right), category grid (6× `CategoryCard`), about-me section (2-col text + portrait photo, with the highlighted pink sentence and "VÍCE O MNĚ" button), portfolio gallery (6-image grid + "ZOBRAZIT DALŠÍ" button). Remove all leftover pizza/restaurant imports (`PizzaHero`, `Pizza`, `Spaghetti`, `Fish`, `DecorativeImage`, `reviewAuthors`, `Mussels`, the whole reviews section and its two decorative wave SVGs) — none of that belongs in the flower-shop design.
- [ ] **Step 6: Restructure `src/components/Footer.astro`** to match the mockup: 4-column feature badge row (icon + title + body, from `content-contract.md`), then a dark bottom bar with phone/email (from `config.ts`, not the mockup placeholders), Facebook/Instagram icon links (already-correct URLs), the script-font "Děkuji za vaši důvěru ♡" signature, and the copyright/privacy-policy line (keep existing pattern).
- [ ] **Step 7: Run `bun run build`** — must exit 0. Fix any Astro/Tailwind errors before proceeding.
- [ ] **Step 8: Run `bun run dev`** in the background, curl `http://localhost:4321/` (or whatever port it binds — check the dev server's stdout for the actual port), and grep the returned HTML for every one of the 8 nav labels, the H1 text, and all 6 category card titles to confirm they're actually rendered (not just written in source but silently swallowed by a typo'd slot name or conditional).
- [ ] **Step 9: Verify every image reference resolves** — grep `src/pages/index.astro` and `src/components/Header.astro`/`Footer.astro` for every `/flowers/...` path used and confirm each one exists in `public/flowers/` via `ls`.
- [ ] **Step 10: Self-review** — re-read your full diff (`git diff`) once against `page-spec.md` and `content-contract.md` line by line; fix anything that drifted before reporting done.
- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "feat: rebuild homepage as Kytka z Beskyd flower shop per design mockup"
```
- [ ] **Step 12: Append to `docs/redesign/STATUS.md`**: `Task 4 (Implementor): homepage rebuilt, bun run build clean. Files changed: <list>.`

**This task gets a full independent task-reviewer subagent + fix loop (see Process Adaptation).**

---

### Task 5: UX Focus Agent — Usability & Accessibility Review

**Files:**
- Create: `docs/redesign/ux-review.md`
- Modify (narrow — accessibility attributes only, e.g. `alt`, `aria-*`, `role`, focus-visible classes already defined in `global.css`): any file under `src/components/` or `src/pages/index.astro` touched in Task 4

**Interfaces:**
- Consumes: the built homepage from Task 4 (read the diff and the rendered HTML via `bun run dev` + curl), `public/flowers-catalog.json` (to judge whether `alt` text is descriptive, not generic).
- Produces: `docs/redesign/ux-review.md` covering: heading hierarchy (exactly one `h1`, logical `h2`/`h3` nesting — check, don't assume), color contrast of the pink-on-cream and green-on-cream text combinations against the tokens defined in `design-system.md` (compute or estimate WCAG AA compliance; flag any combination that fails 4.5:1 for body text / 3:1 for large text), mobile menu keyboard/focus behavior (can it be closed with Escape — `Header.astro` already wires `@keydown.window.escape`, confirm it still works after Task 4's edits), tap target sizing on mobile nav and card links, and whether every image has non-generic Czech alt text.

**Steps:**

- [ ] **Step 1: Read the Task 4 diff** (`git show <task-4-commit>` or `git diff <base>..<task-4-head> -- src/`).
- [ ] **Step 2: Run `bun run dev`**, fetch the homepage HTML, and check heading structure with a grep for `<h1`, `<h2`, `<h3` tags and their nesting order.
- [ ] **Step 3: Estimate contrast ratios** for the token hex values from `design-system.md` (pink-on-cream, ink-green-on-cream, cream-on-footer-dark) using the standard WCAG relative-luminance formula (compute by hand or with a short throwaway script — don't guess).
- [ ] **Step 4: Check every `alt` attribute** in the changed files against `public/flowers-catalog.json`'s `alt_text_cs` field for that filename; flag any generic (`alt="obrázek"`) or missing alt text.
- [ ] **Step 5: Apply safe, narrow fixes directly** for anything under your privilege (missing/generic alt text, missing `aria-label` on icon-only buttons/links, missing `focus-visible` styling reusing existing utility classes). Do NOT change layout, spacing, colors, or copy — file those as findings instead.
- [ ] **Step 6: Write `docs/redesign/ux-review.md`** with every finding (fixed-directly vs. filed-for-Implementor), including the contrast numbers.
- [ ] **Step 7: Run `bun run build`** again to confirm your fixes didn't break anything.
- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "fix: accessibility pass on homepage (alt text, aria labels, focus states)"
```
- [ ] **Step 9: Append to `docs/redesign/STATUS.md`**: `Task 5 (UX Focus): accessibility review done, N issues fixed directly, M filed for Implementor. See ux-review.md.`

---

### Task 6: Tester — Build & Functional Verification

**Files:**
- Create: `docs/redesign/test-report.md`
- Modify: none (execute-only; if it finds a real break, it reports back rather than fixing)

**Interfaces:**
- Consumes: the full working tree after Tasks 4-5.
- Produces: `docs/redesign/test-report.md` with a pass/fail table covering: `bun run build` exit code, every internal `href` in the new nav/footer resolving to either an existing route under `src/pages/` or a valid in-page anchor (`grep -o 'href="[^"]*"'` across the changed files, cross-check each), every `/flowers/...` and `/fonts/...` referenced path resolving to a real file under `public/`, no leftover references to the old pizza/restaurant assets (`grep -rn "Pizza\|Spaghetti\|Mussels\|pizza-hero\|review-authors" src/`), and a `bun run dev` smoke test (start it, curl the homepage, confirm HTTP 200 and non-empty body).

**Steps:**

- [ ] **Step 1: Run `bun run build`**, capture exit code and full output.
- [ ] **Step 2: Extract every internal href** from `src/components/Header.astro`, `src/components/Footer.astro`, `src/pages/index.astro` and verify each resolves (route exists under `src/pages/` accounting for Astro file-based routing, or is a `#section-id` anchor present in `index.astro`).
- [ ] **Step 3: Extract every asset path** (`/flowers/...`, `/fonts/...`, `/favicon...`) referenced in the changed files and verify each file exists under `public/`.
- [ ] **Step 4: Grep for leftover restaurant-template references** across `src/` and confirm zero matches (excluding files explicitly out of scope per Global Constraints, e.g. `about-us.astro` if it wasn't touched).
- [ ] **Step 5: Start `bun run dev` in the background**, curl the homepage, confirm HTTP 200, then stop the dev server.
- [ ] **Step 6: Write `docs/redesign/test-report.md`** with a clear pass/fail table. If anything fails, do not fix it — write the exact failure (command, expected, actual) so it can be routed back to the Implementor.
- [ ] **Step 7: Commit**

```bash
git add docs/redesign/test-report.md
git commit -m "test: verify homepage build, links, and asset references"
```
- [ ] **Step 8: Append to `docs/redesign/STATUS.md`**: `Task 6 (Tester): N/M checks passed. See test-report.md.` (If any check failed, say so plainly here — do not soften a failure into a "mostly passing" summary.)

---

### Task 7: Suggester — Forward-Looking Recommendations

**Files:**
- Create: `docs/redesign/suggestions.md`
- Modify: none

**Interfaces:**
- Consumes: `docs/redesign/page-spec.md`'s gap list, `docs/redesign/test-report.md`, the finished homepage, the existing (now nav-orphaned or nav-mismatched) subpages (`about-us.astro`, `book.astro`, `contact.astro`, `gallery.astro`).
- Produces: `docs/redesign/suggestions.md`, a clearly-labeled "not implemented in this pass" list. Must include at minimum: dedicated pages for `Kytice`, `Věnce a dekorace`, `Svatby`, `Zahrady`, `Obchod` (currently anchor-linked or routed to a nearest-existing page per `content-contract.md` — flag this as a stopgap), a real owner portrait photo shoot (catalog gap from Task 3), real garden/zahrady photography, an e-commerce/cart flow (the mockup shows a cart icon in the header with no backing functionality), a newsletter or seasonal-promo section, and reconciling `about-us.astro`'s content/photo with the new design system (it still uses the old `PizzaHero` placeholder image and old serif-less styling).

**Steps:**

- [ ] **Step 1: Read `page-spec.md`'s gap list and `test-report.md`.**
- [ ] **Step 2: Open each existing subpage** (`about-us.astro`, `book.astro`, `contact.astro`, `gallery.astro`) and note anything visually inconsistent with the new design system now that the homepage has changed.
- [ ] **Step 3: Write `docs/redesign/suggestions.md`** as a prioritized list (must-do-soon vs. nice-to-have), each item one paragraph: what, why, rough effort.
- [ ] **Step 4: Commit**

```bash
git add docs/redesign/suggestions.md
git commit -m "docs: forward-looking suggestions for follow-up work"
```
- [ ] **Step 5: Append to `docs/redesign/STATUS.md`**: `Task 7 (Suggester): N follow-up items logged. See suggestions.md.`

---

### Task 8: Disclaimer Agent — Risk, Placeholder & Compliance Audit

**Files:**
- Create: `docs/redesign/disclaimers.md`
- Modify: none

**Interfaces:**
- Consumes: everything produced so far (`content-contract.md`, `design-system.md`, `page-spec.md`, `ux-review.md`, `test-report.md`, `suggestions.md`), `public/flowers-catalog.json`.
- Produces: `docs/redesign/disclaimers.md` covering: (a) both corrected mockup typos, listed explicitly with before/after text; (b) the phone/email discrepancy between the mockup placeholders and the real `config.ts` values, and which was used; (c) every image-to-slot gap from `page-spec.md` (no owner portrait, weak garden/cut-flower coverage) and what stand-in was used instead — explicit statement that a real photo shoot is needed to close these gaps; (d) an explicit note that every photo's category/description/alt-text metadata in `flowers-catalog.json` was generated by an AI vision model (Gemma) with a stated confidence score, not verified by a human florist, and should be spot-checked by the client; (e) an explicit note that photo usage rights/ownership of the images in `public/flowers/` have not been verified — confirm with the client that these are their own photos before any public deployment; (f) current cookie-consent/GDPR status (the existing `CookieConsent.astro` + Google Analytics wiring is unchanged by this plan — note it's still in place and still fires GA after consent, unrelated to but co-existing with the redesign).

**Steps:**

- [ ] **Step 1: Read all prior `docs/redesign/*.md` files.**
- [ ] **Step 2: Cross-check the two typo corrections** against the live `src/pages/index.astro` to confirm the corrected (not original-typo) text actually shipped.
- [ ] **Step 3: Write `docs/redesign/disclaimers.md`** covering all six points above, each as its own clearly headed subsection.
- [ ] **Step 4: Commit**

```bash
git add docs/redesign/disclaimers.md
git commit -m "docs: risk and disclaimer audit for homepage redesign"
```
- [ ] **Step 5: Append to `docs/redesign/STATUS.md`**: `Task 8 (Disclaimer): audit complete, N items require client confirmation. See disclaimers.md.`

---

### Task 9: Agent Owner — Final Sign-off & Whole-Branch Review

**Files:**
- Create: `docs/redesign/FINAL-SIGNOFF.md`
- Modify: none (unless this task's own broad review surfaces a Critical/Important finding, in which case follow the fix-loop in Process Adaptation before signing off — do not sign off on known-broken work)

**Interfaces:**
- Consumes: the entire `main...HEAD` diff on `redesign/flower-shop-homepage`, and every doc under `docs/redesign/`.
- Produces: `docs/redesign/FINAL-SIGNOFF.md` — the document that gets relayed to the human. Must state plainly: what was delivered (file list + one-line description of each), what was verified working (cite `test-report.md`'s pass/fail numbers), what's explicitly NOT done and needs human input (cite `suggestions.md` + `disclaimers.md`), and a go/no-go recommendation for merging this branch into `main`.

**Steps:**

- [ ] **Step 1: Run `git diff main...HEAD --stat`** to get the full file-change list for this branch.
- [ ] **Step 2: Do a full-branch code review pass** — read the complete diff (`git diff main...HEAD -U10 -- src/`), checking for: spec compliance against `content-contract.md`/`page-spec.md`, dead code left behind (unused imports, orphaned old components), consistency of the new design tokens' usage, and anything Task 4's own reviewer might have missed. This is the "final whole-branch review on the most capable model" the skill calls for.
- [ ] **Step 3: If Step 2 finds a Critical or Important issue**, do not sign off — either fix it directly (small, mechanical fixes only) and note the fix in the signoff doc, or if it's substantial, write it up as a blocking finding and set the recommendation to "no-go until fixed."
- [ ] **Step 4: Write `docs/redesign/FINAL-SIGNOFF.md`** per the Interfaces contract above.
- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "docs: final sign-off for flower shop homepage redesign"
```
- [ ] **Step 6: Append to `docs/redesign/STATUS.md`**: `Task 9 (Agent Owner): SIGNED OFF — <go|no-go>. See FINAL-SIGNOFF.md.`

**Do not run `finishing-a-development-branch`'s merge step.** Report completion and hand the branch back to the human for their own merge decision — this is real production-facing client content and the human gets the final call.
