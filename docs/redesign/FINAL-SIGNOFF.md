# Final Sign-off - Kytka z Beskyd Homepage Redesign

**Task:** 9 (Agent Owner)
**Branch:** `redesign/flower-shop-homepage` (based on `main`, not merged)
**Reviewed at:** commit `172eade` plus the four fixes this task applied on top (see Section 4).
**Scope of this review:** the entire `main...HEAD` diff, read in full, plus all eight prior deliverables under `docs/redesign/`.

---

## 0. Recommendation: NO-GO (do not merge yet)

**Do not merge this branch into `main` in its current state.**

There are two independent gates, one technical and one legal.
Both are described in full below; neither is a reason to throw away the work, which is otherwise well built and well documented.

| # | Gate | Type | Who resolves it |
|---|---|---|---|
| **B1** | The production build ships the homepage with ~49 of its CSS rules missing. The page is visually broken in `bun run build` output, while being correct in `bun run dev`. | Technical, introduced by this branch | Engineering, before merge |
| **B2** | Photo usage rights for all 23 client photos are unverified (`disclaimers.md` item e), and `main` auto-deploys to the public internet on every push. | Legal / client | Client confirmation, before merge |

B2 is the item the human most needs to know about and is covered in Section 3.
B1 is new, was not found by any of the eight prior specialists, and is covered immediately below.

---

## 1. BLOCKING FINDING B1: the production build silently drops most of the homepage's CSS

### What happens

`bun run build` exits 0 and reports success, but the HTML it emits for the homepage references dozens of Tailwind utility classes for which **no CSS rule exists anywhere in the delivered page** - not in the inlined `<style>` block, and not in the linked stylesheet.

Measured on the current HEAD build, counting class tokens present in the rendered markup that have no matching rule in the inlined CSS plus every file in `dist/_astro/*.css`:

| Page | Class tokens used | Tokens with no CSS rule delivered |
|---|---|---|
| `index.html` (the deliverable of this whole plan) | 164 | **49** |
| `gallery/index.html` | 156 | 35 |
| `book/index.html` | 152 | 32 |
| `contact/index.html` | 141 | 22 |
| `about-us/index.html` | 125 | 8 |

The missing rules on the homepage are not cosmetic edge cases.
They include:

- `lg:grid-cols-6`, `xl:grid-cols-6`, `lg:grid-cols-3`, `lg:grid-cols-2`, `grid-cols-2`, `sm:grid-cols-3` - so the category grid and the portfolio grid never leave their single or two-column mobile layout, at any viewport width.
- `bg-cream-alt`, `bg-cream-card`, `bg-accent-pink-deep`, `bg-ink-green` - so the alternating section bands, the category card surfaces and both filled buttons render with no background colour at all.
- `object-cover`, `aspect-square`, `aspect-[4/5]`, `rounded-sm`, `rounded-t-sm`, `h-full`, `overflow-hidden` - so every photo on the page renders unclipped and unconstrained.
- `text-accent-pink-deep`, `text-accent-pink-soft`, `font-semibold`, `leading-relaxed`, `tracking-[0.08em]`, `text-3xl`, `text-5xl`, `lg:text-6xl`, `md:text-4xl`.
- **Every single `focus-visible:outline-*` rule**, which means the entire focus-visibility fix that Task 5 applied across 19 interactive elements is absent from the shipped page.
- Every `hover:*` state in the header, footer and buttons.

### Cause

The `@playform/inline` integration (`Beasties: true` in `astro.config.mjs`) performs a critical-CSS pass.
All seven pages share a single Tailwind CSS chunk, which Astro happens to name after `about-us`.
Beasties inlines a per-page "critical" subset into each page's `<head>` and then rewrites that shared chunk, removing what it inlined.
Because the same physical file is rewritten once per page, rules that an earlier page consumed are no longer available to a later page, and the shared file ends up truncated.

Observed on this branch: the shared stylesheet ends the build at **5,143 bytes**.
With the integration disabled it is **49,812 bytes**.

### Proof it is this integration, and that it is a regression

I temporarily removed `playformInline(...)` from `astro.config.mjs`, rebuilt, re-ran the identical audit, and restored the config afterwards (`astro.config.mjs` is unmodified in this branch and in my commit - verified with `git diff`).

