# Content Contract - Kytka z Beskyd Homepage Redesign

**Task:** 1 (Organizer)
**Owns:** finalizing verbatim copy, nav routing, and the `config.ts` diff proposal.
**Consumed by:** Tasks 2-9 (do not re-derive any of this - read it here).

Verified against the mockup at `public/4225e624-95c5-49f9-8f9f-478c8345f397.png` on 2026-08-10 by direct visual inspection, including pixel-level color sampling for cross-reference. Every string below was checked character-for-character (including diacritics) against the image.

---

## 1. Verbatim Copy

Reproduced exactly from the plan's "Verbatim Copy Extracted From The Design Mockup" section. Confirmed accurate against the mockup image - no changes made.

### Navigation

Left to right: `ÚVOD`, `KYTICE`, `VĚNCE A DEKORACE`, `SVATBY`, `ZAHRADY`, `OBCHOD`, `O MNĚ`, `KONTAKT` - plus a cart icon and an Instagram icon on the far right.

### Logo

Wordmark (script font, inside circular badge): `Kytka z Beskyd`

### Hero

- H1 (two lines): `KYTKA` / `Z BESKYD`
- Tagline (italic): `Květiny tvořené srdcem, inspirované přírodou.`
  *(Mockup literally shows "inspiravané" - confirmed typo on re-inspection. Corrected to "inspirované" here. Flag in `disclaimers.md`.)*
- Bullet list (two lines, bullet-separated): `KYTICE`, `VĚNCE`, `SVATBY` / `DEKORACE`, `ZAHRADY`
- Buttons: `OBJEDNAT KYTICI` (filled/pink), `PROHLÉDNOUT TVORBU` (outline)

### Category Cards (6, left to right)

1. Title `Kytice`, subtitle `z čerstvých květin`, body `Čerstvé, sezónní a pokaždé trochu jiné.`
2. Title `Sušené květiny & věnce`, body `Originální dekorace, které vydrží.`
3. Title `Svatební floristika`, body `Kytice, korsáže, výzdoba obřadů i hostiny.`
4. Title `Zahrady a výsadby`, body `Návrhy, osazování a péče o zahrady.`
5. Title `Květinářství v Hrádku`, body `Řezané květiny, pokojovky, trvalky a drobné dárky.`
6. Title `Doplňky pro váš den`, body `Korsáže, hřebínky a další detaily.`
   *(Mockup literally shows a stray period: "hřebínky. a další" - confirmed typo on re-inspection. Corrected here. Flag in `disclaimers.md`.)*

### About Section

- Heading: `O mně ♡`
- Paragraph 1: `Květiny jsou součástí mého života už od mládí.`
- Paragraph 2: `Po letech práce v zahradnictví a vlastní zahradnické praxi jsem se naplno věnovala floristice.`
- Paragraph 3: `Dnes pod značkou Kytka z Beskyd tvořím kytice, věnce a dekorace, při pravé svatební floristice a věnuji se také návrhům a výsadbám zahrad.`
- Paragraph 4: `Mám ráda přirozený, trochu rozkvetlý styl a květiny, které vyprávějí, jako by přišly ze zahrady nebo beskydské louky.`
- Highlighted line (pink): `Každý kus vzniká ručně a žádné dvě kytice nejsou úplně stejné.`
- Button: `VÍCE O MNĚ`

### Portfolio Section

- Heading: `Moje tvorba 🌿`
- Button: `ZOBRAZIT DALŠÍ`

### Footer

- Badge 1: `Čerstvé a sezónní` - `Pracuji s květinami, které jsou právě v sezóně.`
- Badge 2: `Ruční práce` - `Každou kytici nebo dekoraci vytvářím s láskou a pečlivostí.`
- Badge 3: `Lokálně z Beskyd` - `Inspiraci čerpám z přírody kolem nás.`
- Badge 4: `Osobní přístup` - `Ráda s vámi vše proberu a poradím.`
- Signature (script, pink): `Děkuji za vaši důvěru ♡`
- Copyright: reuse existing pattern from `src/components/Footer.astro`: `© {year} {siteName}. Všechna práva vyhraná.` + privacy policy link (`/privacy-policy`).
- Contact: use REAL values from `src/data/config.ts` - `phone.label` (`605 157 739`), `email.label` (`ruszovanatalia@gmail.com`) - **not** the mockup's placeholder `+420 123 456 789` / `natalia.ruszova@email.cz`.

