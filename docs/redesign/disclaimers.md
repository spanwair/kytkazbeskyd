# Disclaimers - Risk, Placeholder & Compliance Audit

**Task:** 8 (Disclaimer Agent)
**Scope:** read-only audit. This document does not modify any application file - it consolidates risks and open items that need client confirmation before this redesign goes live.
**Consumes:** `docs/redesign/content-contract.md`, `docs/redesign/design-system.md`, `docs/redesign/page-spec.md`, `docs/redesign/ux-review.md`, `docs/redesign/test-report.md`, `public/flowers-catalog.json`, `src/components/CookieConsent.astro`, `src/data/config.ts`, `src/pages/index.astro`.

Each section below is independently actionable. Items that require an explicit client decision or confirmation before public deployment are marked **CLIENT CONFIRMATION NEEDED**. There are **6** such items across this document (one per section, a-f).

---

## (a) Corrected mockup typos

The design mockup (`public/4225e624-95c5-49f9-8f9f-478c8345f397.png`) contains two typos. Both were corrected during implementation rather than shipped verbatim. Verified present in the corrected form in the live `src/pages/index.astro` (checked directly, not just in docs):

| # | Location | Mockup text (before) | Shipped text (after) | Verified in `index.astro` |
|---|---|---|---|---|
| 1 | Hero tagline | `Květiny tvořené srdcem, inspiravané přírodou.` | `Květiny tvořené srdcem, inspirované přírodou.` | Line 97 - confirmed "inspirované" (corrected spelling) is what actually shipped. |
| 2 | Category card 6 body | `Korsáže, hřebínky. a další detaily.` (stray period) | `Korsáže, hřebínky a další detaily.` | Line 52 - confirmed no stray period in the shipped string. |

