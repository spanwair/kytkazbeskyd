# Suggestions - Follow-Up Work for the Flower Shop Homepage Redesign

Task 7 (Suggester) - Forward-Looking Recommendations.
Scope: things intentionally **not** implemented in this pass. This is a "not implemented in this pass" list, not a bug report - `test-report.md` already confirmed the current state is clean and nothing here is a break.
Consumed: `docs/redesign/page-spec.md`'s gap list (Section 5), `docs/redesign/content-contract.md`'s nav table (Section 2), `docs/redesign/test-report.md`, the finished `src/pages/index.astro`, and the four still-untouched subpages (`about-us.astro`, `book.astro`, `contact.astro`, `gallery.astro`).

Each item below: what, why, rough effort. Grouped into **must-do-soon** (things that are visibly broken, misleading, or that the new homepage now actively advertises without following through on) and **nice-to-have** (real improvements, but nothing on the new homepage is currently lying to a visitor about them).

---

## Must-do-soon

### 1. Dedicated pages for `Kytice`, `Věnce a dekorace`, `Svatby`, `Zahrady`

All four of these are top-level items in the main nav, but they resolve to `#kytice`, `#vence-a-dekorace`, `#svatby`, `#zahrady` - anchors that scroll to a single card on the homepage, not real pages. A visitor clicking "SVATBY" expecting a wedding-floristry page (portfolio, pricing, booking flow specific to weddings) instead lands back on the homepage they may have just scrolled past. This works as a first pass because the homepage is genuinely the site's best content right now, but it caps how deep each category can go - there's no room on a single card to show wedding season availability, garden-design process photos, or a dried-wreath size/price table (that table currently only exists, oddly, on `gallery.astro`, disconnected from the nav item it should back). Effort: medium-large - four new pages, each needs its own content (copy, pricing where relevant, a photo set beyond the one card image), built on the design system already established by Task 2-4 so they'd be fast to build once real category-specific photography exists (see item 4/5 below - this item and the photo gaps are linked; sequencing the photo shoot first means these pages get better source material from day one).

### 2. A real, dedicated `Obchod` (shop) page

Both the `OBCHOD` nav item and the cart icon route to `/book`, which is a phone-call/contact form, not a shop. This is flagged explicitly as a stopgap in `content-contract.md` (Section 2, rows 6 and 9) and in `page-spec.md`. Right now this is honest-ish because there's no shop functionality to link to, but the label "OBCHOD" actively promises browsable products, and a cart icon promises a cart. Effort: large if it means real e-commerce (see item 3); medium if the near-term fix is just a static "co si můžete objednat" catalog page with prices and a contact-to-order flow (no real cart) - that's a reasonable stepping stone and worth doing even before full e-commerce exists, since it closes the "OBCHOD promises a shop, delivers a phone form" gap cheaply.

### 3. An e-commerce/cart flow

The header ships a cart icon (per the mockup) with zero backing functionality - it's wired to `/book` as a stopgap. Either build real checkout (product catalog, cart state, payment, order fulfillment - likely needs a proper backend, not just an Astro static build) or, if the client doesn't actually want online payments, remove the cart icon from the header entirely rather than leaving a non-functional affordance that trains visitors to expect a checkout that doesn't exist. This is a real product decision for the client, not just an engineering task - flag it to them directly rather than assuming "build a cart" is the right answer. Effort: large (full e-commerce) or small (remove the icon) depending on which way the client decides.

### 4. Real owner portrait photo shoot

`page-spec.md`'s gap list (item 1) already flags this: there is no owner portrait in the 23-photo catalog at all. The About-me section's photo slot (`502ebd7d-ee28-4288-bf5d-bde666a90f60.jpeg`) is a deliberately faceless "hands arranging dried flowers" stand-in, chosen specifically so it doesn't misrepresent a real person. A section titled "O mně" (About me) that never shows the "me" is a real trust/warmth gap for a small, personal, local-artisan brand where the founder's face is often the whole marketing story. Effort: small-medium - a single portrait/lifestyle photo session (ideally a few options: a posed portrait, a candid working-in-the-garden or working-at-the-bench shot) would close this and multiple other gaps at once (also useful for `about-us.astro`, social media, and any future wedding/garden pages that want a "meet the florist" moment).

