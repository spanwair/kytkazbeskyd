# UX Review - Kytka z Beskyd Homepage Redesign

**Task:** 5 (UX Focus Agent)
**Scope:** usability and accessibility review of the homepage built in Task 4, per this task's narrow write privilege - `alt`, `aria-*`, `role` attributes, and `focus-visible` styling reusing classes/tokens already established by `design-system.md`. No layout, spacing, color, or copy changes were made directly; anything needing those is filed below for the Implementor.

Reviewed: `src/pages/index.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/CategoryCard.astro`, cross-checked against `docs/redesign/design-system.md`, `docs/redesign/page-spec.md`, `docs/redesign/task-4-implementor-report.md`, and `public/flowers-catalog.json`.

---

## 1. Method

1. Read the Task 4 commit (`da695d2`) and its follow-up typo-doc commit (`1aa26c8`) via `git log`/diff to know exactly what Task 4 touched.
2. Ran `bun run dev` (bound to `http://localhost:4322/`, port 4321 was occupied), fetched the rendered homepage HTML with `curl`, and grepped it for heading tags, `alt` attributes, `focus-visible` usage, and ARIA attributes - checked the actual served markup, not just the source.
3. Computed WCAG 2.1 contrast ratios myself from the raw hex values in `src/styles/global.css`'s `@theme` block, using the standard relative-luminance formula (sRGB channels gamma-corrected via the piecewise `c/12.92` / `((c+0.055)/1.055)^2.4` rule, luminance = `0.2126R + 0.7152G + 0.0722B`, ratio = `(L_light + 0.05) / (L_dark + 0.05)`), independently of `design-system.md`'s own table, then cross-checked against it.
4. Diffed every `alt` attribute actually shipped in the reviewed files against `public/flowers-catalog.json`'s `alt_text_cs` field for the same filename.
5. Applied narrow fixes directly, then re-ran `bun run build` to confirm nothing broke.

---

## 2. Heading structure

Fetched HTML heading order (`grep -oE '<h[1-6][^>]*>'` against the served page):

```
<h1>                          KYTKA / Z BESKYD
<h3> x6                       category card titles (Kytice, Sušené květiny & věnce, ...)
<h2>                          O mně ♡
<h2>                          Moje tvorba 🌿
<h3> x4                       footer feature-badge titles
```

- **Exactly one `<h1>`** - confirmed, pass.
- **Finding (filed, not fixed): heading level skipped, h1 → h3.** The six `CategoryCard` titles render as `<h3>` immediately after the page's only `<h1>`, with no intervening `<h2>` for the category-grid section. WCAG 2.1 SC 1.3.1 (and general heading-outline best practice) expects heading levels not to be skipped, since screen-reader users navigate by heading level and a level-3 heading appearing before any level-2 heading misrepresents the section as a subsection of nothing. **Not fixed directly** - the correct fix is to add a section heading (e.g. an `<h2>`, visually hidden with `sr-only` if the mockup genuinely has no visible "Kategorie" heading, or visible if design allows) before the category grid, which is new markup/content, outside this task's attribute-only privilege. **Filed for the Implementor.**
- **Secondary note (same finding, informational):** the footer's four `<h3>` badge titles come immediately after the `<h2>Moje tvorba</h2>` heading, which is level-valid (h2→h3) but semantically odd - the footer badges aren't a subsection of "Moje tvorba." Once the category-grid `<h2>` is added, a matching one for the footer badge band would give the whole page a clean, semantically correct outline. Rolled into the same filed item above.

---

## 3. Color contrast - computed, not re-trusted from design-system.md

