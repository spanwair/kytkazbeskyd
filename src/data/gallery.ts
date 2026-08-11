// Real product photography for the gallery page, sourced from the 23
// photos in `public/flowers/` and their metadata in
// `public/flowers-catalog.json` (see docs/redesign/disclaimers.md
// section (d) for known metadata caveats - a few `alt_text_cs` strings
// contained AI-generated language errors and were hand-corrected below,
// matching the corrections already shipped on the homepage).
//
// Photos are plain `<img src="/flowers/...">` references (not
// astro:assets) because they live under `public/`, following the same
// pattern already established in `src/pages/index.astro`.

export interface GalleryCategory {
  /** Matches the site-wide nav/anchor slug, e.g. `#kytice`. */
  slug: string;
  title: string;
  intro: string;
}

export interface GalleryItem {
  /** Filename only, resolved against `/flowers/<filename>`. */
  filename: string;
  alt: string;
  category: string;
}

export const galleryCategories: GalleryCategory[] = [
  {
    slug: "kytice",
    title: "Kytice",
    intro: "Čerstvé, sezónní kytice - pokaždé trochu jiné.",
  },
  {
    slug: "vence-a-dekorace",
    title: "Sušené květiny a věnce",
    intro: "Ručně vázané věnce a dekorace, které vydrží.",
  },
  {
    slug: "svatby",
    title: "Svatební floristika",
    intro: "Kytice, korsáže a výzdoba pro váš velký den.",
  },
  {
    slug: "zahrady",
    title: "Zahrady a výsadby",
    intro: "Návrhy, osazování a péče o zahrady.",
  },
  {
    slug: "doplnky",
    title: "Doplňky",
    intro: "Korsáže, ozdoby do vlasů a další drobné detaily.",
  },
];