---

## 2. Nav Table (Final)

The new homepage is a single page (`src/pages/index.astro`). Items with a matching homepage section route to an in-page anchor; items without one route to the closest existing page per the plan's explicit instruction. No entry is a TBD.

| # | Nav Label | `href` | Target | Notes |
|---|---|---|---|---|
| 1 | `ÚVOD` | `/` | Homepage (top) | Already the current page when on `/`; also works as a return-home link from subpages. |
| 2 | `KYTICE` | `#kytice` | Category card 1 (`Kytice`) | Anchor `id="kytice"` on that card's wrapping element in the category grid. |
| 3 | `VĚNCE A DEKORACE` | `#vence-a-dekorace` | Category card 2 (`Sušené květiny & věnce`) | Anchor `id="vence-a-dekorace"`. Nav label and card title differ (nav says "věnce a dekorace", card says "sušené květiny & věnce") - this is how the mockup itself labels them; not a discrepancy to fix, just noting the mapping isn't 1:1 by name. |
| 4 | `SVATBY` | `#svatby` | Category card 3 (`Svatební floristika`) | Anchor `id="svatby"`. |
| 5 | `ZAHRADY` | `#zahrady` | Category card 4 (`Zahrady a výsadby`) | Anchor `id="zahrady"`. |
| 6 | `OBCHOD` | `/book` | Existing booking/contact page | No homepage section exists for a shop. `/book` is the closest existing equivalent (a contact/booking form), not an actual e-commerce page. **Stopgap** - flag for a dedicated shop page in `suggestions.md` (Task 7). |
| 7 | `O MNĚ` | `#o-mne` | About section | Anchor `id="o-mne"` on the about section. `/about-us` also still exists as a separate, deeper page (out of scope to modify or delete per Global Constraints) - the homepage anchor and the standalone page are two different destinations for related content; this duplication should be reconciled by a human later (flag in `suggestions.md`). |
| 8 | `KONTAKT` | `/contact` | Existing contact page | No homepage section exists for contact. Routes to the existing `/contact` page per the plan's explicit instruction. |
| 9 | Cart icon | `/book` | Existing booking/contact page | No cart/checkout functionality exists (mockup shows the icon with no backing e-commerce flow). Same stopgap treatment as `OBCHOD` - flag for a real cart/shop flow in `suggestions.md`. |
| 10 | Instagram icon | `https://www.instagram.com/kytkazbeskyd` | External | Real URL, matches `Footer.astro`'s existing usage and the corrected `config.ts` `socialMedia.instagram.url` (see diff below). Open in new tab (`target="_blank" rel="noopener noreferrer"`), same pattern as `Footer.astro`'s existing social links. |

Anchor IDs to create in `src/pages/index.astro` (Task 4): `kytice`, `vence-a-dekorace`, `svatby`, `zahrady`, `o-mne`. Task 3 (Designer) should place these `id` attributes on the section/card wrapper elements it specifies in `page-spec.md`.

---

## 3. `src/data/config.ts` Diff Proposal

**Not applied here - Task 4 applies this exactly.** Only genuinely wrong placeholder values are touched. `phone` and `email` are already correct real values and are left unchanged. `hours` is left unchanged - it isn't called out in the plan's fix list, isn't shown anywhere in the mockup, and there's no evidence it's wrong (Global Constraints forbid inventing or second-guessing business facts not visible in `config.ts` or the mockup).

