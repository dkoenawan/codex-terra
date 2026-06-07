# Handoff: The Cartographer's Atlas (Liber II · Terrae — the map engine)

## Overview

This is the **map engine** for Codex Terra's geography book — the auto-generator the root handoff (`../HANDOFF.md` §7) listed as "spec only." It is now **built and working**. From a single integer **seed** it generates a real continental world (elevation → climate → biomes → rivers), lays the **Winds of Magic** over it as a single mana field, and **bakes the world-state to a layered, queryable, restylable SVG**. The HTML page (`The Cartographer's Atlas.html`) is the design brief that presents the engine: three terrain "channels," a live plate the reviewer can re-dial, the glyph library, the palette, and the magic layer.

The headline design decision captured here: **the land is the map; magic is a quiet, opt-in layer**, and — per the latest direction — **magic has no affinity**. It works like the *Winds of Magic* in Total War: Warhammer — mana is one fuel that blows across the whole world and **pools into stronger and weaker pockets depending on where you are**. There are no "types" of magic in a place; there are only wells (strong founts) and dead-calm zones.

## About the design files

The files in this bundle are a **design reference implemented in HTML + plain JS**, not the production codebase. The engine (`atlas/atlas-core.js`) is a faithful JS **stand-in for the Python/numpy pipeline** to be written — it proves the algorithm and, crucially, **defines the world-state contract** the real engine must emit. Your job:

1. **Re-implement the generator** in the target stack (the intended home is **Python + numpy**, emitting the same world-state object/JSON described in §3). The JS is readable as a spec — port the field math 1:1.
2. **Re-implement the bake** (`atlas/atlas-render.js`) — world-state → layered SVG — in the target environment (Node/Astro build step, or Python SVG emit). The layer structure, per-hex `data-*`, and the "every colour is a variable" rule are the contract (§4).
3. **Recreate the page** (`The Cartographer's Atlas.html`) in the site's framework on the shared design system (`assets/codex.css`), exactly as every other domain page (see `../HANDOFF.md` §3–5).

## Fidelity

**High.** Colours, the hex grid, the glyph hand, the layering, the palette hooks, and the two live dials (terrain channel + magic visibility) are all final and specified below. The procedural *output* is seed-dependent (a different seed is a different—but equally valid—world); what is fixed is the **pipeline, the contract, and the visual language**.

---

## 1. Files in this bundle

```
The Cartographer's Atlas.html   # the page / design brief (presents the engine)
atlas/
  atlas-core.js     # THE ENGINE — seed → world-state. Port to numpy. (the spec)
  atlas-render.js   # THE BAKE — world-state → layered SVG. Port to build step.
  atlas-glyphs.js   # THE GLYPH LIBRARY — one <symbol> per landform/cover.
  tweaks-panel.jsx  # review-only UI for the live dials (NOT shipped).
assets/
  codex.css         # shared design system (see ../HANDOFF.md §4 — canonical there)
  codex.js          # shared behaviour (reveal-on-scroll, nav)
```

Open `The Cartographer's Atlas.html` to see everything live. The "Tweaks" panel (top toolbar) drives the two dials.

---

## 2. The generation pipeline (`atlas-core.js` → `AtlasCore.generate`)

`AtlasCore.generate({ seed, cols, rows, seaLevel })` runs a deterministic chain. Everything is seeded value-noise (fBm) + a `mulberry32` PRNG, so **the same seed always yields the same world** (requirement: maps are shareable/reproducible). Port each stage faithfully:

