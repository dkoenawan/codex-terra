# Codex Terra — Claude Code Handoff

> A world-bible website: a hub plus one page per domain of a fantasy world, all built on a shared design system. Tone: an ancient arcane academy's official codex / in-world chronicler. Aesthetic: dark academia — deep navy stage, parchment pages, gold wayfinding, per-domain jewel accents. Inspiration: LOTR / Warhammer / D&D, sitting between grimdark and high fantasy.

This document is the entry point for implementing Codex Terra in a real codebase. Read it first, then the per-area specs it links to.

---

## 1. What this package is

These files are a **working HTML design reference** — a complete, interactive prototype of the intended look, structure, and behaviour. **They are not the production codebase.** Your job is to recreate this in the target framework (React / Next.js / Astro / Vue / Svelte — pick what fits the project; a content-heavy mostly-static site like this suits **Astro** or **Next.js** well) using its idiomatic patterns: components, typed data files, file-based routing, and a proper font-loading strategy.

Fidelity is **high** — colours, type, spacing, motion and interactions are all intentional and specified. Recreate them precisely.

---

## 2. Current state

| Area | File | State |
|---|---|---|
| **Shared design system (CSS)** | `assets/codex.css` | ✅ Built — **source of truth** |
| **Shared behaviour (JS)** | `assets/codex.js` | ✅ Built — reveal-on-scroll, nav, ornaments |
| **Hub / world index** | `index.html` | ✅ Built |
| **Design-system showcase** | `Codex Terra — Design System.html` | ✅ Built — living documentation |
| **Liber I · Arcana** (magic) | `Codex Arcanum.html` | ✅ Built — 12 schools, 4 triads, sorting quiz |
| Liber II · Terrae (geography + map engine) | — | ⏳ Spec only (§7) |
| Liber III · Gentes (peoples) | — | ⏳ Roadmap (§6) |
| Liber IV · Ordines (factions) | — | ⏳ Roadmap (§6) |
| Liber V · Annales (history) | — | ⏳ Roadmap (§6) |
| Liber VI · Divinitas (pantheon) | — | ⏳ Roadmap (§6) |
| Liber VII · Bestiarum (bestiary) | — | ⏳ Roadmap (§6) |
| Liber VIII · Personae (figures) | — | ⏳ Roadmap (§6) |

> Note: `Codex Arcanum.html` currently carries its **own embedded copy** of the styles (it predates the shared stylesheet). When you port, fold it onto the shared system like every other page — see §5. A detailed component-level spec for the Arcana page lives in `design_handoff_codex_arcanum/README.md` (tokens, type scale, quiz scoring algorithm, the 12 sigils).

---

## 3. Architecture

```
/
├── assets/
│   ├── codex.css         # design system: tokens, themes, surfaces, components
│   └── codex.js          # reveal observer, nav-scroll, smooth anchors, ornament sprite
├── index.html            # hub — the eight books
├── Codex Terra — Design System.html   # living style guide
├── Codex Arcanum.html    # Liber I · Arcana
└── (future) one page per remaining domain
```

**The model is simple and must be preserved:**

1. **One shared stylesheet** (`codex.css`) defines everything. Every page links it. Change a token once → the whole world updates.
2. **Theming is data-driven.** Accent colours are CSS variables keyed by a `data-domain` attribute. Put `data-domain="terrae"` on the `<body>` (or any subtree) and that scope re-tints to teal; `data-domain="ordines"` → crimson; etc. No per-page colour CSS.
3. **Every page shares the same chrome** — `.codex-nav` top bar and `.codex-foot` footer — and the same composition primitives (section heads, cards, buttons, rules).
4. **Content type drives layout, not colour.** Schools/orders → sigil cards; realms/events → codex cards; persons/races → deep dossiers. All themed by domain accent.

In a framework this becomes: a `<CodexLayout domain="terrae">` wrapper that sets `data-domain` and renders shared `<Nav>` / `<Footer>`, a `ThemeProvider`-free CSS-variable approach (the variables already cascade), and a component library mirroring §4.

---

## 4. The design system (summary)

`assets/codex.css` is the authoritative spec. Highlights:

**Three-tier colour model**
- **Stage** (dark chrome): `--navy #0d1626`, `--navy-deep #07101e`, `--navy-rich #14213a`
- **Page** (content): `--parchment #e8d9b8`, `--vellum #f0e6cd` (lighter, for maps/galleries), inks `--ink #2a2418` / `--ink-soft #4a3f2a`
- **Wayfinding**: `--gold #c9a961`, `--gold-bright #e3c178`, `--gold-deep #8e7338`