**CLIENT CONFIRMATION NEEDED:** the client should be told these two corrections were made silently relative to their original mockup, and should confirm the corrected wording is what they actually want published (in case "inspiravané" or the stray period were intentional stylistic choices rather than typos - unlikely, but not this team's call to assume away without saying so).

---

## (b) Phone/email discrepancy: mockup placeholder vs. real `config.ts`

The mockup shows placeholder contact details in the footer that do not belong to the client:

| Field | Mockup placeholder | Real value used (from `src/data/config.ts`) |
|---|---|---|
| Phone | `+420 123 456 789` | `605 157 739` (`phone.label`, `href="tel:+420605157739"`) |
| Email | `natalia.ruszova@email.cz` | `ruszovanatalia@gmail.com` (`email.label`, `href="mailto:ruszovanatalia@gmail.com"`) |

Per the plan's Global Constraints, the real `config.ts` values were used throughout (footer contact bar) rather than the mockup's placeholders, since `config.ts` is presumed to hold the client's actual, already-correct contact information and no plan step called either value into question. This discrepancy was not silently resolved - it is recorded here as instructed.

**CLIENT CONFIRMATION NEEDED:** confirm `605 157 739` and `ruszovanatalia@gmail.com` are the correct, current, publicly-postable phone number and email address for the business. Nobody on this team independently verified these against an external source (e.g. calling the number, checking a business registry) - they were only cross-checked internally against the pre-existing `config.ts` file, which itself is unverified against any client-provided source of truth.

---

## (c) Image-to-slot gaps (`page-spec.md` Section 5)

Three gaps were identified when mapping the 23 real product photos in `public/flowers/` onto the mockup's image slots. In every case, a thematically-adjacent real photo was used as a stand-in rather than inventing or sourcing a new image. None of the three gaps are cosmetic - they represent content the site is currently showing that isn't really what the slot calls for.

| # | Slot | Gap | Stand-in used | Filename |
|---|---|---|---|---|
| 1 | `portrait_owner` (About-me section photo) | **No owner portrait exists in the photo set at all.** The catalog has zero images tagged as a florist/owner headshot. | A deliberately faceless "hands arranging dried flowers" photo, chosen specifically so it does not misrepresent a specific (wrong) person as the owner. Alt text was written to avoid claiming it depicts "the owner." | `502ebd7d-ee28-4288-bf5d-bde666a90f60.jpeg` |
| 2 | `category_zahrady` (Zahrady a výsadby category card) | **No garden/landscaping photos exist.** The catalog has zero images tagged with the garden/planting category - nothing shows actual garden design, planting, or landscaping work. | An outdoor, natural-light wildflower bouquet photo - thematically adjacent (outdoor, natural) but does not depict garden or landscaping work. | `86fd9a45-b676-4bda-8bac-1cf22319571e.jpeg` |
| 3 | `category_rezane` (Květinářství v Hrádku category card) | **Weak coverage.** A real cut-flowers-in-a-vase photo does exist and was used, but the mockup's own reference image for this card depicts a shop/greenhouse interior with shelved potted plants - a physical-shop-presence shot. No such interior photo exists anywhere in the 23-photo set. | Best available real candidate: a sunflower bouquet in a glass vase. Genuinely on-theme (cut flowers) but does not show the shop interior the mockup implies. | `d42669aa-56a3-47ca-8fd0-507a6c0a6a7c.jpeg` |

**A real photo shoot is needed to close these gaps.** Specifically, before this content should be considered final rather than a placeholder-stage stand-in, the client needs: (1) a proper portrait of the owner/florist, (2) real photos of garden/landscaping work the business has done, and (3) ideally a real photo of the shop's physical interior (shelving, potted plants, storefront) to replace the vase stand-in.

**CLIENT CONFIRMATION NEEDED:** schedule a photo shoot (or source existing photos from the client) covering all three gaps above. Until that happens, the About-me section is showing a stand-in photo that is not the owner, and the Zahrady and Květinářství cards are showing photos that don't fully represent what those sections claim to be about.

---

## (d) AI-generated catalog metadata (Gemma vision model) - not human-verified

Every entry in `public/flowers-catalog.json`'s `images` array - `description_cs`, `category`, `flower_types`, `dominant_colors`, `alt_text_cs`, `style_tags`, `setting`, `contains_people`, and `confidence` - was generated automatically by a local Gemma vision model, not by a human florist or any member of this team. This is stated directly in the catalog file itself:

```json
"model": {
  "name": "gemma-4-E4B-it-Q5_K_M.gguf",
  "runtime": "llama.cpp server",
  "endpoint": "http://0.0.0.0:8080/v1/chat/completions",
  "note": "All image identification, description, categorization and slot-matching content in this file was generated by the local Gemma vision model, not by the orchestrating assistant."
}
```

Each of the 23 image entries carries a `confidence` score (observed range in this catalog: 0.95-1.0 for the entries sampled) reported by the model itself for its own classification - this is a self-reported model confidence, not an independent accuracy measurement, and should not be read as a guarantee of correctness even where it reads as high (e.g. `1.0`).

**This is not a theoretical risk - the AI-generated metadata contains real, confirmed errors.** During implementation, three of the fourteen `alt_text_cs` strings actually used on the homepage were found to contain genuine Czech-language mistakes and were corrected before shipping (documented in `content-contract.md` Section 4, cross-verified live in `index.astro` and independently re-confirmed by the Task 5 UX review):

| Filename | Catalog `alt_text_cs` (AI-generated, as-is) | Error type | Corrected to |
|---|---|---|---|
| `18ef0981-1389-43a7-b918-2546a229fa74.jpeg` | `...s muchornicemi a osusíchlým listím.` | `osusíchlým` is not a real Czech word (garbled model output) | `...osušeným listím.` |
| `7f8f3457-17db-4f52-bf2e-1e5493235670.jpeg` | `...pro svatební doplnky.` | `doplnky` missing its háček | `...svatební doplňky.` |
| `74d78256-be34-4ad7-8b51-a3d8cc7f31ba.jpeg` | `Rustikový věnec...` | `Rustikový` is non-standard Czech | `Rustikální věnec...` |

That is a 3-in-14 (roughly 21%) error rate among the alt-text strings that were actually scrutinized closely enough to catch a problem - and only the strings used on the homepage were checked this closely. The remaining 9 catalog entries not used on the homepage (23 total images, 14 used) have **not** been checked at all, and the `description_cs`, `category`, `flower_types`, and `dominant_colors` fields for every entry - used or not - have only been spot-checked for thematic fit (e.g. "is this photo actually a wedding photo"), not proofread for language correctness the way `alt_text_cs` was.

**CLIENT CONFIRMATION NEEDED:** the client (ideally someone with florist domain knowledge, e.g. the owner) should spot-check the `category`, `flower_types`, `description_cs`, and `alt_text_cs` fields for at least the 14 images actually used on the live homepage, since the model has no floristry expertise and the confirmed errors above show it also makes plain language mistakes, not just possible domain misclassifications.

---

## (e) Photo usage rights / ownership of `public/flowers/` images - unverified

The 23 photographs in `public/flowers/` were used throughout the new homepage (hero, all 6 category cards, the about-me stand-in, and all 6 portfolio images) on the assumption that they are the client's own product/business photos. **Nobody on this team has verified this assumption.** No provenance, licensing, EXIF/copyright metadata check, or reverse-image-search was performed on any of the 23 files, and `flowers-catalog.json` records no ownership or licensing information at all - only visual content metadata (see Section d).

This matters because:

- If these are stock photos, photos scraped from another florist's site or social media, or photos taken by a third party (e.g. a wedding client, a wedding photographer) without a usage release, publishing them on the client's commercial homepage could expose the client to a copyright claim or a right-of-publicity issue (several images have `"contains_people": true` in the catalog, meaning identifiable people may appear in photos now live on a public commercial site).
- The business-critical hero image, all 6 category card images, and all 6 portfolio images are the most visually prominent content on the entire redesigned homepage - if any of them turn out to be improperly licensed, the exposure is on the site's most-viewed content, not a buried corner.

**CLIENT CONFIRMATION NEEDED:** before any public deployment, confirm with the client that all 23 images in `public/flowers/` are either (1) photos the client personally took or owns the rights to, or (2) photos properly licensed for this commercial use with documentation on file. Do not deploy publicly until this is confirmed - this is the single highest-severity item in this audit, since it is a legal/liability risk rather than a cosmetic or content-quality one.

---

## (f) Cookie consent / GDPR status - pre-existing, unchanged by this redesign

`src/components/CookieConsent.astro` was read in full and is confirmed **unchanged** by this redesign - it was not in scope for any of Tasks 1-6 and no diff touches it. Its current behavior, as shipped both before and after this redesign:

- Shows a bottom-right consent banner ("Zásady používání souborů cookie") on first visit, styled independently of the new design system (plain white card, teal accept button - does not use any of the new `font-display`/`font-script`/color tokens, and visually clashes with the rest of the now-redesigned site).
- On "Povolit" (Accept): sets `localStorage.setItem('cookieConsent', 'accepted')` and then loads the Google Analytics `gtag.js` script (`G-D22YLF35P9`), initializing `dataLayer` and firing `gtag('config', ...)`.
- On close/reject: sets `localStorage.setItem('cookieConsent', 'rejected')` and does not load GA.
- On return visits, if `localStorage.getItem('cookieConsent') === 'accepted'`, GA loads immediately with no re-prompt, no expiry, and no way to withdraw consent from within the UI (no "manage cookie preferences" affordance exists anywhere on the site).
- Consent is stored client-side only (`localStorage`), with no server record, no consent-string versioning, and no re-ask if the cookie/consent policy text changes in the future.

None of this was introduced by the redesign - it is exactly as it was before this branch started, and fixing it is outside this plan's scope (the plan's brief for Task 8 explicitly frames this as "unrelated to but co-existing with the redesign," not something to fix here). It is surfaced in this audit because the redesigned homepage is real, client-facing content intended to go live, and an out-of-scope pre-existing GDPR-adjacent gap is still worth the client's attention at the same time new content ships - not a new problem, but not nothing either.