### 5. Real garden/zahrady photography

Also flagged in `page-spec.md`'s gap list (item 2): there are zero true garden/landscaping photos in the catalog. The "Zahrady a výsadby" category card uses an outdoor wildflower bouquet as a stand-in - a real photo, but of a bouquet, not of garden design or planting work, which is what that card is actually selling ("Návrhy, osazování a péče o zahrady" - designs, planting, and garden care). A visitor interested in garden design services sees a bouquet photo and gets no evidence the shop actually does that work. Effort: medium - needs a dedicated shoot of actual completed garden/planting projects (before/after shots would be even stronger), which depends on having client-approved project sites to photograph, so this may need lead time to schedule around the growing season.

### 6. Reconcile `about-us.astro` with the new design system

This page is now the most visually jarring page on the site: it sits behind the newly restyled `Header`/`Footer` (same nav, same colors) but its own body still uses the old, un-restyled look - `prose`/`font-black` typography instead of `font-display`/`font-script`, a blob-shaped `border-radius` photo mask that doesn't match the new "near-rectangular" design language, and an image literally imported under the variable name `PizzaHero` (`~/assets/images/images/about.jpg`) with the alt text `"A description of my image."` - a placeholder alt string, not real content. It also has multiple Czech typos independent of the redesign (`"malebnè"` should be `"malebné"`, `"pro mně"` should be `"pro mě"`, `"ktoru"` is Slovak not Czech, should be `"kterou"`). On top of the styling mismatch, its bio content now substantially duplicates the new homepage's `#o-mne` section (different wording, same facts: florist from Hrádek/Beskydy, background in zahradnictví, hand-made wreaths and bouquets) - `content-contract.md` already flags this duplication as something "a human [should] reconcile later." The three unused imports (`Badge`, `Button`, `ButtonCallUs`) should also be cleaned up while this page is touched. Effort: medium - either fold `about-us.astro`'s unique content (the ordering/delivery details, "Náš příběh"/"Naše filozofie" sections) into the new design system and de-duplicate against the homepage's `#o-mne` copy, or retire the page and redirect `VÍCE O MNĚ` + any external links straight to `#o-mne` if it turns out there's no unique content worth keeping once duplication is removed - worth a real content decision, not just a repaint.

### 7. `contact.astro` is in English on an otherwise all-Czech site

The `KONTAKT` nav item (a real, non-stopgap route) leads to a page with the heading `"Contact"` and body text `"Get in touch with us for any questions or inquiries."` - plain leftover template English, never localized. Every other page and the entire new homepage is Czech. This is likely the single most visible remaining "unfinished template" artifact on the whole site, since it's one of only two real (non-anchor) top-level nav destinations. Effort: small - straightforward Czech copy pass, no layout work needed, `FormContact` itself is unaffected.

---

## Nice-to-have

### 8. Newsletter or seasonal-promo section

Not present anywhere on the current homepage. A small-shop flower business has an obvious use for this - seasonal availability (bledule in spring, dahlie in autumn, Christmas wreaths in winter), pre-order windows for Mother's Day/Valentine's, or a simple "sledujte, co právě kvete" email signup. Would sit naturally as a new `Section` between the portfolio gallery and the footer badges, using the same design tokens already established. Effort: medium - needs both a UI section and a real email-capture backend/service (Mailchimp, Buttondown, or similar), plus a GDPR-compliant consent checkbox (see the existing `CookieConsent.astro` pattern for how the site already handles this).

### 9. Stronger `category_rezane` ("Květinářství v Hrádku") photo

