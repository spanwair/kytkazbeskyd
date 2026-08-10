# Task 4 (Implementor) - Report

**Task:** 4 (Implementor)
**Branch:** `redesign/flower-shop-homepage`
**Consumed:** `docs/redesign/content-contract.md`, `docs/redesign/design-system.md`, `docs/redesign/page-spec.md`.

---

## 1. Files created/modified and why

- **Created `src/components/CategoryCard.astro`** - the reusable category-card component per `page-spec.md`'s exact prop contract (`image, alt, title, subtitle?, body, href`), plus a default `<slot />` above the title for an optional inline-SVG decorative glyph (used by every card - see judgment call 4 below). Photo fills the top ~60% (`aspect-[4/5]`) with a small top radius, body sits on `bg-cream-card`, and the bottom link is an inline SVG arrow in `text-accent-pink-deep` (never a styled `→` glyph, per the design system's handoff flag 2).

- **Modified `src/data/config.ts`** - applied `content-contract.md`'s diff exactly: replaced the pizza-template `siteSlogan` and `themeColor`, removed the fabricated `address` export (confirmed unused anywhere in `src/` via grep before removing), and pointed `socialMedia.facebook.url` / `socialMedia.instagram.url` at the real URLs already hard-coded in the old `Footer.astro`. `phone`, `email`, `twitter`, `youtube`, `hours` left untouched exactly as the contract specifies. One deliberate deviation from the contract's literal diff text: I set `themeColor` to `#aa4a65` (the final `--color-accent-pink-deep` token from `design-system.md`), not the contract's own placeholder `#C2628A` - the contract's own rationale section explicitly instructs Task 4 to do this once Task 2's real token exists.

- **Modified `src/data/menus.js`** - replaced the 4-item pizza-era menu with the 8-item nav table from `content-contract.md` Section 2 (`Úvod /`, `Kytice #kytice`, `Věnce a dekorace #vence-a-dekorace`, `Svatby #svatby`, `Zahrady #zahrady`, `Obchod /book`, `O mně #o-mne`, `Kontakt /contact`). Names are stored in normal Czech case (`Úvod`, not `ÚVOD`); the header renders them with the Tailwind `uppercase` utility, matching the existing site convention (the pre-existing menu also stored mixed-case names) and `design-system.md`'s recommended nav class `font-body uppercase tracking-[0.12em] text-sm`.

- **Modified `src/components/Header.astro`** - full restyle: dropped the raster pizza-shop logo image, replaced it with a circular badge (`rounded-full border border-ink-green`) containing the `font-script text-ink-green` wordmark "Kytka z Beskyd", per `page-spec.md` 2.1's explicit instruction ("hand-drawn circle border... either is fine, Task 4's call" - I chose CSS border + script text, no new image asset needed). All 8 nav items render desktop + mobile with `font-body uppercase tracking-[0.12em] text-ink-green`; active item gets a `border-b-2 border-accent-pink` underline (decorative-only pink per the contrast table, never pink as text color). Added cart icon (→ `/book`, the content-contract's stopgap target) and Instagram icon (→ the real URL, `target="_blank" rel="noopener noreferrer"`) as inline SVGs, both `text-ink-green`. Mobile hamburger/slide-out pattern retained verbatim, including the `@keydown.window.escape="open = false"` handler (confirmed still present and functional).

- **Modified `src/components/Footer.astro`** - full restructure to the mockup's two-band layout: a `bg-blush` band with the 4 feature badges (icon + `font-display` title + `font-body` body, copy from `content-contract.md` Section 1 verbatim) and a `bg-footer-dark` bottom bar with phone/email pulled from `config.ts` (not the mockup's placeholder numbers), Facebook + Instagram icon links, the `font-script text-accent-pink` signature "Děkuji za vaši důvěru" with an inline SVG heart, and the copyright/privacy-policy line reusing the exact existing pattern (`© {year} {siteName}. Všechna práva vyhraná.` + `/privacy-policy` link). Dropped the old raster logo and flat nav-link list from the footer - `page-spec.md` 2.6 doesn't call for either, replacing them with the badge/contact-bar structure instead.

