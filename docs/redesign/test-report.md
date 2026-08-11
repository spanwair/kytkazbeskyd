# Test Report - Flower Shop Homepage Redesign

Task 6 (Tester) - Build & Functional Verification.
Scope: `src/pages/index.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/CategoryCard.astro`, `src/styles/global.css`, plus `public/` assets referenced by them.
Branch verified: `redesign/flower-shop-homepage`.
This report independently re-verifies the current working tree; it does not rely on the Task 4 implementor report or the Task 5 UX review's claims.

## Summary

**5/5 checks passed. No failures found.**

| # | Check | Result |
|---|-------|--------|
| 1 | `bun run build` | PASS |
| 2 | Internal `href` resolution (Header/Footer/index) | PASS |
| 3 | Asset path resolution (`/flowers/...`, `/fonts/...`, `/favicon...`) | PASS |
| 4 | No leftover restaurant-template references in in-scope `src/` | PASS |
| 5 | `bun run dev` smoke test (HTTP 200, non-empty body) | PASS |

---

## Check 1: `bun run build`

Command: `bun run build`

- Exit code: **0**
- Output: 7 pages built successfully (`404`, `about-us`, `book`, `contact`, `gallery`, `index`, `privacy-policy`), 29 optimized images generated, no errors or warnings in the output.

Result: **PASS**

---

## Check 2: Internal `href` resolution

Extracted every `href="..."` and `href={...}` from `src/components/Header.astro`, `src/components/Footer.astro`, and `src/pages/index.astro`. `Header.astro` renders nav items from `src/data/menus.js` (`item.url`); `index.astro` renders category links from its local `categories` array (`category.href`). Both sources are included below.

| Href | Source file | Type | Target | Resolution check | Result |
|------|-------------|------|--------|-------------------|--------|
| `/` | Header.astro (logo + mobile logo) | route | `src/pages/index.astro` | exists | PASS |
| `/book` | Header.astro (cart icon, desktop + mobile) | route | `src/pages/book.astro` | exists | PASS |
| `/` | menus.js (`Úvod`) | route | `src/pages/index.astro` | exists | PASS |
| `#kytice` | menus.js (`Kytice`) | anchor | `id="kytice"` in index.astro (category div) | confirmed present in rendered `dist/index.html` | PASS |
| `#vence-a-dekorace` | menus.js (`Věnce a dekorace`) | anchor | `id="vence-a-dekorace"` in index.astro | confirmed present in rendered `dist/index.html` | PASS |
| `#svatby` | menus.js (`Svatby`) | anchor | `id="svatby"` in index.astro | confirmed present in rendered `dist/index.html` | PASS |
| `#zahrady` | menus.js (`Zahrady`) | anchor | `id="zahrady"` in index.astro | confirmed present in rendered `dist/index.html` | PASS |
| `/book` | menus.js (`Obchod`) | route | `src/pages/book.astro` | exists | PASS |
| `#o-mne` | menus.js (`O mně`) | anchor | `<Section id="o-mne">` in index.astro | confirmed present in rendered `dist/index.html` | PASS |
| `/contact` | menus.js (`Kontakt`) | route | `src/pages/contact.astro` | exists | PASS |
| `{socialMedia.instagram.url}` | Header.astro (desktop + mobile) | external | `https://www.instagram.com/kytkazbeskyd` | valid external URL (not reachability-tested) | PASS (noted external) |
| `/privacy-policy` | Footer.astro | route | `src/pages/privacy-policy.mdx` | exists (Astro maps `.mdx` to route) | PASS |
| `{phone.href}` | Footer.astro | protocol link | `tel:+420605157739` (from `config.ts`) | not a route, valid `tel:` URI | PASS (noted external/protocol) |
| `{email.href}` | Footer.astro | protocol link | `mailto:ruszovanatalia@gmail.com` (from `config.ts`) | not a route, valid `mailto:` URI | PASS (noted external/protocol) |
| `{socialMedia.facebook.url}` | Footer.astro | external | `https://www.facebook.com/kytkazbeskyd` | valid external URL (not reachability-tested) | PASS (noted external) |
| `{socialMedia.instagram.url}` | Footer.astro | external | `https://www.instagram.com/kytkazbeskyd` | valid external URL (not reachability-tested) | PASS (noted external) |
| `/book` | index.astro (hero "OBJEDNAT KYTICI" button) | route | `src/pages/book.astro` | exists | PASS |
| `#portfolio` | index.astro (hero "PROHLÉDNOUT TVORBU" button) | anchor | `<Section id="portfolio">` in index.astro | confirmed present in rendered `dist/index.html` | PASS |
| `/about-us` | index.astro (about section "VÍCE O MNĚ" button) | route | `src/pages/about-us.astro` | exists | PASS |
| `/gallery` | index.astro (portfolio "ZOBRAZIT DALŠÍ" button) | route | `src/pages/gallery.astro` | exists | PASS |
| `#kytice` / `#vence-a-dekorace` / `#svatby` / `#zahrady` | index.astro (`category.href`, category cards 1-4) | anchor | same section ids as above | confirmed present | PASS |
| `/book` (x2) | index.astro (`category.href`, category cards 5-6: "Květinářství v Hrádku", "Doplňky pro váš den") | route | `src/pages/book.astro` | exists | PASS |