**Per-domain accents** ("Jewel of the Domains" — the chosen option). Set via `[data-domain]`:

| Domain | `--accent` | Meaning |
|---|---|---|
| arcana | `#8a6db0` amethyst | magic |
| terrae | `#3f8a7a` sea-green | geography |
| gentes | `#c0843f` amber | peoples |
| ordines | `#b04638` crimson | factions |
| annales | `#b0974f` antique gold | history |
| divinitas | `#6f93a8` azure | pantheon |
| bestiarum | `#7d8a2e` olive | beasts |
| personae | `#6d77ad` steel | figures |

Each domain also defines `--accent-bright`, `--accent-deep`, and `--accent-ink` (the accent made legible on parchment). Use `--accent*` everywhere instead of hardcoding — that's what makes theming one attribute.

**Type:** Cinzel (display/labels), Cormorant Garamond (italic flavour), EB Garamond (body). Full scale in `design_handoff_codex_arcanum/README.md`.

**Surfaces:** `.parchment` and `.vellum` are **textured** (SVG turbulence noise + radial warmth + inset shadow) — never flat fills. Keep the noise (inline data-URL or extract to `parchment.svg`).

**Components** (all in `codex.css`): `.codex-nav`, `.codex-foot`, `.section-head` + `.rule`, `.card` (+ `.sigil-card`, `.seam`, `.hoverable`), `.dossier-head` + `.fields`, `.btn` (`-primary`/`-ghost`/`-ink`), `.tag`, `.badge-num`, `.div-orn`, `.frame-deco` corner ornaments, `.reveal` motion utilities. The Design-System page renders every one of these live — use it as your visual acceptance test.

**Hard rules of the aesthetic:** no rounded corners (except the modal close button and circular dots); no emoji; gold/parchment/navy discipline; serif throughout; motion is slow and dignified (90s sigil rotations, 0.9s reveals).

---

## 5. Recipe — building a new domain page

Every domain page follows the same skeleton. To build e.g. Gentes:

```html
<body data-domain="gentes">          <!-- 1. set the accent theme -->
  <nav class="codex-nav">…</nav>      <!-- 2. shared chrome (link rel to codex.css) -->

  <header class="hub-hero / domain hero">  <!-- 3. hero: rotating crest + title + tagline -->
  </header>

  <section class="codex">             <!-- 4. index of entries as cards -->
    <div class="section-head">…</div>
    <div class="… grid">              <!-- sigil-card / codex-card / dossier-card -->
    </div>
  </section>

  <!-- 5. deep entry view: modal (like Arcana) OR a dedicated /gentes/[slug] route -->

  <footer class="codex-foot">…</footer>
  <script src="assets/codex.js" defer></script>
</body>
```

User decision already captured: **structure = hub + a page per domain**, and **deep entries** (multi-section: lore + relationships + gallery). For deep entries prefer **dedicated routes** (`/gentes/the-hearthborn`) over modals once you're in a real framework — better for sharing, SEO, and depth. The Arcana page uses modals because it's a single static file; that's fine to keep for short entries but the deep-dossier domains want real pages.

**Deep-entry content model** (the dossier — see `.dossier-head` + `.fields` in the design-system page):
- Crest/portrait + kicker + title + epithet
- A field grid (homeland, stature, lifespan, allegiance, etc. — varies by domain)
- Long-form lore sections (history, culture, notable members…)
- Relationships block (links to other entries — allies, rivals, members, deities served)
- Gallery (image slots — user supplies art)

A reasonable TypeScript entry shape:

```ts
interface CodexEntry {
  slug: string;
  domain: DomainId;
  title: string;
  epithet?: string;       // italic subtitle
  kicker?: string;        // small label / index
  crest?: string;         // sigil/heraldry SVG id or component
  fields: { k: string; v: string }[];     // the dossier grid
  sections: { heading: string; body: string }[];  // long-form lore
  relations: { kind: string; targetSlug: string; label: string }[];
  gallery?: { src: string; caption?: string }[];
}
```

---

## 6. Roadmap — the seven remaining books