**CLIENT CONFIRMATION NEEDED:** the client (or whoever handles their legal/compliance posture) should confirm whether the current consent mechanism (`localStorage`-only, no re-ask, no preference-management UI, banner visually inconsistent with the new brand) is acceptable as-is, or whether it should be scheduled as follow-up work. This item is explicitly out of scope for this redesign plan and is not blocking - it is a flag, not a blocker like item (e).

---

## Summary

| # | Item | Severity | Blocking public deployment? |
|---|---|---|---|
| a | Two mockup typos silently corrected | Low | No - client should just be told |
| b | Phone/email placeholder-vs-real discrepancy | Low | No - real values already used, client should verify accuracy |
| c | Three image-slot gaps (owner portrait, garden photos, shop interior) | Medium | No, but stand-ins are visibly not the real thing - schedule a shoot soon |
| d | AI-generated (Gemma) catalog metadata, confirmed errors found | Medium | No, but client spot-check recommended before treating content as final |
| e | Photo usage rights/ownership of all 23 images unverified | **High** | **Recommended: yes, until confirmed** |
| f | Pre-existing cookie consent / GDPR gaps, unchanged by this redesign | Low-Medium | No - out of scope, flagged for awareness only |

**6 items require explicit client confirmation before this goes live**, one per section above (a-f). Of these, item (e) - unverified photo usage rights - is the only one this audit recommends treating as a hard blocker for public deployment; the rest are flags that should be resolved or explicitly accepted by the client but do not represent the same order of legal exposure.