| Stage | What it computes | Notes for the numpy port |
|---|---|---|
| **Noise** | hash-based value noise, smooth-interpolated; `fbm()` sums 5 octaves | numpy: vectorised lattice hash + `np.interp`-style fade; or `opensimplex`/`vnoise`. Keep fBm params (lac 2.0, gain 0.5). |
| **1 · Elevation** | domain-warped fBm × continent mask (one main landmass `gauss(.42,.46)` + an island `gauss(.83,.74)`), normalised, then **2 passes of neighbour smoothing** so highlands form contiguous ranges, not salt-and-pepper | The warp (two octaves of a second noise) is what gives organic coastlines. Keep the de-speckle passes. |
| **Sea level** | `isLand = elevation > seaLevel` (default 0.36) | — |
| **Coast distance** | BFS in hexes from the sea inward (`coastDist`) | standard multi-source BFS over the hex neighbour graph |
| **2 · Temperature** | latitude band (warm toward south, `1 - |y-0.60|·1.55`) − lapse rate (`0.55·elevation`) + a little noise | — |
| **3 · Moisture** | noise + coastal boost (`1 - coastDist/10`) − elevation (rain-shadow) | — |
| **Slope** | max elevation delta to any neighbour | reused by relief shading + the wind's ruffle |
| **4 · Biomes** | classified by **percentile** thresholds on *land* elevation (top 6% → peak, next 11% → mountain, next 19% → hills) then climate (tundra/desert/marsh/forest/pasture) | Percentile (not absolute) thresholds keep hypsometry realistic across seeds — **important**, don't hardcode elevation cutoffs. |
| **Rivers** | trace steepest-downhill from high, wet sources to the sea; keep paths ≥5 hexes; ~9 rivers | greedy downhill walk; stop at sea or local minimum |
| **Winds of Magic** | **single mana field** — see §3 below | the recently-changed part; read this carefully |

### Hex grid

**Flat-top, odd-q offset** (redblobgames convention). `hexCenter`, `hexPolygon`, `mapPixelSize`, and the `ODDQ` neighbour tables are in `atlas-core.js` — port them exactly so the renderer's geometry matches. Default world is `cols 76 × rows 46` at seed 73 (the seed shown throughout the brief).

---

## 3. The Winds of Magic — the magic model (READ THIS)

This **replaced** an earlier "four affinities" model. Do **not** re-introduce affinities/triads/types into the map. The rule from the user, verbatim in spirit:

> Affinity should work like the Winds of Magic in TW Warhammer. Mana is just a fuel; there is no affinity, but there are pockets of stronger or weaker mana depending on where you are.

### How it's computed (`atlas-core.js`)

A **single `mana` scalar field**, normalised to `[0,1]` across the *whole* world (the wind blows over sea and land alike):

```
mana(x,y) =
    low-frequency fBm "wind"           // broad drifting pockets of high & low
  + Σ gaussian WELLS                   // a few concentrated founts (seeded)
  + small ruffle from the land         // 0.10·min(1, slope·6); +0.03 land / −0.05 deep sea
  → normalise to [0,1]
```

- **No terrain "type" feeds a flavour.** The land only *ruffles* the wind (gusts over rugged ground, lulls over deep ocean). The field is fundamentally its **own** low-frequency noise — that's what produces broad pockets you can read as "this region is high-mana, that one is dead calm."
- **Wells** = 5 seeded gaussian founts (`mulberry32(seed·41+19)`) summed on top, so strong pockets are concentrated, not uniform.

### What the engine emits for magic

- `fields.mana` — `Float32Array(N)`, the per-hex field in `[0,1]`.
- `meta.wells` — the **3 strongest pockets**, spaced ≥12 hexes apart (Manhattan on q/r). Each is `{ q, r, intensity }` — **`intensity` is the mana value, there is no `triad`/type key.** These are the default visible marks.

> ⚠️ **Schema change for anyone porting the §IV contract:** the old shape had `fields.affinity = { materia, potentia, vocatio, mentis }` and `meta.leyline_nodes` (each with a `triad`). Those are **gone**. New shape: `fields.mana` and `meta.wells` (typeless). Keep schemas in sync.

### How it renders (`atlas-render.js`)

The magic layer has three visibility states (the `magic` dial):

