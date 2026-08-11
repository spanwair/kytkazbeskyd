# Design System - Kytka z Beskyd Homepage Redesign

**Task:** 2 (Powerful Designer)
**Owns:** the `@theme` tokens in `src/styles/global.css` (colors + fonts) and the self-hosted font files under `public/fonts/`.
**Consumed by:** Task 3 (page spec) and Task 4 (implementation).
Every color and font in the new homepage must come from a token named here.
No ad hoc hex codes, no inline `font-family`, no remote font `<link>`.

## How these values were derived

Colors were sampled programmatically from `public/4225e624-95c5-49f9-8f9f-478c8345f397.png` (1023x1537 px), not eyeballed.
For flat areas the sampling took the modal RGB value over a rectangle inside the area.
For text the sampling took the modal value of the darkest stroke pixels inside a glyph run, so anti-aliasing against the cream background did not lighten the result.

Fonts were chosen by rendering every candidate at the mockup's exact cap height and comparing letterform metrics against the mockup's own lettering.
The measurements used were per-letter width/cap-height ratio and ink density (inked pixels over the glyph's bounding box), plus a visual side-by-side at native rendering size.
All candidates were also checked for full Czech glyph coverage before being considered.

## 1. Color tokens

All tokens live in the `@theme` block at the top of `src/styles/global.css`, so Tailwind generates `bg-*`, `text-*`, `border-*`, `ring-*` and `outline-*` utilities for each of them automatically.

### Surfaces

| Token | Hex | Sampled from | Use |
|---|---|---|---|
| `--color-cream` | `#f7f1eb` | header bar, hero background, about band | Default page background. |
| `--color-cream-alt` | `#fbf6f1` | gaps between category cards, portfolio band | Alternating section background, one step lighter than `cream`. |
| `--color-cream-card` | `#f5ece2` | category card body under the photo | Card surfaces sitting on `cream-alt`. |
| `--color-blush` | `#f7eae4` | footer feature-badge band | The single warm pink band above the dark footer bar. |
| `--color-footer-dark` | `#474a2b` | footer contact bar | Footer contact bar background. |

Note on `--color-footer-dark`: the plan described the footer as "near-black".
It is not.
Sampling three separate regions of that bar (left, middle, right) returns `#474a2b`/`#484a2b` consistently, which is the same dark olive as the headings, not a neutral black.
The token keeps the faithful olive value and stays a separate token so the footer can be re-themed later without touching heading color.

### Ink

| Token | Hex | Sampled from | Use |
|---|---|---|---|
| `--color-ink-green` | `#45472a` | `KYTKA Z BESKYD` strokes, `VÍCE O MNĚ` button fill | H1 and all headings, nav labels, dark button fills, icon strokes. |
| `--color-ink-body` | `#423c36` | about-me paragraphs, card body copy | Body copy. Slightly warmer and browner than the heading olive, exactly as in the mockup. |

### Accent

| Token | Hex | Sampled from | Use |
|---|---|---|---|
| `--color-accent-pink` | `#c56885` | `OBJEDNAT KYTICI` and `ZOBRAZIT DALŠÍ` button fills | Decorative fills and rules only: the active-nav underline, hearts, dividers, hover washes. Not for text and not behind text. See the contrast section. |
| `--color-accent-pink-deep` | `#aa4a65` | derived from `--color-accent-pink` | Every pink that carries or backs text: filled buttons with white labels, the highlighted about-me sentence, card arrow links. |
| `--color-accent-pink-soft` | `#d899a2` | card arrow glyphs, hero heart outline | Decorative only: thin outline icons, hairline dividers, hover tints. Never text. |

`--color-accent-pink-deep` is the one deliberate deviation from the mockup, and it is small.
The mockup's pink `#c56885` gives only 3.69:1 against white and 3.29:1 against cream, so the mockup's own pink button label and its pink "Každý kus vzniká ručně..." sentence both fail WCAG AA for normal-size text.
`#aa4a65` is the same hue (343 degrees) two steps darker, clears 4.5:1 on all four cream surfaces and reaches 5.42:1 under white text, and reads as the same rose pink at a glance.
Use `accent-pink` where the pink is pure decoration and `accent-pink-deep` the moment text is involved.

### Legacy aliases (deliberate, documented choice)

`--color-brand-green` and `--color-brand-red` are **kept under their original names** and **re-pointed at the new palette**:

```css
--color-brand-green: var(--color-ink-green);   /* was #157f71 teal */
--color-brand-red: var(--color-accent-pink-deep); /* was #db1d00 red */
```

Reason: those two names are consumed by fifteen-plus places outside this task's scope (`Badge.astro`, `Menu.astro`, `Header.astro`, `ButtonCallUs.astro`, `Footer.astro`, `404.astro`, `gallery.astro`, `book.astro`, `contact.astro`, `FormBook.astro`, plus `.button-green`, `.button-red`, `.menu-item-highlighted`, `.menu-item-active`, the `section.bg-brand-*` sibling rule, the input focus ring and the Swiper bullet in `global.css` itself).
Re-pointing the values means the whole site inherits the flower-shop palette immediately, with zero edits to out-of-scope files and zero risk of a half-migrated page showing restaurant teal next to olive.
Consequently **no rule bodies in `global.css` were changed**: `.button-green`, `.button-red`, `.menu-item-highlighted` and `.menu-item-active` are byte-identical to before and now render olive and rose instead of teal and red.

New work should use the semantic names (`ink-green`, `accent-pink-deep`), not the legacy aliases.
The aliases exist to carry the old pages, and a follow-up task can retire them.

### Contrast reference (WCAG 2.1, computed not estimated)

| Foreground | Background | Ratio | Verdict |
|---|---|---|---|
| `ink-green` | `cream` | 8.56:1 | Passes AA and AAA. |
| `ink-green` | `cream-alt` | 8.94:1 | Passes AA and AAA. |
| `ink-green` | `cream-card` | 8.22:1 | Passes AA and AAA. |
| `ink-green` | `blush` | 8.16:1 | Passes AA and AAA. |
| `ink-body` | `cream` | 9.70:1 | Passes AA and AAA. |
| `ink-body` | `cream-card` | 9.31:1 | Passes AA and AAA. |
| white | `ink-green` | 9.60:1 | Passes AA and AAA. |
| white | `accent-pink-deep` | 5.42:1 | Passes AA for all text sizes. |
| `accent-pink-deep` | `cream` | 4.83:1 | Passes AA for all text sizes. |
| `accent-pink-deep` | `cream-alt` | 5.04:1 | Passes AA for all text sizes. |
| `accent-pink-deep` | `cream-card` | 4.64:1 | Passes AA for all text sizes. |
| `accent-pink-deep` | `blush` | 4.60:1 | Passes AA for all text sizes. |
| `cream` | `footer-dark` | 8.21:1 | Passes AA and AAA. |
| `blush` | `footer-dark` | 7.82:1 | Passes AA and AAA. |
| white | `accent-pink` | 3.69:1 | Large text only (>=24px, or >=18.7px bold). Do not use for buttons. |
| `accent-pink` | `cream` | 3.29:1 | Large text only. Prefer `accent-pink-deep`. |
| `accent-pink-soft` | `footer-dark` | 3.94:1 | Decoration and large text only. |
| `accent-pink-soft` | `cream` | 2.08:1 | Decoration only, never text. |

## 2. Font tokens

| Token | Family | Weights shipped | Role |
|---|---|---|---|
| `--font-display` | Cormorant Garamond | 600, 700 | The wide-tracked serif caps: H1 `KYTKA / Z BESKYD`, section headings, category card titles, footer badge titles, button labels if a heavier cap look is wanted. |
| `--font-body` | Lora | 400, 600 | Body copy, nav labels, category card copy, footer badge copy, form labels. |
| `--font-script` | Sacramento | 400 | Logo wordmark, hero tagline, `O mně`, `Moje tvorba`, the footer signature `Děkuji za vaši důvěru`. |
| `--font-inter` | Inter | unchanged | Pre-existing token, left in place for out-of-scope pages. Not used by the new homepage. |

Declared stacks (fallbacks matter, `font-display: swap` means the fallback is what users see first):

```css
--font-display: "Cormorant Garamond", Georgia, "Times New Roman", serif;
--font-body: "Lora", Georgia, "Times New Roman", serif;
--font-script: "Sacramento", "Segoe Script", cursive;
```

### Why these three

**Cormorant Garamond for `--font-display`.**
The mockup's H1 is a tracked-out old-style serif with a flagged, pointed `A` apex, flared cupped serifs on the `T`, and visibly thinner serifs than stems.
Those three traits are Garamond traits and rule out the alternatives: Playfair Display has flat didone serifs and ball terminals, Lora has heavier wedge serifs, Cinzel is too geometric, Marcellus flares too much.
Measured at the mockup's own cap height, Cormorant Garamond at weight 700 matched the mockup's stroke density within 0.01 (mockup 0.328/0.237/0.248 for K/Y/T, Cormorant 700 0.338/0.238/0.273) while keeping the delicate serif detail visible in the mockup.
Weight 700 is the H1 weight, 600 is for smaller headings and card titles.
Cormorant Garamond is a display face and gets thin fast, so it must not be used below roughly 20px.

**Lora for `--font-body`.**
The mockup sets its body copy, nav and card copy in a serif, not a sans, so leaving body text on Inter would visibly miss the design.
Lora has the large x-height, sturdy stems and moderate contrast of the mockup's body text, and unlike Cormorant it stays legible at 15-16px, which protects the accessibility pass in Task 5.
It was also the top scorer on the H1 metric test, so the two serifs are proven compatible in proportion, they simply do different jobs: Cormorant is the voice, Lora is the paragraph.

**Sacramento for `--font-script`.**
The mockup's tagline, `O mně`, `Moje tvorba` and the footer signature are all one monoline connected cursive with round bowls, long entry strokes and near-uniform stroke width.
Sacramento matches that almost exactly.
Great Vibes and Pinyon Script are far too high-contrast and formal, Dancing Script is bouncier and heavier, Alex Brush and Allura are brush-like and more slanted, Parisienne is too weighted.

### Licensing

All three families are SIL Open Font License 1.1, free for commercial use, self-hosting and modification (including subsetting).
The upstream license text is committed next to each family as `public/fonts/<family>/OFL.txt`.

- Cormorant Garamond, Catharsis Fonts, OFL 1.1.
- Lora, Cyreal, OFL 1.1.
- Sacramento, Astigmatic (AOETI), OFL 1.1.

### Files and self-hosting

Self-hosted only, following the existing `public/fonts/inter/` pattern: one weight-specific `.woff2` per face, `font-display: swap`, no remote request to `fonts.googleapis.com` or `fonts.gstatic.com` at runtime.

| File | Size |
|---|---|
| `public/fonts/cormorant-garamond/cormorant-garamond-latin-ext-600.woff2` | 27 KB |
| `public/fonts/cormorant-garamond/cormorant-garamond-latin-ext-700.woff2` | 25 KB |
| `public/fonts/lora/lora-latin-ext-400.woff2` | 24 KB |
| `public/fonts/lora/lora-latin-ext-600.woff2` | 25 KB |
| `public/fonts/sacramento/sacramento-latin-ext-400.woff2` | 26 KB |

Each file was built from the upstream Google Fonts source: variable sources were instanced to the exact static weight, then subset to latin plus latin-ext plus punctuation and arrows, then compressed to woff2.
Total added payload is about 127 KB, and only the faces a page actually uses get fetched.
Every file was verified to contain the full Czech set `Á Č Ď É Ě Í Ň Ó Ř Š Ť Ú Ů Ý Ž` and lowercase equivalents.

No npm `@fontsource` package was added, so `package.json` and `bun.lock` are unchanged by this task.
Manual subsetting was chosen because `@fontsource` ships one file per weight per subset with no control over coverage, and this way each face is a single small file that already contains Czech.

### Incidental fix: Inter had no Czech glyphs

While auditing font coverage, the twelve existing `public/fonts/inter/inter-v18-latin-*.woff2` files turned out to be the **latin subset only**, which contains no `č ě ř š ť ů ž ď ň` and none of their capitals.
Every Czech word on the current site therefore fell back mid-word to a system font for those letters, which is visible as mismatched letterforms inside a single word.
Two `unicode-range`-scoped latin-ext faces were added (`inter-v20-latin-ext-variable.woff2`, `inter-v20-latin-ext-italic-variable.woff2`, 25 KB and 27 KB, subset to U+0100-017F and friends) so those glyphs now come from Inter itself.
The twelve original files are untouched, so this cannot regress existing rendering: the new faces only claim codepoints the old ones never covered.

## 3. Tailwind class reference

Copy-paste table for Tasks 3 and 4.
Every one of these classes exists purely because of the `@theme` tokens above.

| Class | Resolves to | Use it for |
|---|---|---|
| `font-display` | Cormorant Garamond | H1, section headings, card titles, footer badge titles. |
| `font-body` | Lora | Everything that is a sentence: paragraphs, nav labels, card copy, buttons, form labels. |
| `font-script` | Sacramento | Logo wordmark, hero tagline, `O mně`, `Moje tvorba`, footer signature. |
| `bg-cream` | `#f7f1eb` | Page background, header, hero, about band. |
| `bg-cream-alt` | `#fbf6f1` | Category grid section, portfolio section. |
| `bg-cream-card` | `#f5ece2` | Category card bodies. |
| `bg-blush` | `#f7eae4` | Footer feature-badge band. |
| `bg-footer-dark` | `#474a2b` | Footer contact bar. |
| `text-ink-green` | `#45472a` | H1, headings, nav labels, card titles. |
| `text-ink-body` | `#423c36` | Paragraph copy. |
| `text-accent-pink-deep` | `#aa4a65` | Highlighted about-me sentence, card arrow links, pink links. |
| `bg-accent-pink-deep` | `#aa4a65` | Filled pink buttons (`OBJEDNAT KYTICI`, `ZOBRAZIT DALŠÍ`) with `text-white`. |
| `bg-accent-pink` / `border-accent-pink` | `#c56885` | Active-nav underline, decorative rules, hover washes. Never behind text. |
| `text-accent-pink-soft` | `#d899a2` | Outline hearts and thin decorative glyphs. |
| `text-cream` / `text-blush` | cream tones | Text on `bg-footer-dark`. |
| `focus-visible:outline-ink-green` | `#45472a` | Focus rings on cream surfaces. |

Recommended usage, matching the mockup:

- H1 `KYTKA / Z BESKYD`: `font-display font-bold text-ink-green` with wide tracking (`tracking-[0.08em]` or `tracking-widest`) and tight leading.
- Section headings `O mně`, `Moje tvorba`: `font-script text-ink-green`, roughly double the body size, no tracking (a connected script must never be letter-spaced).
- Nav labels and small caps rows: `font-body text-ink-green uppercase tracking-[0.12em] text-sm`.
- Buttons: rectangular with a very small radius in the mockup, not `rounded-full`. Filled `bg-accent-pink-deep text-white`, outline `border border-ink-green text-ink-green`. Labels `font-body font-semibold uppercase tracking-[0.1em] text-sm`.
- Body copy: `font-body text-ink-body leading-relaxed`.

## 4. Handoff notes for Tasks 3 and 4

1. **`♡` and `🌿` are not in any of these fonts.**
   Verified: no candidate serif or script contains U+2661, U+2665 or U+1F33F.
   The content contract's `O mně ♡`, `Moje tvorba 🌿` and `Děkuji za vaši důvěru ♡` must render the symbol as an inline SVG (matching the hand-drawn outline heart and leaf in the mockup) or an emoji font fallback, never as a literal character styled with `font-script`.
   Inline SVG is strongly preferred, it is what the mockup shows and it keeps the mark `aria-hidden`.
2. **`→` is not in these fonts either.**
   The pink arrow at the bottom of each category card must be an inline SVG, colored `text-accent-pink-deep`.
3. **The global `body` font was intentionally left as `font-inter`.**
   Flipping the site-wide default to Lora would restyle `about-us`, `contact`, `book`, `gallery` and `privacy-policy`, which are explicitly out of scope for this plan.
   Task 4 should apply `font-body` on the homepage wrapper or per section instead.
   Making Lora the global default is a good follow-up for `suggestions.md`.
4. **No italic face is shipped for Lora.**
   The mockup's italic-looking accents are all script, not italic serif.
   If real italic body text is needed, browsers will synthesize an oblique, which is acceptable for one or two words but should be avoided for whole paragraphs.
5. **Cormorant Garamond only above about 20px.**
   Below that it looks anaemic on cream. Small caps rows belong to `font-body` with uppercase and tracking.

## 5. Verification

- `bun run build` exits 0 with these tokens and font faces in place.
- The compiled CSS contains all five new `@font-face` blocks plus the two Inter latin-ext faces, and every `url(/fonts/...)` in it resolves to a real file that is copied into `dist/fonts/`.
- `--color-brand-green` and `--color-brand-red` resolve through `var()` to the new palette in the built output, so `.button-red` and friends now render rose and olive.
- Unused theme variables are pruned from the built CSS by Tailwind, which is expected: they materialize as soon as Task 4 uses the corresponding utility class.
- Every shipped `.woff2` was opened and checked for the complete Czech glyph set, and all strings from the content contract were test-rendered in the actual shipped files.