| Page | Missing rules, inliner ON | Missing rules, inliner OFF |
|---|---|---|
| `index` | 49 | **0** |
| `about-us` | 8 | **0** |
| `contact` | 22 | **0** |
| `book` | 32 | **0** |
| `gallery` | 35 | 3 (all false positives of the audit: `masonry-grid`, `masonry-grid-item`, `[&>.container]:pb-0`) |

I also built `main` in a throwaway git worktree and ran the same audit against it.
**`main`'s homepage build is clean**: 162 tokens, 0 genuinely missing.
So this is a regression in the shipped artifact of this branch, not a pre-existing condition the branch inherited.

The underlying flaw in the integration is pre-existing, but it only becomes destructive now.
`main`'s homepage leaned on `prose`, component classes and a handful of utilities; the rebuilt homepage depends on 164 utility classes, which is what pushes the shared-chunk rewrite over the edge.

### Why eight specialists missed it

Every prior verification of the rendered page went through `bun run dev`.
The Implementor curled the dev server (report Section 5), the UX reviewer curled the dev server (`ux-review.md` Section 1, method step 2), and the Tester's Check 5 smoke test curled the dev server on port 4400.
The dev server does not run the `@playform/inline` build step, so the page is genuinely correct there.
The Tester's Check 1 confirmed `bun run build` exits 0, which it does - the build does not fail, it silently emits an incomplete stylesheet.
Nobody opened `dist/` and compared the emitted HTML against the emitted CSS.

### What I did not do, and why

I did **not** fix this myself.
The one-line fix is to drop `playformInline` from `astro.config.mjs`, but that removes a performance optimisation the project deliberately adopted, changes the build pipeline for all seven pages, and is a correctness-versus-performance decision that belongs to the team rather than to a sign-off pass.
There may also be a correct configuration of the integration (per-page chunking, or a Beasties option that does not prune the shared source) that keeps the optimisation.
Per this plan's Process Adaptation, substantial findings get written up rather than patched at sign-off, so this is filed as blocking.

### Suggested resolution

1. Reproduce with: `bun run build`, then compare the class tokens in `dist/index.html` against the CSS delivered to that page.
2. Either remove `@playform/inline`, or configure it so it does not prune a stylesheet shared by multiple pages.
3. Add a build-output check to the verification routine so "the build exited 0" is never again mistaken for "the built page is correct". This is the single most valuable process fix to come out of this branch.

---

## 2. What was delivered

### Application code (8 files)

| File | What changed |
|---|---|
| `src/pages/index.astro` | Full rewrite. Hero, 6-card category grid, About-me, portfolio gallery. All pizza/restaurant markup, imports and the reviews section removed. |
| `src/components/CategoryCard.astro` | **New.** Category card component: photo, optional icon slot, title, optional subtitle, body, arrow link. |
| `src/components/Header.astro` | Restyled. Script-wordmark circular logo replaces the raster logo, 8 nav items desktop and mobile, cart and Instagram icons, new colour tokens, `role="dialog"` on the mobile panel. |
| `src/components/Footer.astro` | Full restructure. Blush band with 4 feature badges, dark olive contact bar with real phone/email, social icons, script signature, copyright. |
| `src/data/config.ts` | Pizza-template `siteSlogan` and `themeColor` replaced, fabricated `address` export removed, real Facebook/Instagram URLs. |
| `src/data/menus.js` | 4-item pizza nav replaced with the 8-item flower-shop nav. |
| `src/layouts/Layout.astro` | Title, description, Open Graph and Twitter tags rebranded. `theme-color` now actually uses the imported `themeColor` (pre-existing bug fixed in passing). |
| `src/styles/global.css` | New `@theme` block: 5 surface colours, 2 ink colours, 3 accent pinks, 3 font tokens. Legacy `--color-brand-green` / `--color-brand-red` kept by name and re-pointed at the new palette. 5 new `@font-face` blocks plus 2 Inter latin-ext faces. |

### Assets (36 files)

- `public/flowers/*.jpeg` - 23 client product photos.
- `public/flowers-catalog.json` - AI-generated (Gemma) metadata for those 23 photos.
- `public/4225e624-95c5-49f9-8f9f-478c8345f397.png` - the design mockup.
- `public/fonts/` - 5 new self-hosted `.woff2` faces (Cormorant Garamond 600/700, Lora 400/600, Sacramento 400), 2 Inter latin-ext faces, and 3 `OFL.txt` licence files. All SIL OFL 1.1, cleared for commercial use. About 127 KB total.