```diff
 export const siteLang = "cs-CZ";
 export const siteCurrency = "CZK";
 export const siteDomain = "kytkazbeskyd.cz";
 export const siteName = "Kytka z beskyd";
-export const siteSlogan = "The best pies in the galaxy!";
-export const themeColor = "#FF0000";
+export const siteSlogan = "Květiny tvořené srdcem, inspirované přírodou.";
+export const themeColor = "#C2628A";

 export const phone = {
   href: "tel:+420605157739",
   label: "605 157 739",
 };

 export const email = {
   href: "mailto:ruszovanatalia@gmail.com",
   label: "ruszovanatalia@gmail.com",
 };

-export const address = {
-  street: "1234 Space Street",
-  city: "Galaxy City",
-  zip: "12345",
-  state: "Milky Way",
-  country: "Space",
-};
-
 export const socialMedia = {
   facebook: {
-    url: "https://facebook.com",
+    url: "https://www.facebook.com/kytkazbeskyd",
     label: "Facebook",
     icon: "facebook",
   },
   twitter: {
     url: "https://twitter.com",
     label: "Twitter",
     icon: "twitter",
   },
   instagram: {
-    url: "https://instagram.com",
+    url: "https://www.instagram.com/kytkazbeskyd",
     label: "Instagram",
     icon: "instagram",
   },
   youtube: {
     url: "https://youtube.com",
     label: "YouTube",
     icon: "youtube",
   },
 };
```

### Rationale per change

- **`siteSlogan`**: `"The best pies in the galaxy!"` is leftover restaurant-template placeholder text, obviously wrong for a flower shop. Replaced with the hero tagline (already Czech, already client-facing copy in this same contract), which is a reasonable, non-invented stand-in for a one-line site slogan.
- **`themeColor`**: `"#FF0000"` (pure red) is the restaurant template's leftover brand red. `#C2628A` is a same-family estimate of the mockup's filled-button pink, sampled directly from the mockup image (button fill pixels read `#C65F7F`/`#BF6680`; `#C2628A` is a rounded midpoint). **This is a placeholder pending Task 2.** Task 2 (Powerful Designer) owns exact color sampling and will define the canonical `--color-accent-pink` token in `global.css`; Task 4 should set `themeColor` to that token's final hex value rather than this approximation if the two differ even slightly, so the browser chrome tint and the site's actual accent color stay in sync.
- **`address`**: the existing object (`"1234 Space Street", "Galaxy City", "Milky Way", "Space"`) is obviously fabricated sci-fi placeholder data, not a real address. It is unused anywhere else in `src/` (`grep -rn "address\b" src/` outside `config.ts` returns nothing), so removing the export is a clean, safe fix rather than replacing fake data with more invented data - which Global Constraints forbid. If the client has a real street address to publish (e.g. for local SEO / schema.org / a contact page), that must come from the client, not be invented here; flag this in `disclaimers.md`.
- **`socialMedia.facebook.url` / `socialMedia.instagram.url`**: replaced with the real URLs already hard-coded in `src/components/Footer.astro` (`https://www.facebook.com/kytkazbeskyd`, `https://www.instagram.com/kytkazbeskyd`), so `config.ts` stops disagreeing with the one place in the app that already has the correct values.
- **`socialMedia.twitter` / `socialMedia.youtube`**: left unchanged. The plan's fix list names only Facebook and Instagram (the two icons actually present in the mockup and in `Footer.astro`). Twitter/YouTube URLs are still generic placeholders (`https://twitter.com`, `https://youtube.com`) and the export is unused elsewhere in `src/` today, so this doesn't yet cause any user-facing wrong link - but it's still fake data sitting in the codebase. Flag in `disclaimers.md`/`suggestions.md`: either get real Twitter/YouTube URLs from the client or remove these two entries; not decided here since it's outside this plan's explicitly named fix list.

### Note for Task 4 (informational, not a mandate - `Layout.astro` is Task 4's file)

`src/layouts/Layout.astro` imports `themeColor` from `config.ts` but never actually uses the imported variable - the `<meta name="theme-color">` tag on line 17 is hard-coded to `"#E6F4FF"` instead of `{themeColor}`. This is a pre-existing bug, unrelated to this redesign, but Task 4 touches `Layout.astro` anyway (for `og:description`/title per its own brief) and may want to fix this in passing so the corrected `themeColor` value actually reaches the page.

---

## Verification

Re-read the mockup image directly (`public/4225e624-95c5-49f9-8f9f-478c8345f397.png`) and compared every string above against it character-for-character, including diacritics. All strings match Section 1 above exactly, including both documented typo corrections. Nav labels (8 items + cart icon + Instagram icon) confirmed in the exact left-to-right order listed in Section 2.