| `magic` | Renders |
|---|---|
| `'off'` | nothing — the land alone |
| `'nodes'` *(default)* | the **wells**: concentric rings + a bright core, in the single mana hue, **sized by `intensity`** (stronger well → wider halo). `world.meta.wells`. |
| `'wash'` | the **winds**: every hex (land *and* sea) with `mana > 0.12` stained the mana hue, with **`fill-opacity = 0.03 + mana·0.42`** and the colour lerped `MANA → MANA_HI` for the strongest pockets. Strong pockets glow; weak ones barely whisper. Group uses `mix-blend-mode: multiply`. |

**One hue only.** No per-region colour. `MANA = #6a5a9c` (arcane violet, wind at rest), `MANA_HI = #9079d6` (luminous core of a strong pocket). Both are the single hooks to restyle the entire magic layer.

Every land/sea hex carries `data-mana="0.NN"` so the field is queryable downstream (the page's hover tooltip reads it and labels it dead calm / faint / stirring / strong / roaring).

---

## 4. The bake — world-state → SVG (`atlas-render.js` → `AtlasRender.render`)

`render(world, opts)` returns `{ svg, width, height }`. The output is **deliberately exploitable**: semantic layer groups, glyphs by `<use>`, per-hex `data-*`, stable ids. Preserve all of it.

### Layer order (back → front)

```
<rect> sea ground
#<prefix>-terrain    polygons, one per hex — class hx land|sea, fill = channel colour,
                     data-q data-r data-biome data-mana
#<prefix>-mana       the wash (mix-blend-mode:multiply) — only when magic='wash'
#<prefix>-rivers     downhill polylines, width ∝ strength
#<prefix>-coast      ONE path of shared sea-facing hex edges (smooth coastline,
                     not chunky per-hex outlines)
#<prefix>-glyphs     <use href="#prefix-key"> landform/cover symbols; group sets
                     stroke=ink, stroke-width — restyle the whole hand in one rule
#<prefix>-wells      the well marks — only when magic≠'off'
<rect> frame
```

`prefix` namespaces ids so multiple plates can coexist on one page (the brief renders 4 maps at once). Keep this.

### Terrain channels (the `channel` dial)

| `channel` | Land fill | Adds |
|---|---|---|
| `glyph` | flat parchment + soft per-biome tint | glyphs |
| `relief` *(brief default)* | parchment + biome tint + **hillshade** baked into the fill (cheap aspect lighting, quantised) | glyphs |
| `hypso` | **stepped hypsometric ramp** (3 sea steps + 8 land bands) | — |
| `stack` | hypsometric + relief shading | glyphs + emphasised coast |

**Glyphs are sparse and feature-driven** (§6): plains/grass read by tint alone; only landmark terrain earns a mark, chosen by majority within a block. One `density` knob (0–100) controls block size, dominance threshold, and which biomes earn marks.

### The "every colour is a hook" rule

No colour is baked as a literal anywhere a designer would want to change it — they all come from the `PAL` table (and `MANA`/`MANA_HI`). In the port, surface these as CSS variables / theme tokens so the atlas re-themes **without re-running the generator**. The world-state (numbers) and the styling (colours) are separate concerns.

---

## 5. Design tokens

### Palette (`PAL` in `atlas-render.js`)

| Token | Hex | Use |
|---|---|---|
| Sea | `#bcd4dc` | duck-egg shallow sea (the ground) |
| Sea deep | `#9cbcc8` | deeper water |
| Land | `#e8d9b8` | parchment |
| Coast | `#6b5130` | coastline stroke |
| River | `#5d8aa0` | river stroke |
| Glyph ink | `#2a2418` | all glyph strokes |
| **Mana** | `#6a5a9c` | the Winds — wash & wells (the one magic hue) |
| **Mana hi** | `#9079d6` | luminous core of a strong pocket |
| Sea ramp | `#7fa6b4 → #9cc0cb → #bcd4dc` | hypsometric, deep→shallow |
| Land ramp | `#9fae72 #bcbd80 #cdbd84 #c8a463 #b88a52 #9c7146 #b6a487 #efe7d4` | hypsometric, low→high (8 stepped bands) |

Per-biome soft tint table (`BIOME_TINT`) is in `atlas-render.js` — blended ~0.42 into parchment so regions read by colour even when glyphs are sparse.

### Type / surface / chrome

Inherited from the shared system — Cinzel (display), Cormorant Garamond (italic flavour), EB Garamond (body), JetBrains Mono (data/labels). `.vellum` (lighter than `.parchment`) is the map surface for readability. See `../HANDOFF.md` §4 and `assets/codex.css` (canonical). Page is themed `data-domain="terrae"` (sea-green accent `#3f8a7a`).

---

## 6. The glyph library (`atlas-glyphs.js`)

One `<symbol>` per landform/cover, authored in a 24×24 box in the **"confident engraver" hand** — bold, rounded, **open** linework, no fills, no baked colour (every stroke inherits `currentColor` + the group's stroke-width). Restyle the whole atlas's hand from one CSS rule.

- `GLYPHS` — the inner markup per key: `peak, mountain, hills, forest, pasture, dune, marsh, wave, tundra, coast`.
- `BIOME_GLYPH` — biome enum → glyph key (OCEAN → null; the renderer stamps `wave` sparsely on open sea).
- `GLYPH_ORDER` — ordered `[key, name, desc]` for the specimen sheet.
- `defs(prefix)` — emits the `<symbol>` block (called once per SVG document).

Keep glyphs as reusable symbols placed by `<use>` — do **not** inline per-hex copies. Tuned to read down to ~12px hexes.

---

## 7. Interactions & behaviour (the page)

- **Three direction plates** ("The Choice") render the same world at `channel = glyph | relief | stack`. Clicking one sets the living plate's channel and scrolls to it.
- **The living plate** ("The Plate You Can Change") is the one interactive map. The Tweaks panel drives it: `channel` (4 options), `coast` toggle, `density` slider (0–100), and `magic` (Hidden / Wells / Winds).
- **Hover any hex** → tooltip reads `data-q`, `data-r`, `data-biome`, `data-mana` (with a word: dead calm → roaring). This demonstrates the per-hex queryability of the baked SVG.
- The Tweaks panel is **review tooling only** — do not ship it. In production the two dials become either author controls or fixed render configs per use. The persistence/scaling protocol it uses is not part of the engine.

`assets/codex.js` provides the shared reveal-on-scroll + nav behaviour (honours `prefers-reduced-motion`).

---

## 8. Recommended target architecture

- **Generator** → a self-contained Python module `mapgen(seed, cfg) -> WorldState` (numpy). Emit `WorldState` as both an in-memory object and a serialisable JSON (the §IV contract): `meta` (seed, grid, sea_level, **wells**), `fields` (elevation, temperature, moisture, slope, biome, coastDist, **mana**), `features` (rivers, exceptions).
- **Bake** → a build-time step (Astro/Node or Python) `world -> svg`, mirroring `atlas-render.js`: layered groups, `<use>` glyphs, per-hex `data-*`, palette as CSS variables. Emit one SVG per channel config you need, or a single SVG whose layers you toggle with CSS.
- **Page** → `terrae/index.astro` on `CodexLayout domain="terrae"` (see `../HANDOFF.md` §5/§10). The map is the centrepiece on a `.vellum` surface; regions become clickable → Terrae deep entries; a "reroll seed" control styled as `.btn`.
- The **region adjacency graph** the generator knows (hex neighbours + biome regions) should be exported too — it doubles as data for borders/feuds in Ordines and Annales.

## 9. Accessibility & porting notes

- The baked SVG is decorative-by-default; give the map an accessible name and, where regions are interactive, real focusable elements with labels.
- Keep determinism: one seed → one world. Surface the seed in the UI for sharing.
- Keep the **percentile** biome thresholds and the **two elevation-smoothing passes** — both are load-bearing for realistic output across seeds.
- Keep colour and geometry **separate**: never bake a literal colour where a token belongs.
- `prefers-reduced-motion` is already honoured by the shared JS/CSS — preserve it.