export const galleryItems: GalleryItem[] = [
  // --- Kytice (kytice - kytice z cerstvych kvetin) ---
  {
    filename: "157b55da-b44f-4e52-ae33-42be1a7b0df9.jpeg",
    alt: "Velká, svěží kytice s růžovými a bílými květy v rustikálním balení.",
    category: "kytice",
  },
  {
    filename: "4ca37b28-088d-4b7c-9272-384a611304e0.jpeg",
    alt: "Rustikální květinový okras s bohatými růžovými a červenými květy.",
    category: "kytice",
  },
  {
    filename: "55c3d768-209a-4763-a853-c2bc27177f94.jpeg",
    alt: "Rustikální květinový dárek s bílými květy a zeleným listím.",
    category: "kytice",
  },
  {
    filename: "b93a5688-e6e8-4fff-832f-a70aaa3d29a9.jpeg",
    alt: "Bohatý a romantický květinový buket v rustikálním stylu s růžovými a bílými květy.",
    category: "kytice",
  },
  {
    filename: "d42669aa-56a3-47ca-8fd0-507a6c0a6a7c.jpeg",
    alt: "Bohatá oranžová kytice slunečnic v skleněné váze.",
    category: "kytice",
  },

  // --- Sušené květiny a věnce (+ one general "galerie tvorby" collage) ---
  {
    filename: "18ef0981-1389-43a7-b918-2546a229fa74.jpeg",
    alt: "Rustikální sušený květinový věnec s muchornicemi a osušeným listím.",
    category: "vence-a-dekorace",
  },
  {
    filename: "33ae30c1-e12a-4e36-9abb-89d96e2c0602.jpeg",
    alt: "Rustikální dekorace z zeleného listí a suchých, zlatých trav na dřevě.",
    category: "vence-a-dekorace",
  },
  {
    filename: "42fe18bc-ea5a-4fe9-9158-0392bd9775c2.jpeg",
    alt: "Rustikální sušená květinová kytice v hnědé obálce s sušenými květy.",
    category: "vence-a-dekorace",
  },
  {
    filename: "502ebd7d-ee28-4288-bf5d-bde666a90f60.jpeg",
    alt: "Rustikální aranžmá z sušených modrých květin a trávy.",
    category: "vence-a-dekorace",
  },
  {
    filename: "6fd65b05-35b2-434e-b5a8-a0b54698cb88.jpeg",
    alt: "Bohatý rustikový věnec z sušených květin a bylinek.",
    category: "vence-a-dekorace",
  },
  {
    filename: "70716e83-e783-46dc-b101-cf77095b8bf1.jpeg",
    alt: "Sušený květinový věnec z hnědých a zlatých suchých rostlin.",
    category: "vence-a-dekorace",
  },
  {
    filename: "70fc2c30-4ece-4fc0-976a-12abd5a480b3.jpeg",
    alt: "Sušený květinový věnec s purpurovými a hnědými tóny na neutrálném pozadí.",
    category: "vence-a-dekorace",
  },
  {
    filename: "74d78256-be34-4ad7-8b51-a3d8cc7f31ba.jpeg",
    alt: "Rustikální věnec z purpurové a modré květiny a zeleně.",
    category: "vence-a-dekorace",
  },
  {
    filename: "86fd9a45-b676-4bda-8bac-1cf22319571e.jpeg",
    alt: "Rustikální buket s modrými a zlatými květy v přírodním prostředí.",
    category: "vence-a-dekorace",
  },
  {
    filename: "d685836f-b01a-4293-b8cf-df1b775340c8.jpeg",
    alt: "Romantický věnec z uschlých květin a růží.",
    category: "vence-a-dekorace",
  },
  {
    filename: "e267356c-9f76-447f-98da-1bc2562535e4.jpeg",
    alt: "Rustikální květinový okras z sušených květin v purpurových a růžových odstínech.",
    category: "vence-a-dekorace",
  },
  {
    filename: "e2bb665e-df20-4d91-b284-4adfa166ec55.jpeg",
    alt: "Suchý, rustikální květinový okras v buketu s akcenty z rudých trav.",
    category: "vence-a-dekorace",
  },
  {
    filename: "e6308e15-84db-43ff-a58d-6ef7d4adab61.jpeg",
    alt: "Rustikální sušený květinový věnec na světlé ploše.",
    category: "vence-a-dekorace",
  },
  {
    filename: "e65948e4-259b-4d0a-ab11-3febe5d7f817.jpeg",
    alt: "Sušený květinový věnec z travin a modrých květů na světlejším pozadí.",
    category: "vence-a-dekorace",
  },
  {
    // Catalog category "galerie tvorby" - a general collage of dried
    // wreaths, a bouquet and wedding floristry. Folded into this section
    // since dried wreaths dominate the image, per the task brief's
    // "your call" on this single general-purpose photo.
    filename: "32c2b87a-57d6-486a-ae75-4c2a01ac1ec8.jpeg",
    alt: "Kolaž s květinami: sušené věnce, buket a svatební floristika.",
    category: "vence-a-dekorace",
  },

  // --- Svatební floristika ---
  {
    filename: "b9f32fee-f3c2-4abb-9299-bed936e8a813.jpeg",
    alt: "Paní v svatební šatě se dívá z okna, s květinami na okraji.",
    category: "svatby",
  },

  // --- Doplňky (korsáže / ozdoby do vlasů) ---
  {
    filename: "16a8dc86-7d99-4e1a-a50b-01c17811688b.jpeg",
    alt: "Jemný květinový korsáž z bílé růže a modrých květů na dřevě.",
    category: "doplnky",
  },
  {
    filename: "7f8f3457-17db-4f52-bf2e-1e5493235670.jpeg",
    alt: "Oranžové a modré korsáže na kamenné ploše pro svatební doplňky.",
    category: "doplnky",
  },

  // --- Zahrady a výsadby ---
  // Intentionally empty: no garden/landscaping photos exist in the
  // current 23-photo set (see docs/redesign/disclaimers.md section (c)).
  // The gallery page shows an honest empty state for this section
  // instead of a mismatched stand-in photo.
];