All themed by their accent, all using the shared components. Content is to be written in the **in-world chronicler** voice (consistent with Arcana's flavour quotes).

- **Terrae** (geography) — index of realms/regions as codex-cards; each realm a deep entry; centrepiece is the **map engine** (§7). Uses `.vellum` surface for map readability.
- **Gentes** (peoples) — races/cultures as dossier-cards → deep dossiers (homeland, tongue, customs, history, notable figures).
- **Ordines** (factions/houses) — sigil/heraldry cards → deep dossiers (banner, allegiance web, members, feuds). Strong candidate for an allegiance/relationship diagram.
- **Annales** (history) — a vertical **timeline** of ages and events; events link to people/places/factions. New component: timeline rail.
- **Divinitas** (pantheon) — gods as sigil-cards → dossiers (domain, rites, faithful, relationships to other gods). Consider a pantheon relationship graph.
- **Bestiarum** (bestiary) — creatures as dossier-cards → entries (habitat, threat rating, lore, sightings). New component: a "threat" rating indicator.
- **Personae** (figures) — portrait-led dossier-cards → full character dossiers (the deepest entries; relationships to factions/events/places).

Cross-cutting: entries **link to each other across domains** (a Persona belongs to an Ordo, hails from a Terra, worships a Divinitas). Model relationships as typed edges so these links generate both directions.

---

## 7. The map engine (Terrae centrepiece)

The user explicitly wants an **auto-generator** for the world map. This is the one genuinely novel feature and deserves its own design pass — it was deferred during the prototype because a convincing landmass can't be hand-faked as clean SVG. Open design questions to resolve with the user before building:

- **Procedural vs. authored:** generate a new fantasy landmass on demand (coastlines, biomes, region borders, auto-placed labels) **or** render a map the user defines (regions/cities they specify) in the codex style? (Likely: procedural generation to seed it, then hand-editable.)
- **Style:** hand-drawn parchment map (iconographic mountains/forests, calligraphic labels on `.vellum`) vs. cleaner political/region map (tinted territories using domain/faction accents).
- **Tech:** a Voronoi/Poisson-disc approach (e.g. `d3-delaunay`) for region cells over simplex/Perlin noise (`simplex-noise`) for elevation/moisture → biomes; render to `<canvas>` or SVG; deterministic from a **seed** so a map is shareable/reproducible.
- **Interaction:** regions are clickable → open the Terrae deep entry for that realm; hover highlights; a "reroll seed" control styled as a `.btn`.

Deliver this as a self-contained module (`MapEngine`) that takes a seed + config and emits both the rendered map and a region adjacency graph (which doubles as data for borders/feuds in Ordines and Annales).

---

## 8. Detailed component spec

For exact pixel/token values, type scale, the IntersectionObserver reveal config, the quiz scoring algorithm, and SVG source for the 12 magic sigils, see:

**`design_handoff_codex_arcanum/README.md`**

That document specs the Arcana page at component level; the tokens and components it lists are now generalised in `assets/codex.css`, so treat `codex.css` as canonical where they overlap.

---

## 9. Accessibility & porting notes

- Add focus management to modals/route transitions (trap focus, restore on close); add `role="dialog"`/`aria-modal` to overlay entries.
- Decorative SVGs are `aria-hidden`. Give meaningful crests/portraits real alt text via `<title>` or `aria-label`.
- `prefers-reduced-motion` is already honoured in `codex.css` (disables sigil spin + reveals) — keep it when porting.
- Self-host fonts (`next/font` or `@fontsource/{cinzel,cormorant-garamond,eb-garamond}`) instead of the Google `<link>` for performance.
- Keep the parchment noise as an asset, not a runtime filter, for paint performance on long pages.

---

## 10. Suggested target layout (Astro/Next example)

```
src/
  layouts/CodexLayout.astro        # sets data-domain, renders Nav + Footer, links codex.css
  styles/codex.css                 # ported from assets/codex.css (or keep as global)
  components/
    Nav · Footer · SectionHead · Rule
    Card · SigilCard · DossierCard · DossierHead · FieldGrid
    Button · Tag · BadgeNum · CornerOrnament · Sigil
    Timeline (Annales) · RelationGraph (Ordines/Divinitas) · MapEngine (Terrae)
  data/
    domains.ts · arcana.ts · gentes.ts · ordines.ts · …   # typed content
    types.ts
  pages/
    index.astro                    # hub
    arcana/index.astro  + [school].astro
    terrae/index.astro  + [realm].astro
    …one folder per domain
  lib/ useReveal · rankSchools (quiz) · mapgen
```

Build the shared layout + component library first (acceptance-test against the Design-System page), port Arcana onto it, then work down the roadmap.