Flagged as weak (not a hard gap) in `page-spec.md`'s gap list item 3: the mockup's card 5 reads as a florist-shop/greenhouse interior with shelved potted plants, but the catalog's best match (`d42669aa-...`) is a sunflower bouquet in a vase - a real, on-theme photo, just not the shop-interior shot the mockup implies. Worth a quick in-store photo (the actual Hrádek shop floor/counter/cooler) next time the owner is on-site; low effort, meaningfully increases authenticity for the one card that's explicitly about the physical shop location.

### 10. Overhaul `gallery.astro` and `book.astro` to match the new design system

Both pages are reachable from the homepage (`ZOBRAZIT DALŠÍ` → `/gallery`, `OBJEDNAT KYTICI`/`OBCHOD`/cart → `/book`) but still use the old centered `Heading` component, `text-brand-green`/`font-black` typography, and (in `gallery.astro`) the old `button button-green` class and a blob-masked `<Image>` on `book.astro`. Since Task 2 repointed the underlying `--color-brand-green`/`--color-brand-red` CSS variables to the new palette, these pages already inherit the *correct colors* automatically - but the *typography and component shapes* (centered prose blocks, pill-less-but-still-old button styles, blob image masks) still read as visually older than the new homepage they're one click away from. `gallery.astro` in particular has real, valuable content (a full price table, a real photo grid) that deserves the same visual polish the homepage just got. Effort: medium each - no new content strategy needed, just restyling existing content onto the Task 2 design tokens (`font-display`/`font-script`, `CategoryCard`-style photo treatment) the way Task 4 did for the homepage.

### 11. Remove or resolve dead components and leftover template data

`src/components/Grid.astro` is now imported nowhere in `src/` (it was dropped from `index.astro` during the rebuild and wasn't used elsewhere) and `src/components/Card.astro` was already dead code before this redesign (confirmed via `grep -rl "~/components/Card\.astro" src/` returning nothing). `about-us.astro` additionally imports `Badge` and `ButtonCallUs` without using either. None of this is user-visible, but it's dead weight that will confuse the next person who greps for "what uses Card.astro." Separately, `src/data/plates.json` (pizza/pasta menu data, still wired into `src/content.config.ts`'s `plates` collection) is entirely unused by any page after this redesign - worth confirming nothing else depends on it and then removing both the data file and its collection definition. Effort: small, pure cleanup, best bundled with whichever future task next touches `about-us.astro` (item 6) so the dead imports don't get fixed in isolation and then silently reintroduced.

### 12. Real Twitter/YouTube URLs or removal

`content-contract.md`'s config diff rationale (Section 3) already notes `socialMedia.twitter`/`socialMedia.youtube` in `src/data/config.ts` still point at generic placeholders (`https://twitter.com`, `https://youtube.com`) and are unused anywhere in `src/` today. Low priority since nothing currently renders these, but worth a client check: either the shop has real accounts worth linking (then get the URLs and wire them into the footer next to Facebook/Instagram) or these exports should be deleted so the codebase stops carrying fake data. Effort: trivial once the client answers the question.

### 13. Real street address for local SEO

`content-contract.md`'s diff proposal removed the fabricated `address` export from `config.ts` (sci-fi placeholder data) rather than inventing a replacement. If the client has a real, publishable business address (useful for Google Business Profile / local search / a `schema.org LocalBusiness` block), it should be sourced from them and re-added properly, ideally feeding a proper structured-data block rather than just a footer string. Effort: small once the client provides the address; slightly more if paired with adding `schema.org` structured data to `Layout.astro` for local SEO benefit.

---

## Summary

- **Must-do-soon: 7 items** (dedicated category pages, dedicated shop page, e-commerce/cart decision, owner portrait shoot, garden photography, `about-us.astro` reconciliation, `contact.astro` English-copy fix).
- **Nice-to-have: 6 items** (newsletter/seasonal-promo section, stronger shop-interior photo, `gallery.astro`/`book.astro` visual overhaul, dead-component/dead-data cleanup, social URL cleanup, real address for local SEO).
- **13 items logged in total.**