Method: extracted via `grep -o 'href="[^"]*"'` and `grep -o 'href={[^}]*}'` across the three files, then cross-referenced templated values against `src/data/menus.js` and the `categories` array in `src/pages/index.astro`. All six anchor targets were additionally confirmed as literal `id="..."` attributes in the actual built output (`dist/index.html` after `bun run build`), not just in source.

Result: **PASS** - every internal href resolves to either an existing page route or an in-page anchor that is actually rendered. External/protocol links (`tel:`, `mailto:`, Facebook, Instagram) are valid URLs/URIs, noted as external and not reachability-tested.

---

## Check 3: Asset path resolution

Extracted every `/flowers/...`, `/fonts/...`, and `/favicon...` reference from the five in-scope changed files: `src/pages/index.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/CategoryCard.astro`, `src/styles/global.css`.

- `Header.astro`, `Footer.astro`, `CategoryCard.astro`: no hardcoded `/flowers/`, `/fonts/`, or `/favicon` paths found (`CategoryCard.astro` receives its image path via the `image` prop, sourced from `index.astro`; no favicon reference in any of the three).
- `index.astro`: 14 distinct `/flowers/*.jpeg` paths referenced (1 hero image, 6 category card images, 1 about-section image, 6 portfolio images - `d42669aa-...` is reused nowhere else, all 14 are literal distinct filenames used once each).
- `global.css`: 19 distinct `/fonts/*.woff2` paths referenced across three families (`cormorant-garamond`: 2 files, `inter`: 16 files, `lora`: 2 files... see below) plus `sacramento`: 1 file.

All 14 `/flowers/` paths and all 19 `/fonts/` paths were checked against the filesystem with `[ -f public/<path> ]`:

| Asset type | Count referenced | Count found under `public/` | Result |
|---|---|---|---|
| `/flowers/*.jpeg` | 14 | 14 | PASS |
| `/fonts/*.woff2` | 19 | 19 | PASS |
| `/favicon...` | 0 (none referenced in these 5 files) | n/a | N/A |

Result: **PASS** - every referenced asset path resolves to a real file under `public/`. No favicon reference exists in the in-scope files (favicon is presumably wired in `Layout.astro`, which is out of this check's file list per the plan).

---

## Check 4: Leftover restaurant-template references

Command: `grep -rn "Pizza\|Spaghetti\|Mussels\|pizza-hero\|review-authors" src/`

Matches found (4 total, all outside the homepage scope):

| File | Line | Match | In scope for this plan? | Verdict |
|------|------|-------|--------------------------|---------|
| `src/pages/about-us.astro` | 12 | `import PizzaHero from "~/assets/images/images/about.jpg";` | No - explicitly out of scope per plan's Global Constraints (`about-us.astro` not to be touched) | Expected, not a bug |
| `src/pages/about-us.astro` | 30 | `src={PizzaHero}` | No - same file, same reason | Expected, not a bug |
| `src/data/plates.json` | 108 | `"name": "Spaghetti Carbonara"` | No - explicitly named as out-of-scope data file in this task's brief; confirmed only consumed by `src/content.config.ts`, not by any homepage file | Expected, not a bug |
| `src/data/plates.json` | 203 | `"prettyName": "Pizza"` | No - same file, same reason | Expected, not a bug |
| `src/data/plates.json` | 278 | `"name": "Spaghetti Butter & Cheese"` | No - same file, same reason | Expected, not a bug |

Zero matches inside the in-scope changed files (`src/pages/index.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/CategoryCard.astro`) - confirmed with a targeted grep restricted to those four files, which returned no output.

Result: **PASS** - all leftover restaurant-template references are confined to files the plan explicitly places out of scope for this homepage redesign (`about-us.astro`, `plates.json`). No unexpected/in-scope matches.

---

## Check 5: `bun run dev` smoke test

- Started dev server on a dedicated port to avoid colliding with any other session: `bun run dev --port 4400` (backgrounded).
- Server came up cleanly: `astro v5.18.2 ready in 450 ms`, listening on `http://localhost:4400/`.
- `curl -s -o home.html -w "%{http_code}" http://localhost:4400/` -> **HTTP 200**.
- Response body size: **101,211 bytes** (non-empty).
- Sanity spot-check: `<title>Kytka z Beskyd | Květiny tvořené srdcem</title>` present; `KYTKA` (hero H1 text) present in response body.
- Dev server was stopped afterward by killing only the two processes this check started (`bun run dev --port 4400` PID and its child `astro dev` PID). No other process was touched. Confirmed port 4400 is free and no stray `astro dev`/`4400` processes remain after cleanup.

Result: **PASS**

---

## Overall

**5/5 checks passed.** No breaks found. All internal navigation (route links and in-page anchors), all referenced image and font assets, and the dev-server-rendered homepage are functioning correctly in the current working tree. The only "leftover restaurant" grep matches are in files the plan explicitly excludes from this task's scope (`about-us.astro`, `plates.json`), and are expected, not bugs.