All pairs below were computed independently from the raw hex values in `global.css`. Where `design-system.md` also lists the pair, my numbers matched its table exactly (design-system.md's math checks out). One pair is used in the shipped code that is **not** in `design-system.md`'s table at all, and it fails.

| Foreground | Background | Ratio | WCAG AA needed | Verdict |
|---|---|---|---|---|
| `ink-green` #45472a | `cream` #f7f1eb | 8.56:1 | 4.5:1 (normal text) | Pass (AA+AAA) |
| `ink-green` #45472a | `cream-alt` #fbf6f1 | 8.94:1 | 4.5:1 | Pass (AA+AAA) |
| `ink-green` #45472a | `cream-card` #f5ece2 | 8.22:1 | 4.5:1 | Pass (AA+AAA) |
| `ink-green` #45472a | `blush` #f7eae4 | 8.16:1 | 4.5:1 | Pass (AA+AAA) |
| `ink-body` #423c36 | `cream` #f7f1eb | 9.70:1 | 4.5:1 | Pass (AA+AAA) |
| `ink-body` #423c36 | `cream-card` #f5ece2 | 9.31:1 | 4.5:1 | Pass (AA+AAA) |
| `ink-body` #423c36 | `blush` #f7eae4 | 9.24:1 | 4.5:1 | Pass (AA+AAA) |
| `accent-pink-deep` #aa4a65 | `cream` #f7f1eb | 4.83:1 | 4.5:1 | Pass (AA) |
| `accent-pink-deep` #aa4a65 | `cream-card` #f5ece2 | 4.64:1 | 4.5:1 | Pass (AA) |
| white | `accent-pink-deep` #aa4a65 | 5.42:1 | 4.5:1 | Pass (AA) |
| white | `ink-green` #45472a | 9.60:1 | 4.5:1 | Pass (AA+AAA) |
| `cream` #f7f1eb | `footer-dark` #474a2b | 8.21:1 | 4.5:1 | Pass (AA+AAA) |
| `blush` #f7eae4 | `footer-dark` #474a2b | 7.82:1 | 4.5:1 | Pass (AA+AAA) |
| `accent-pink-soft` #d899a2 | `cream` #f7f1eb | 2.08:1 | decorative only, never text | Correctly used decoration-only in shipped code |
| `accent-pink-soft` #d899a2 | `footer-dark` #474a2b | 3.94:1 | 3:1 (large text) | Not used for text in shipped code; fine as decoration |
| **`accent-pink` #c56885** | **`footer-dark` #474a2b** | **2.49:1** | **3:1 (large text minimum)** | **FAILS - see finding below** |

### Finding (filed, not fixed): footer signature text fails WCAG AA, and isn't in design-system.md's own table

`src/components/Footer.astro`'s "Děkuji za vaši důvěru ♡" signature renders as:

```html
<p class="font-script text-accent-pink text-4xl md:text-5xl ...">
```

- `text-accent-pink` resolves to `#c56885` (the *undeepened* pink token - `design-system.md` explicitly reserves this one for "decorative fills and rules only... Not for text and not behind text," see its Accent section).
- Against `bg-footer-dark` (`#474a2b`), this text measures **2.49:1**, which fails WCAG AA even under the large-text allowance (3:1 minimum for text ≥24px/≥18.7px-bold; this text is 36-48px so it does qualify as "large," but 2.49:1 still misses the 3:1 floor by a wide margin).
- `page-spec.md` §2.6 assumed this was covered by "the contrast table's 'large text only' allowance," but `design-system.md`'s own contrast table never actually computed `accent-pink` on `footer-dark` - it only computed `accent-pink-soft` on `footer-dark` (3.94:1, a different token). This assumption was wrong and nobody caught it before this review.
- Every other text element on `bg-footer-dark` correctly uses `text-cream` (8.21:1) or `text-blush` (7.82:1), both of which pass comfortably. `text-accent-pink` is the only outlier.
- **Not fixed directly** - this requires changing a `text-*` color class, which is a color change outside this task's narrow privilege. **Filed for the Implementor**, with a concrete recommendation: swap `text-accent-pink` → `text-blush` (matches the hover state already used one line below on the phone/email links, 7.82:1, passes AA+AAA) or `text-cream` (8.21:1). Do **not** use `accent-pink-deep` as the "safer-sounding" fix - I computed it too and it's actually worse on this background (`accent-pink-deep` on `footer-dark` = **1.70:1**, since both colors are dark).

---

## 4. Alt text audit

Every `<img>` in the four reviewed files was checked against `public/flowers-catalog.json`'s `alt_text_cs` for that filename.

- **No missing `alt` attributes.** Every `<img>` (hero, 6 category cards, about photo, 6 portfolio images = 14 total) has a non-empty `alt`.
- **No generic alt text** (no `alt="obrázek"`, `alt="foto"`, empty strings, or filename-as-alt anywhere).
- **11 of 14** alt strings are copied character-for-character from the catalog's `alt_text_cs`.
- **3 of 14** (all portfolio images) are deliberately corrected from catalog typos, exactly as documented in `content-contract.md` §4 and cross-checked here against the live file:
  - `18ef0981-...jpeg`: catalog `osusíchlým` (not a Czech word) → shipped `osušeným`. Confirmed present in `index.astro`.
  - `7f8f3457-...jpeg`: catalog `doplnky` (missing háček) → shipped `doplňky`. Confirmed present.
  - `74d78256-...jpeg`: catalog `Rustikový` (non-standard) → shipped `Rustikální`. Confirmed present.
- **Conclusion: no alt-text fixes needed.** This is expected and fine per the task brief - documented, not silent.
- The about-me photo (`502ebd7d-...jpeg`, the faceless "hands at work" stand-in for the missing owner portrait) correctly avoids claiming to depict "the owner" in its alt text, per `page-spec.md`'s explicit instruction - alt reads "Rustikální aranžmá z sušených modrých květin a trávy," a neutral description of the photo's actual content.

---

## 5. Icon-only links / `aria-label` audit

All icon-only interactive elements were already correctly labeled by Task 4 - no gaps found here:

- Header cart icon (desktop + mobile): `aria-label="Objednávka a košík"` - present.
- Header Instagram icon (desktop + mobile): `aria-label="Instagram Kytka z Beskyd"` - present.
- Header hamburger / close buttons: labeled via visible `<span class="sr-only">` text ("Otevřít hlavní menu" / "Zavřít menu") rather than `aria-label` - an equally valid pattern, present and correct.
- Footer Facebook icon: `aria-label="Facebook Kytka z Beskyd"` - present.
- Footer Instagram icon: `aria-label="Instagram Kytka z Beskyd"` - present.
- `CategoryCard.astro`'s arrow link: `aria-label={`Zobrazit více: ${title}`}` - present, and usefully disambiguates the six otherwise-identical "Zobrazit více" links for screen-reader users navigating by link list.

No changes needed in this category.

---

## 6. Keyboard / focus behavior

- **Escape closes the mobile menu:** confirmed still wired. `@keydown.window.escape="open = false"` is present on `<header x-data="{ open: false }" ...>` in `Header.astro`, unchanged by Task 4's restyle, and window-scoped so it fires regardless of what has focus. Verified by reading the live component; not regressed.
- **Fixed directly: `aria-modal="true"` had no matching `role`.** The mobile-menu wrapper (`<div ... x-ref="dialog" x-show="open" x-cloak aria-modal="true">`) declared `aria-modal="true"` without `role="dialog"`. Per the ARIA spec, `aria-modal` is only meaningful on an element that also carries `role="dialog"` or `role="alertdialog"` - without it, assistive tech has no reason to treat the region as a modal at all, so focus/trap expectations silently don't apply. **Fixed:** added `role="dialog"` and `aria-label="Hlavní menu"` (so the dialog role has an accessible name, since it has no visible heading of its own) to that element.
- **Fixed directly: no element on the page had a visible focus indicator except the four large CTA buttons.** Before this review, `focus-visible:outline-*` only existed on `OBJEDNAT KYTICI`, `PROHLÉDNOUT TVORBU`, `VÍCE O MNĚ`, and `ZOBRAZIT DALŠÍ` (all in `index.astro`, all pre-existing from Task 4). Every other interactive element - both header logo links, the hamburger button, all 8 desktop nav links, all 8 mobile nav links, the mobile close button, both desktop icon links (cart, Instagram), both mobile icon links, all 5 footer links (phone, email, Facebook, Instagram, privacy policy), and the `CategoryCard` "Zobrazit více" arrow link - had no `focus-visible` styling of its own and was relying entirely on the browser's unstyled default outline. That's not a hard accessibility failure (a default outline is still visible), but it's an inconsistently-applied design-system contract: `design-system.md` explicitly defines `focus-visible:outline-ink-green` as "Focus rings on cream surfaces" as one of its named token-derived utilities, and the CTA buttons already follow it - the rest of the interactive surface didn't. **Fixed:** added the matching `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-<token>` utility to every element listed above, using `outline-ink-green` on cream/white surfaces and `outline-cream` on the dark footer bar (both are pre-existing generated Tailwind utilities from the `@theme` tokens already defined in `global.css` - per `design-system.md` §1's own statement that the theme block "generates `bg-*`, `text-*`, `border-*`, `ring-*` and `outline-*` utilities for each of them automatically." No new CSS was added; only `class` attributes were extended with pre-existing utility classes.)
- Verified via `grep -c "focus-visible"` against the re-fetched dev-server HTML: 23 occurrences post-fix (was 4 pre-fix).

---

## 7. Tap target sizing

- Hamburger and close buttons: `size-8` (32px) icon + `p-2.5` (10px) padding = ~52×52px effective target. **Pass** (comfortably over the WCAG 2.5.8 AA 24×24 minimum and the commonly-cited 44×44 comfort guideline).
- **Finding (filed, not fixed): Footer Facebook/Instagram icon links are 20×20 CSS px with no padding.** `Footer.astro`'s social icons are `width="20" height="20"` raw SVGs inside an `<a>` with no padding classes, sitting `gap-4` (16px) apart. This is below the WCAG 2.5.8 AA minimum target size of 24×24 CSS pixels, and the 16px gap between them is less than the 24px "sufficient spacing" exception the same success criterion allows for undersized targets - so this doesn't qualify for the exception either. **Not fixed directly** - the fix (adding `p-2`/`p-2.5` padding, or growing the SVG) is a spacing/layout change outside this task's privilege. **Filed for the Implementor.**
- **Finding (filed, not fixed): Header desktop cart/Instagram icon links are 24×24 with zero padding margin.** `size-6` (24px) icons with no padding technically sit right at the 24×24 minimum with no comfort margin, and no `gap` gives them breathing room from surrounding elements at some viewport widths. Not a hard failure like the footer icons, but worth the same treatment for consistency and touch-comfort. **Filed for the Implementor** as a lower-priority companion to the footer-icon finding, suggested fix: `p-1`/`p-2` padding on both the desktop and mobile header icon links.

---

## 8. Summary table

| # | Finding | Category | Disposition |
|---|---|---|---|
| 1 | Heading hierarchy skips h2 (h1 → h3 for category cards; footer h3s not under a relevant h2) | Structure | **Filed for Implementor** - needs a new (possibly `sr-only`) heading element |
| 2 | Footer signature `text-accent-pink` on `bg-footer-dark` = 2.49:1, fails WCAG AA large-text minimum (3:1) | Contrast | **Filed for Implementor** - needs a `text-*` color class swap (recommend `text-blush` or `text-cream`) |
| 3 | Footer Facebook/Instagram icon links are 20×20px, below WCAG 2.5.8 AA minimum, no spacing exception applies | Tap target | **Filed for Implementor** - needs padding/size increase |
| 4 | Header desktop/mobile cart+Instagram icon links are 24×24px with no comfort margin | Tap target | **Filed for Implementor** - lower priority, needs padding |
| 5 | `aria-modal="true"` on mobile menu with no matching `role="dialog"` | ARIA | **Fixed directly** - added `role="dialog"` + `aria-label="Hlavní menu"` |
| 6 | 19 interactive elements had no `focus-visible` styling, only the browser default | Focus visibility | **Fixed directly** - added `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-{ink-green\|accent-pink-deep\|cream}` reusing existing generated theme utilities to all of them |
| 7 | Alt text completeness/genericness | Alt text | **No issue found** - all 14 images have real, non-generic Czech alt text; 3 documented catalog-typo corrections verified present |
| 8 | Icon-only link labeling | ARIA | **No issue found** - all already correctly labeled by Task 4 |
| 9 | Escape-to-close mobile menu | Keyboard | **No issue found** - confirmed still functional |
| 10 | Exactly one `<h1>` | Structure | **No issue found** - confirmed via rendered HTML |

**Totals: 2 issues fixed directly (role/aria-modal pairing, and focus-visible states across 19 elements - counted as one fix category each per the summary rows above, or 20 individual element-level edits if counted per-element), 4 issues filed for the Implementor (heading hierarchy, footer signature contrast failure, footer icon tap targets, header icon tap targets).**

---

## 9. Files touched by this review

- `src/components/CategoryCard.astro` - added `focus-visible` outline to the "Zobrazit více" link.
- `src/components/Header.astro` - added `focus-visible` outline to logo links (×2), hamburger button, close button, desktop nav links, mobile nav links, desktop cart/Instagram links, mobile cart/Instagram links; added `role="dialog"` + `aria-label` to the mobile menu panel.
- `src/components/Footer.astro` - added `focus-visible` outline to phone, email, Facebook, Instagram, and privacy-policy links.
- No changes to `src/pages/index.astro` were needed for this task's narrow scope (its own `alt` text and the four existing CTA `focus-visible` states were already correct from Task 4).

`bun run build` re-run after all fixes: exit 0, 7 pages built, no errors or warnings introduced.