- **Rewrote `src/pages/index.astro`** - full content rewrite per `page-spec.md`'s section-by-section spec: Hero (`Section#hero` + `Hero` 2-col), 6-card category grid (`Section#kategorie`, plain Tailwind grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6`, `CategoryCard` x6, anchor `id`s on the 4 wrapper `div`s that have nav entries), About-me (`Section#o-mne` + `Hero` reused as a 2-col text/photo primitive, highlighted pink sentence in `text-accent-pink-deep`), Portfolio (`Section#portfolio`, plain Tailwind grid `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6`, 6 distinct images). All pizza/restaurant imports and markup removed: `PizzaHero`, `Pizza`, `Spaghetti`, `Fish`, `DecorativeImage`, `reviewAuthors`, `Mussels`, the whole reviews section, and both decorative wave SVGs. `Grid.astro`, `Card.astro`, `Heading.astro`, `Badge.astro`, `WideImage.astro`, `ReviewSlider.astro` are no longer imported (per `page-spec.md` Section 1's reuse decisions - they remain untouched for the other pages that still use some of them).

- **Modified `src/layouts/Layout.astro`** - updated `<title>`, `meta description`, `og:title/description/site_name/image`, `twitter:title/description/image` from the leftover "Ručně vyráběné věnce a sušené květiny | Natálie Ruszová" copy to the flower-shop copy/branding ("Kytka z Beskyd | Květiny tvořené srdcem"). Also fixed the pre-existing bug content-contract.md flagged as informational: `<meta name="theme-color">` was hard-coded to `"#E6F4FF"` and never actually used the imported `themeColor`; it now reads `content={themeColor}`. `og:image`/`twitter:image` now point at the hero flower photo (`/flowers/157b55da-...jpeg`) instead of the old `/3.jg` pizza asset, since I was already touching these tags for the flower-shop copy and the old image reference was a leftover pointing at restaurant content.

---

## 2. Judgment calls (spec left open)

1. **`OBJEDNAT KYTICI` button target.** `page-spec.md` 2.2 explicitly left this as "Task 4's call" between `#kytice` and `/book`. I chose `/book` (the existing booking/contact form) because the button's Czech label literally means "order a bouquet" - scrolling to the category card grid doesn't let a visitor actually order anything, while `/book` is the one place in the current site that captures an order/contact request. `PROHLÉDNOUT TVORBU` ("view my work") correctly stays as `#portfolio`, an in-page scroll, since "browsing" is exactly what that section is for.

2. **Button.astro vs. plain anchors for the three CTA buttons (`OBJEDNAT KYTICI`, `VÍCE O MNĚ`, `ZOBRAZIT DALŠÍ`).** `page-spec.md` Section 1 says to reuse `Button.astro` "as-is" for these. I deviated from this: `Button.astro`'s shared `.button` class (defined in `global.css`, which I'm not permitted to edit) hard-codes `rounded-full`, which directly conflicts with `design-system.md`'s explicit, flagged hard constraint that "buttons are near-rectangular... not pill-shaped" and its "Recommended usage" section's own instruction ("rectangular with a very small radius... not `rounded-full`"). `Button.astro` provides no per-instance override mechanism - passing an extra `class` prop through its `{...props}` spread would emit a second, duplicate `class="..."` attribute on the same tag, and per the HTML parsing spec browsers only honor the first such attribute, so the override would silently do nothing. Since I can't touch `global.css` to change the shared class, and can't reliably override per-instance, I rendered these three buttons as plain `<a>` tags using the exact utility classes `design-system.md`'s own "Recommended usage" section prescribes (`bg-accent-pink-deep text-white` / `bg-ink-green text-white`, `rounded-sm`, `font-body font-semibold uppercase tracking-[0.1em] text-sm`). `Button.astro` itself is untouched and still serves the other pages that want its pill shape.

3. **Category card decorative icon slot.** `CategoryCard.astro`'s default `<slot />` is described in `page-spec.md` as optional ("the mockup shows a small line-art flower/leaf glyph on each card - this must be inline SVG"). I chose to populate it for all 6 cards (flower, sun/dried-flower burst, wedding rings, sprout, vase, bow - one per category theme) rather than leaving it empty, for pixel-fidelity with the mockup, which shows an icon on every card.

