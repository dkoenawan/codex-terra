# Codex Terra

The Great Archive of a fantasy world — a world bible built as a hub plus one page per domain
("the eight books"), all on a shared design system. Dark-academia aesthetic: deep-navy stage,
parchment pages, gold wayfinding, per-domain jewel accents.

**Live:** https://dkoenawan.github.io/codex-terra/

## Stack

- **[Astro](https://astro.build)** — static-first, zero JS by default. Interactivity is added as
  *islands* (currently just the Arcana Sorting Rite quiz), so the rest of the site stays static.
- **Self-hosted fonts** via `@fontsource` (Cinzel, Cormorant Garamond, EB Garamond).
- **GitHub Pages** deploy via GitHub Actions (`.github/workflows/deploy.yml`).

## Develop

```bash
npm install
npm run dev      # http://localhost:4321/codex-terra
npm run build    # -> dist/
npm run preview  # serve the built site
```

> The site is served from a sub-path (`/codex-terra`). Always build internal links with
> `withBase()` (`src/lib/url.ts`) — never hardcode `/...`.

## Structure

```
src/
  layouts/CodexLayout.astro     # chrome: <head>, data-domain theming, Nav + Footer, global script
  styles/   codex.css           # the design system — single source of truth (tokens, [data-domain], components)
            fonts.css home.css arcana.css
  scripts/  codex.ts            # global progressive enhancement (reveal-on-scroll, nav, ornaments)
            quiz.ts             # the Sorting Rite island + the school modal
  components/                   # Nav, Footer, SectionHead, WorldWheel, HeroSigil, BookCard,
                                # Sigil(+Sprite), SchoolCard, TriadCard, CornerOrnament, Quiz
  data/     types.ts domains.ts triads.ts schools.ts quiz.ts   # typed content (source of truth for copy)
  lib/      url.ts rankSchools.ts
  pages/    index.astro  arcana/index.astro  pattern.astro
design-reference/               # the original HTML design prototype + handoff (the spec; not built)
```

`design-reference/HANDOFF.md` is the master spec, including the roadmap for the seven unbuilt books
(Terrae + map engine, Gentes, Ordines, Annales, Divinitas, Bestiarum, Personae). Visit `/pattern`
for the living style guide / component acceptance test.

## The eight books

| # | Book | Domain | Status |
|---|------|--------|--------|
| I | Arcana | magic — 12 schools, 4 triads, the Sorting Rite | ✅ Built |
| II | Terrae | realms & geography (+ procedural map engine) | Planned |
| III | Gentes | the peoples | Planned |
| IV | Ordines | factions & houses | Planned |
| V | Annales | history & the ages | Planned |
| VI | Divinitas | the pantheon | Planned |
| VII | Bestiarum | beasts & monsters | Planned |
| VIII | Personae | notable figures | Planned |