### Documentation (10 files)

`docs/superpowers/plans/2026-08-10-flower-shop-homepage-redesign.md` plus, under `docs/redesign/`: `STATUS.md`, `content-contract.md`, `design-system.md`, `page-spec.md`, `task-4-implementor-report.md`, `ux-review.md`, `test-report.md`, `suggestions.md`, `disclaimers.md`, and this document.

---

## 3. What is verified working

### Verified by the Tester (Task 6)

`test-report.md` records **5/5 checks passed**: `bun run build` exit 0, every internal `href` resolving to a real route or a rendered in-page anchor, all 14 `/flowers/` and all 19 `/fonts/` paths resolving to real files under `public/`, no leftover restaurant-template references in in-scope files, and a `bun run dev` smoke test returning HTTP 200 with a 101 KB body.

### Verified independently by me, on current HEAD

- **`bun run build` exits 0**, 7 pages built, no errors or warnings. Re-run after my own fixes: still exit 0. I did not rely on the Tester's run; there were commits after it.
- **Content fidelity.** Every copy string, nav href, anchor id and image filename in `index.astro`, `Header.astro` and `Footer.astro` matches `content-contract.md` and `page-spec.md`. Both documented mockup typo corrections are present in the shipped source. All 14 image filenames are distinct and exist on disk.
- **Design token discipline.** No ad hoc hex codes and no inline `font-family` anywhere in the changed source. Every colour and font resolves through a `@theme` token.
- **Accessibility fixes landed.** The four items `ux-review.md` filed for the Implementor were all fixed in commit `dbe0932`: the footer signature moved from `text-accent-pink` (2.49:1, failing) to `text-blush` (7.82:1), `sr-only` `h2` headings were added before the category grid and the footer badge band, and `p-2` padding was added to the four undersized icon links. **Note:** `ux-review.md` and `STATUS.md` were never updated to record this, so both still read as if four accessibility issues are open. They are not. That is a documentation staleness issue only.
- **Dead code.** The deliberately-unused components (`Grid`, `Card`, `Heading`, `Badge`, `WideImage`) are as documented in `page-spec.md` Section 1. No unused imports remain in any changed file.

### Important caveat on all of the above

Everything in this section describes the **source** and the **dev-server render**, both of which are correct.
None of it survives contact with the production build while blocking finding B1 stands.

---

## 4. Fixes I applied directly

Four small, mechanical fixes, all verified in the built output.
Nothing structural, no layout, colour or copy changes.

### 4.1 `text-2xl` was silently dead on all 10 `<h3>` elements

`global.css` declares `h1, h2, h3 { ... }` and `h3 { font-size: var(--text-4xl) }` as **unlayered** CSS, while Tailwind utilities live in `@layer utilities`.
Under the CSS cascade, normal unlayered declarations beat normal layered ones regardless of specificity.
I verified this against the built output by brace-walking the `@layer utilities` block: `.text-2xl` sits at byte 26397, inside the layer (9066-30262), while the bare `h3` font-size rule sits at byte 31014, outside it.

Effect: the 6 category card titles and the 4 footer badge titles rendered at 2.25rem on mobile and 3rem at `lg` and up, instead of the intended 1.5rem.
In the `xl:grid-cols-6` layout each card is roughly 180px wide, so a 48px title wraps to several lines and wrecks the card grid.

**Fixed** in `src/components/CategoryCard.astro` and `src/components/Footer.astro` by changing `text-2xl` to `text-2xl!`.
Confirmed in the built CSS: `.text-2xl\!{font-size:var(--text-2xl)!important;...}`.

This is a band-aid.
The proper fix is to move `global.css`'s bare element rules into `@layer base`, which would also fix 4.2 below and remove a whole class of silent overrides.
I did not do that, because it changes cascade behaviour for the six out-of-scope pages.
Recommended as follow-up.

### 4.2 Script headings were being faux-bolded

The same unlayered rule sets `font-weight: bold` on `h1, h2, h3`.
The two script headings (`O mně`, `Moje tvorba`) use Sacramento, for which `design-system.md` ships weight 400 only, so the browser synthesises a fake bold on a delicate connected script.
The header logo uses the same face in a `<span>` and therefore renders at a true 400, so the logo and the section headings were rendering the same typeface at visibly different weights.