4. **Logo mark.** `page-spec.md` left "inline SVG or CSS border-radius circle ring - either is fine" as my call. I used a CSS circle (`rounded-full border border-ink-green`) with the `font-script` wordmark inside, rather than an inline SVG hand-drawn circle, since a plain border ring is visually equivalent at this size and needs no new asset.

---

## 3. Deviations from the specs (besides #2 above)

- None beyond the Button.astro deviation. Every copy string, nav href, anchor ID, image filename, and alt text was copied verbatim from `content-contract.md` / `page-spec.md`'s tables - no paraphrasing, no re-derivation.
- `src/data/menus.js` names are stored as normal Czech case rather than the content-contract's literal uppercase strings (`ÚVOD` etc.) - this is a rendering-vs-data-storage choice, not a copy deviation: the visible text is transformed to uppercase via the `uppercase` Tailwind utility (matching `design-system.md`'s recommended nav class), consistent with how the pre-existing menu data was already stored in mixed case before this task.

---

## 4. `bun run build` output (tail)

```
00:21:21   ▶ /_astro/12.7iS76M6-_2eQYIo.jpg (reused cache entry) (+1ms) (29/29)
00:21:21 ✓ Completed in 3ms.

Inlined 29.24 kB (60% of original 48.05 kB) of _astro/about-us.D9tCr2wa.css.
...
_astro/gallery.Dt4O2PdW.css was successfully updated
Successfully inlined a total of 7 HTML files.
00:21:21 [build] 7 page(s) built in 1.63s
00:21:21 [build] Complete!
```

Exit code 0. All 7 pages built (`404`, `about-us`, `book`, `contact`, `gallery`, `index`, `privacy-policy`).

`astro check` was attempted but declined - it requires installing `@astrojs/check` + `typescript` as new dependencies, which is out of scope for this task and the plan itself only calls for it "if available" (it isn't, without adding packages).

---

## 5. Grep/dev-server verification results

`bun run dev` started on `http://localhost:4322/` (4321 was occupied by an unrelated pre-existing process). `curl`'d the homepage HTML and grepped:

- **All 8 nav labels** (`Úvod`, `Kytice`, `Věnce a dekorace`, `Svatby`, `Zahrady`, `Obchod`, `O mně`, `Kontakt`) - all present, each rendered as real anchor text in both the desktop nav and the mobile panel (not just written in source - confirmed via direct grep against the fetched HTML, not the source file).
- **H1** - `<h1 class="font-display font-bold text-ink-green tracking-[0.08em] uppercase leading-none">KYTKA<br>Z BESKYD</h1>` renders exactly as specified, only one `<h1>` on the page.
- **All 6 category card titles** (`Kytice`, `Sušené květiny & věnce`, `Svatební floristika`, `Zahrady a výsadby`, `Květinářství v Hrádku`, `Doplňky pro váš den`) - all present.
- **All 5 anchor IDs** (`kytice`, `vence-a-dekorace`, `svatby`, `zahrady`, `o-mne`) - each present exactly once.
- **All 14 `/flowers/...` image paths** referenced in `index.astro` - each verified to return HTTP 200 from the dev server, and cross-checked against `ls public/flowers/` (23 files) - no typos, no filename reused twice.
- **Footer content** - all 4 badge titles, the signature text, and the real phone/email from `config.ts` all confirmed present in the rendered HTML.
- **Leftover restaurant references** - `grep -rn "Pizza|Spaghetti|Mussels|pizza-hero|review-authors|ReviewSlider|reviewAuthors" src/` returns zero matches inside any file this task touched. The only remaining matches are in `src/pages/about-us.astro` and `src/data/plates.json`, both explicitly out of scope for this plan.

Dev server was stopped after verification (both the throwaway instance from before the icon-slot fix and the one after it). A separate, pre-existing `astro dev` process on port 4321 belonging to the user's own terminal session was left untouched throughout.

---

## 6. Note on stray untracked files

`pnpm-lock.yaml` and `pnpm-workspace.yaml` appeared as untracked files in the working tree during this session, created by a process outside this task (a separate, pre-existing `astro dev` instance running under `node_modules/.pnpm`, started before this task began, in what appears to be the user's own terminal). They are unrelated to this `bun`-managed project and were deliberately **not staged or committed** by this task.