**Fixed** by adding `font-normal!` to both headings in `src/pages/index.astro`.
Note that this fix cannot take effect until B1 is resolved, because the `.font-normal\!` rule is one of the rules the inliner currently destroys.

### 4.3 Five of the eight nav items were dead on every page except the homepage

`menus.js` used bare fragment hrefs (`#kytice`, `#vence-a-dekorace`, `#svatby`, `#zahrady`, `#o-mne`).
`Header.astro` renders site-wide, so on `/contact`, `/book`, `/about-us`, `/gallery`, `/privacy-policy` and `/404` those five items resolved to `/contact#kytice` and similar, which do not exist.
Clicking them did nothing.
The Tester's Check 2 verified each anchor exists in `index.astro`, which is true, but the check was scoped to the homepage.

**Fixed** by changing them to root-relative `/#kytice` and so on.
This is correct in both directions: from a subpage it navigates home and scrolls, and on the homepage itself the path is unchanged so the browser simply scrolls to the fragment (Astro's `ClientRouter` explicitly passes same-path hash links through to the browser).
Verified in the built output that all five now render as `/#...` on both `dist/index.html` and `dist/contact/index.html`.

---

## 5. Non-blocking findings for the human

None of these justify holding the merge on their own.
They are recorded because nobody else caught them.

1. **The design mockup and the AI catalogue are published to the live site.** `public/4225e624-...png` (2.4 MB) and `public/flowers-catalog.json` (40 KB) are copied verbatim into `dist/` and would be served at `https://<site>/4225e624-...png` and `/flowers-catalog.json`. They are not linked from anywhere, but they are public. The catalogue also exposes internal tooling detail (`"endpoint": "http://0.0.0.0:8080/v1/chat/completions"`). Consider moving both to `docs/` before deploying. Note that all eight prior documents reference the mockup by its `public/` path, so a move means updating those references.

2. **`siteName` is `"Kytka z beskyd"` with a lowercase b**, and it renders that way in the footer copyright line, while the logo, the `<title>`, the `og:site_name` and the H1 all use "Kytka z Beskyd". The plan's Global Constraints say that where the mockup and `config.ts` disagree the `config.ts` value wins **and the discrepancy gets recorded in `disclaimers.md`**. The value was correctly left alone, but the discrepancy was never recorded. Recording it here. It is a one-character change if the client wants the capitalised form.

3. **`Layout.astro` destructures `pageTitle`, `title` and `description` from `Astro.props` and never uses any of them.** All seven pages pass them and all seven get the same hardcoded title and meta description, which is now the flower-shop homepage copy. This is a pre-existing pattern rather than a regression, but the redesign touched exactly those lines and left three dead variables behind. Worth fixing alongside the per-page SEO work, which is not currently in `suggestions.md`.

4. **`suggestions.md` item 11's dead-component list is incomplete.** It names `Grid.astro` and `Card.astro`. `ReviewSlider.astro` and `WideImage.astro` also became orphaned by this branch (both were imported only by `index.astro`), and `Menu.astro` was already dead before it. Five dead components, not two.

5. **Four of the six "Zobrazit více" card links go nowhere useful.** Cards 1-4 link to their own wrapper's anchor id, so clicking scrolls the card to itself. This is exactly what `page-spec.md` Section 2.3 specified, so it is not a deviation, but it is a dead affordance repeated six times on the page. It resolves naturally once `suggestions.md` item 1 (real category pages) is built.

6. **`astro.config.mjs` still declares `site: "https://astropie.netlify.app"`**, the template's placeholder, while `config.ts` says `kytkazbeskyd.cz` and deployment is GitHub Pages. Untouched by this branch and harmless today, but it will produce wrong canonical and sitemap URLs the moment either is added.

7. **The deploy workflow uses `npm ci` while the project is bun-managed.** `.github/workflows/static.yml` installs with `npm ci` from `package-lock.json`. This branch adds no dependencies (the fonts are self-hosted files, not packages), so the two lockfiles cannot drift as a result of this work, but the mismatch is worth reconciling.

8. **`pnpm-lock.yaml` and `pnpm-workspace.yaml` are untracked in the working tree.** They were created by an unrelated process, as recorded in `task-4-implementor-report.md` Section 6. I deliberately did not stage them, and I did not use `git add -A` for that reason. They should be deleted or gitignored.

---

## 6. What is explicitly NOT done and needs human input

### 6.1 THE ONE THING TO READ: photo usage rights are unverified, and merging publishes

`disclaimers.md` item (e) is the highest-severity item in this entire body of work, and it is a legal exposure rather than a quality issue.

**None of the 23 photographs in `public/flowers/` has had its provenance, licensing, or ownership verified by anyone on this team.**
No EXIF or copyright check, no reverse image search, and `flowers-catalog.json` records no ownership information at all.
Those photos are the hero image, all 6 category cards, the About-me photo and all 6 portfolio images, which is to say essentially the entire visual surface of the new homepage.
Several are tagged `"contains_people": true`, so identifiable individuals may appear, which raises a right-of-publicity question on top of the copyright one.

The disclaimer recommends treating this as a hard blocker for public deployment.
**That recommendation converts directly into a blocker for merging this branch**, and I do not believe anyone in the chain noticed why:

`.github/workflows/static.yml` triggers on `push` to `branches: [ main ]` and deploys `dist/` to GitHub Pages.
**Merging this branch into `main` and pushing publishes it to the public internet immediately, with no manual approval step.**
There is no staging environment in this repository.

So the sequencing must be: confirm photo rights with the client **first**, then merge.
Not merge now and sort the rights out before some later, separate deployment, because no such separate deployment exists.

### 6.2 The other five client-confirmation items

From `disclaimers.md`, all of which need the client rather than the team:

- (a) Two mockup typos were corrected silently relative to the client's original design; the client should confirm the corrected wording.
- (b) The real phone and email from `config.ts` were used instead of the mockup's placeholders; nobody verified those values against an external source.
- (c) Three image slots have no real photo behind them. There is no owner portrait in the set at all, so the "O mně" section shows a deliberately faceless stand-in; there are no garden photos, so the "Zahrady a výsadby" card shows a bouquet; and there is no shop interior, so "Květinářství v Hrádku" shows a vase. A photo shoot closes all three.
- (d) Every `description_cs`, `category` and `alt_text_cs` in the catalogue was generated by a Gemma vision model with no human review. Three of the fourteen alt strings used on the homepage contained real Czech-language errors and had to be corrected, which is a roughly 21% error rate among the strings anyone looked at closely. The other nine catalogue entries have not been checked at all.
- (f) The pre-existing cookie consent implementation is `localStorage`-only, has no withdrawal path and no preference UI, and its banner is visually inconsistent with the new design. Unchanged by this work, flagged for awareness.

### 6.3 Follow-up work

`suggestions.md` logs 13 items, 7 must-do-soon and 6 nice-to-have.
The ones that most directly affect what a visitor experiences today:

- Five nav destinations are stopgaps. `OBCHOD` and the cart icon both point at `/book`, a contact form, not a shop. `KYTICE`, `VĚNCE A DEKORACE`, `SVATBY` and `ZAHRADY` point at single homepage cards rather than real pages.
- The header ships a cart icon with no checkout behind it. Either build one or remove the icon; leaving a non-functional cart is worse than having neither.
- `contact.astro` is still in English (`"Contact"`, `"Get in touch with us..."`) on an otherwise entirely Czech site, and it is one of only two real top-level nav destinations.
- `about-us.astro` still uses the old styling, still imports its photo under the variable name `PizzaHero` with the alt text `"A description of my image."`, has several Czech typos, and now substantially duplicates the homepage's `#o-mne` copy.

---

## 7. Summary

The design and content work on this branch is genuinely good.
The eight-stage pipeline did what it was supposed to do: the content contract is exact, the colour tokens were sampled rather than guessed and the contrast maths checks out, the image-to-slot mapping is justified photo by photo with its gaps declared rather than hidden, the UX pass found a real WCAG failure the design documents had missed, and the disclaimer audit is unusually honest about what nobody verified.
The two self-corrections in the record - the Implementor amending its own report after review caught an undisclosed deviation, and the alt-text corrections being brought into a documented pattern - are the sign of a process that was working.

What the pipeline did not have was anyone looking at the artifact it actually produces.
Every render check in this branch went through the dev server; the one check that touched the real build only asserted that it exited 0.
That is how a homepage that is perfect in source and perfect in `bun run dev` came to be shipped with a third of its stylesheet missing.

**Recommendation: NO-GO.**
Fix B1, get the client's answer on photo rights, then merge.
Everything else in this document can be scheduled rather than resolved first.
