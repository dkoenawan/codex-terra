# Handoff: Codex Arcanum — Encyclopedia of the Twelve Schools of Magic

## Overview

Codex Arcanum is a single-page educational website for a fantasy magic system, styled as an ancient arcane academy's official codex. The tone is scholarly-but-inviting, in the spirit of a personality-quiz site (MBTI / 16personalities) crossed with a leather-bound grimoire.

The page is organised into four parts:

1. **Hero** — dramatic landing with rotating sigil ring and tagline
2. **Liber Primus — The Four Triads** — clickable summary cards for the four Latin triads
3. **Liber Secundus — The Twelve Schools** — full encyclopedia grid, each school opens a modal entry
4. **Liber Tertius — The Sorting Rite** — a 6-question quiz that recommends the user's school of magic

## About the Design Files

The files in this bundle are **design references created in HTML** — a working prototype that shows the intended look, structure, and behaviour. **They are not production code to ship directly.**

The task is to **recreate this design in your target codebase's environment** (React, Vue, Svelte, Next.js, Astro, etc.) using its established patterns and component library. If no environment exists yet, choose the framework most appropriate to the project (Next.js / Astro are good fits for a content-heavy single-page site like this).

In particular:

- The reference HTML uses inline `<script>` for data, rendering, and interactivity. Port this to your framework's idiomatic patterns: components, state hooks, file-based routing if applicable, and a typed data file (`schools.ts`, `triads.ts`, `quiz.ts`) for the magic-system content.
- The reference HTML loads Google Fonts via `<link>`. Use your framework's font-loading mechanism (e.g. `next/font`, `@fontsource` packages) for self-hosted fonts and better performance.
- The reference HTML embeds SVG sigils as strings inside a JS data array. In your codebase, prefer one of: dedicated `.svg` files imported as components, an inline-SVG React component per sigil, or an SVG sprite sheet.

## Fidelity

**High-fidelity.** All colours, typography, spacing, motion, and interactions are intentional. Recreate them pixel-accurately. Exact values are listed in **Design Tokens** below.

---

## Screens / Views

The design is a **single scrolling page** with one modal overlay. Sections are stacked vertically.

### 1. Nav Bar (fixed)

- **Position:** `position: fixed; top: 0; left: 0; right: 0;` — full width
- **Padding:** `18px 40px` (desktop), `14px 18px` (≤720px)
- **Background:** linear gradient `rgba(7,16,30,0.85) → transparent` at top; on scroll past 80px, becomes solid `rgba(7,16,30,0.92)` with a 1px gold-tinted bottom border
- **Backdrop:** `backdrop-filter: blur(8px)`
- **Brand (left):** "CODEX·ARCANUM" — Cinzel, 14px, letter-spacing 0.32em, uppercase, colour gold `#c9a961`. The `·` is parchment cream at 60% opacity, with 8px lateral margin.
- **Links (right):** "The Triads", "The Twelve", "Find Your School" — Cinzel, 11px, letter-spacing 0.28em, uppercase, parchment at 70% opacity. Hover → gold-bright `#e3c178`, 100% opacity. Gap 28px. Hidden ≤720px.
- **Smooth-scrolls** to anchors `#triads`, `#schools`, `#quiz`.

### 2. Hero

- **Layout:** full-viewport, flex column, centred. `min-height: 100vh`. Padding `120px 20px 80px`.
- **Background:** body's deep-navy base with two radial gradients (gold tint at top-left, crimson tint at bottom-right) — see `body` background in Design Tokens.
- **Vignette overlay:** absolute-positioned `::before` with two more radial gradients (gold halo + navy dim) centred on the sigil.

**Hero sigil ring (360 × 360 px)**

A composition of **three stacked SVG layers**:

- **Outer ring:** 12 Roman-numeral markers (I–XII) evenly spaced around a circle of radius 150 from centre. Each marker is a 2px gold dot with a Cinzel text label below (9px). Wrapped in an `animation: spin-slow 90s linear infinite`.
- **Inner ring:** smaller circle (r=115) with 4 cardinal triangular markers (filled gold). Rotation reversed, 60s.
- **Centre stationary:** a twelve-pointed star — concentric circles (r=60, r=42), a 4-armed cross of straight lines, an 8-pointed star polygon, and a central 4px gold dot. Stroke colour `#e3c178` at 0.9 opacity.

**Eyebrow line:** "Anno Magisterii · MCDXXXVII" — Cinzel 12px, letter-spacing 0.45em, gold, uppercase. Flanked left and right by 40px-wide horizontal gradient lines fading to transparent.

**Title (`<h1>`):** "Codex" / `<br>` / "Arcanum" — Cinzel 500-weight, `clamp(40px, 7.2vw, 96px)`, line-height 1.0, letter-spacing 0.06em, parchment `#e8d9b8`, text-shadow `0 2px 20px rgba(201,169,97,0.18)`.

**Subtitle inside h1:** "— or, the twelve schools of magic —" — Cormorant Garamond italic 400, 0.55em of h1 size, margin-top 18px, colour gold-bright `#e3c178`, lowercase.

**Tagline:** "All workings of the Art descend from twelve roots, twined into four sacred triads. Learn their names. Find which whispers your own." — Cormorant Garamond italic, `clamp(18px, 2vw, 24px)`, parchment 78% opacity, max-width 620px, margin-top 36px.

**Stat row:** three items, gap 40px, flex-wrapping. Each item is `<span class="num">N</span>Label`. Numbers: parchment, 22px, weight 600, letter-spacing 0.04em. Labels: Cinzel 11px gold, letter-spacing 0.32em, uppercase. Items: "IV Triads", "XII Schools", "∞ Workings".

**Scroll cue:** bottom-centre. "Descend" label in Cinzel 10px gold (letter-spacing 0.4em) above a 1px vertical gold gradient line (height 36px), pulsing via `@keyframes pulse` over 2.4s (opacity 0.3→1, scaleY 0.6→1).

### 3. The Four Triads section

- **Container:** `section.codex` with padding `120px 40px` (desktop), `80px 18px` (mobile).
- **Section head pattern (reused everywhere):**
  - "Liber Primus" — Cinzel 12px gold, letter-spacing 0.5em
  - h2 title — Cinzel `clamp(32px, 4.5vw, 56px)`, parchment, margin-top 14px
  - Ornamental rule — two 60px horizontal gradient lines flanking a 6×6 gold diamond rotated 45°. Margin-top 26px.
  - Subtitle — Cormorant Garamond italic 19px parchment 72%, max-width 620px, margin-top 14px.

**Triad grid:**

- 4 columns (≤980px → 2, ≤540px → 1), gap 22px, max-width 1280px centred.

**Triad card:**

- Parchment background (see Parchment Pattern in Design Tokens).
- Padding `36px 28px 30px`. `min-height: 360px`. Flex column.
- **Hover:** `translateY(-4px)`, intensified inset shadow + outer shadow `0 24px 50px rgba(0,0,0,0.45)`. Transition 0.45s.
- **Cursor:** pointer. **Click action:** smooth-scrolls to the corresponding `#band-{triadId}` section in The Twelve Schools.
- **Corner ornaments:** four `.frame-deco` elements (TL, TR, BL, BR) each 36×36px, containing an SVG `<use href="#corner-orn"/>`. The ornament is a small curved gold-brown filigree (see SVG defs in source). Each corner mirrored via CSS `transform: scaleX(-1)` / `scaleY(-1)`.
- **Content stack:**
  - Roman numeral label: Cinzel 11px, letter-spacing 0.4em, colour `#8e7338`, uppercase
  - Triad name (h3-equivalent): Cinzel 30px ink `#2a2418`, letter-spacing 0.06em, margin-top 12px
  - English subtitle: Cormorant Garamond italic 16px, ink-soft `#4a3f2a`, margin-top 4px
  - Blurb paragraph: 15.5px ink-soft, margin-top 20px, flex:1
  - School list — pads 22px top margin and 18px padding-top above a dashed rule `1px dashed rgba(120,90,40,0.4)`. Each school name: Cinzel 11px ink uppercase, letter-spacing 0.28em, preceded by a 9px gold-deep `✦` glyph via `::before` (10px gap).
- **Background flourish:** a 220×220 SVG triad-sigil positioned `right: -30px; bottom: -30px;` at opacity 0.07.

### 4. The Twelve Schools section

- **Background:** deeper navy `#07101e`.
- **Borders:** 1px horizontal gold gradient at top and bottom (`::before` / `::after`).
- **Layout:** four `triad-band` blocks (one per triad), each containing a band-head and a 3-column school grid.

**Band-head:**

- Flex row, baseline-aligned, gap 18px. Bottom border `1px solid rgba(201,169,97,0.25)`, padding-bottom 14px, margin-bottom 30px.
- "Triad I" — Cinzel 12px gold, letter-spacing 0.4em
- Triad name uppercase — Cinzel 22px parchment, letter-spacing 0.12em
- "— the magic of matter" — Cormorant Garamond italic 16px parchment 60% opacity

**School grid:** 3 cols (≤900px → 2, ≤560px → 1), gap 18px.

**School card:**

- Parchment background, `min-height: 260px`, padding `30px 26px 26px`. Two corner ornaments (TL, TR only).
- **Hover:** `translateY(-4px)`, gold-deep inset border, outer shadow `0 20px 40px rgba(0,0,0,0.5)`.
- **Click:** opens the school modal (see below).
- **Content stack:**
  - Sigil — 64×64px SVG (gold-deep stroke, no fill), margin-bottom 18px
  - School name — Cinzel 22px ink, letter-spacing 0.08em
  - Role line — Cormorant Garamond italic 15px ink-soft, margin-top 4px
  - Description — 15px ink-soft, line-height 1.55, margin-top 14px, flex:1
  - "Read entry →" — Cinzel 10px gold-deep, letter-spacing 0.4em, uppercase, margin-top 18px. The arrow translates 4px right on hover.

### 5. The Sorting Rite (Quiz)

- **Container:** centred `.quiz-frame.parchment` — max-width 760px, padding `60px 52px 50px`, min-height 540px. Four corner ornaments.
- **Background ambient:** radial gold halo at top-centre via `::before` on the section.

**Question state:**

- **Progress dots:** row of 6 bars (28×2px), gap 8px. Default `rgba(120,90,40,0.3)`; completed → `#8e7338`; current → `#2a2418`. Margin-bottom 14px.
- **Counter:** "Question III of VI" — Cinzel 11px gold-deep, letter-spacing 0.4em, uppercase. Roman-numerated. Margin-bottom 28px.
- **Question text:** Cormorant Garamond 500-weight, 30px (24px ≤600px), line-height 1.3, ink, margin-bottom 28px.
- **Answer buttons:** flex column, gap 12px.
  - Each is a wide button: padding `18px 22px`, 1px border `rgba(120,90,40,0.35)`, transparent fill. EB Garamond 17px ink.
  - Left marker — A / B / C / D — Cinzel 11px gold-deep, letter-spacing 0.3em. 16px gap to answer text.
  - **Hover:** background `rgba(120,90,40,0.10)`, border → gold-deep, `translateX(4px)`. Transition 0.25s.
  - **Click:** records the answer's weight map, advances to next question.
- **Nav row:** top-bordered dashed rule. "← Previous" button (left) disables on Q1. Buttons: Cinzel 11px ink-soft, letter-spacing 0.36em, uppercase, hover → ink.

**Result state:**

- Centred. "The Codex has spoken" eyebrow (Cinzel 11px gold-deep, letter-spacing 0.4em, uppercase).
- Sigil — 100×100px.
- School name — Cinzel 46px ink, letter-spacing 0.04em.
- Triad line — "Triad III · Vocatio — the magic of calling & binding" — Cormorant Garamond italic 18px ink-soft.
- Description paragraph — 17px ink, line-height 1.7, max-width 540px centred, margin-top 22px.
- Flavour quote — Cormorant Garamond italic 19px ink-soft, max-width 540px centred, margin-top 18px.
- Second-affinity callout — dashed top rule, "Second Affinity" eyebrow + "*School Name* — role line".
- Action row: "↺ Begin the rite anew" (gold-deep) + "Read full entry →" (opens modal for the result school).

**Quiz behaviour:** entrance animation `@keyframes fade-in` on each stage swap — 0.5s ease, translateY(8px) → 0.

**Quiz scoring algorithm:**

- Each answer is associated with a *weight map* like `{ evocation: 2, abjuration: 1 }`.
- On each answer click, store the weight map at index `quizIdx`.
- At result time: sum weights across all answered questions per school, sort descending. Index `[0]` = primary, `[1]` = second affinity.
- See `QUIZ` array in source for exact weights — they are tuned to cover all 12 schools without ties in common paths.

### 6. School Modal Overlay

- **Backdrop:** `position: fixed; inset: 0;`, `rgba(7,16,30,0.85)` with `backdrop-filter: blur(10px)`. Fades in (opacity 0→1, 0.3s).
- **Modal panel:** centred parchment card, max-width 720px, max-height 90vh, scroll-y. Padding `60px 50px 50px` (`50px 26px 30px` on ≤560px). Four corner ornaments. Entrance transform `scale(0.96) → scale(1)`, 0.4s `cubic-bezier(.2,.7,.2,1)`.
- **Close button:** top-right, 36×36 circular, 1px gold-deep border, transparent. Hover → gold fill, navy `×` glyph.
- **Content stack:**
  - Triad tag — "Triad III · Vocatio · the magic of calling & binding" — Cinzel 11px gold-deep, letter-spacing 0.4em, uppercase
  - School name — Cinzel 44px (32px on mobile) ink, letter-spacing 0.04em
  - Role — Cormorant Garamond italic 20px ink-soft
  - **Sigil row** — flex row with 24px gap. 80×80 sigil + "Sigillum" callout (Cinzel 11px ink uppercase title + Cormorant Garamond italic 16px ink-soft body). Top and bottom dashed rules `1px dashed rgba(120,90,40,0.4)`, padding 24px Y.
  - **Definition** section header — Cinzel 12px gold-deep, letter-spacing 0.36em, uppercase. Body paragraph 17px ink, line-height 1.7.
  - **Words of the Masters** — flavour quote as a left-bordered blockquote (2px solid gold-deep, padding-left 18px), Cormorant Garamond italic 19px ink-soft.
  - **Kindred Schools** — Cinzel header + paragraph listing the other two schools in the same triad.
- **Dismissal:** clicking backdrop or `Escape` key closes. While open, body sets `overflow: hidden`.

### 7. Footer

- Padding `70px 30px 50px`, text-aligned centre, deep-navy background, top border `1px solid rgba(201,169,97,0.18)`.
- 80×80 circular twelve-fold sigil at 60% opacity.
- Line 1: "Codex Arcanum · Sigillum Magisterii" — Cinzel 11px gold, letter-spacing 0.4em, uppercase.
- Line 2: "Compiled by the Hand of the Twelve, that the Art might not be lost." — Cormorant Garamond italic 15px parchment 55% opacity.
- Line 3: "— Finis —" — Cinzel 10px gold-deep, letter-spacing 0.36em, uppercase, margin-top 30px.

---

## Interactions & Behavior

| Trigger | Effect |
|---|---|
| Scroll | Nav transitions to solid `rgba(7,16,30,0.92)` with 1px gold-tinted bottom border past 80px scroll |
| Nav link click | Smooth scroll to `#triads`, `#schools`, or `#quiz` |
| Triad card hover | `translateY(-4px)` + deepened shadows, 0.45s ease |
| Triad card click | Smooth scroll to `#band-{triadId}` (the corresponding band in The Twelve Schools) |
| School card hover | `translateY(-4px)` + gold-deep inset border + outer shadow, 0.4s |
| School card click | Open modal for that school |
| Modal "×" or backdrop click or Escape key | Close modal, restore body overflow |
| Quiz answer click | Record weight map at `quizIdx`, increment, re-render quiz; fade-in animation on next question |
| Quiz "Previous" click | Decrement `quizIdx` (disabled on Q1) |
| Quiz "Begin anew" click | Reset `quizIdx = 0` and clear answers |
| Quiz "Read full entry" click | Open modal for the result school |
| Hero sigil (always) | Outer ring rotates 360° every 90s; inner ring rotates reverse every 60s |
| Scroll cue line | Pulses opacity 0.3↔1 and scaleY 0.6↔1 every 2.4s |
| IntersectionObserver | Elements with `.reveal` class fade-up (opacity 0→1, translateY 28px→0, 0.9s `cubic-bezier(.2,.7,.2,1)`). Stagger via `.delay-1`/`.delay-2`/`.delay-3`/`.delay-4` (80ms increments). Threshold 0.12, rootMargin `0px 0px -8% 0px`. Each element unobserved after first reveal. |

---

## State Management

The design needs the following state. In React, these can be three `useState` hooks (one for quiz, one for modal, one for nav scroll):

```ts
type QuizState = {
  index: number;              // current question index, 0–6
  answers: WeightMap[];       // recorded weights per question
};
type ModalState = {
  openSchoolId: SchoolId | null;
};
type NavState = {
  scrolled: boolean;          // true when window.scrollY > 80
};
```

`scrolled` is the only state derived from a window event (`scroll`); the rest are pure UI state.

The quiz result is **derived state** — compute on render by summing weights across `answers` and sorting:

```ts
function rankSchools(answers: WeightMap[]): SchoolId[] {
  const totals: Record<SchoolId, number> = Object.fromEntries(
    ALL_SCHOOLS.map(s => [s.id, 0])
  );
  for (const w of answers) for (const k in w) totals[k] += w[k];
  return Object.entries(totals)
    .sort(([, a], [, b]) => b - a)
    .map(([id]) => id as SchoolId);
}
```

No data fetching is required — all content is local static data.

---

## Design Tokens

### Colors

| Token | Hex | Used for |
|---|---|---|
| `--navy` | `#0d1626` | Body background base |
| `--navy-deep` | `#07101e` | The Twelve Schools section, footer, modal backdrop tint |
| `--navy-rich` | `#14213a` | Secondary navy gradient stops |
| `--parchment` | `#e8d9b8` | Parchment cards, hero h1, body text on navy |
| `--parchment-warm` | `#d8c79a` | (reserved, secondary parchment) |
| `--parchment-shadow` | `#b9a679` | (reserved, parchment shadow tint) |
| `--ink` | `#2a2418` | Body text on parchment, current quiz step |
| `--ink-soft` | `#4a3f2a` | Secondary text on parchment |
| `--gold` | `#c9a961` | Primary accent — eyebrows, brand, dividers |
| `--gold-bright` | `#e3c178` | Hover gold, h1 subtitle, central star stroke |
| `--gold-deep` | `#8e7338` | Sigil strokes, "Read entry" links, ornaments, completed quiz steps |
| `--crimson` | `#6b1f24` | Background radial accent only (very subtle) |

### Body background

```css
background:
  radial-gradient(ellipse at 20% 0%, rgba(201,169,97,0.06), transparent 50%),
  radial-gradient(ellipse at 80% 100%, rgba(107,31,36,0.10), transparent 50%),
  #0d1626;
background-attachment: fixed;
```

### Parchment pattern (critical — do not replace with a flat color)

Layered with `background-blend-mode: multiply, multiply, normal, multiply;`:

```css
background-color: #e8d9b8;
background-image:
  radial-gradient(ellipse at 30% 20%, rgba(255,240,200,0.6), transparent 60%),
  radial-gradient(ellipse at 75% 85%, rgba(140,110,60,0.25), transparent 60%),
  radial-gradient(ellipse at 50% 50%, rgba(120,90,40,0.10), transparent 80%),
  url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 0.18  0 0 0 0 0.15  0 0 0 0 0.09  0 0 0 0.35 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.6'/></svg>");
box-shadow:
  inset 0 0 60px rgba(120, 90, 40, 0.35),
  inset 0 0 0 1px rgba(120, 90, 40, 0.18);
```

The SVG turbulence noise is what gives the parchment its grain. In a framework you can either keep it inline as a data-URL or extract to `parchment.svg` and use `background-image: url('/parchment.svg')`.

`.parchment.tight` variant: weaker shadow `inset 0 0 30px rgba(120,90,40,0.30), inset 0 0 0 1px rgba(120,90,40,0.18)` — used on the smaller school cards.

### Typography

**Font families** (Google Fonts):

- **Cinzel**, weights 400/500/600/700 — display headings, eyebrows, all caps-tracked labels
- **Cormorant Garamond**, weights 400/500/600 (regular + italic) — sub-headings, italic flavour text, quiz questions
- **EB Garamond**, weights 400/500/600 (regular + italic) — body text, quiz answer buttons

Google Fonts import:

```html
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet" />
```

For Next.js, prefer `next/font/google`. For Astro/Vite, prefer `@fontsource/cinzel`, `@fontsource/cormorant-garamond`, `@fontsource/eb-garamond`.

**Default body type:** EB Garamond 18px / line-height 1.6.

**Heading defaults:** Cinzel 500, letter-spacing 0.04em, margin 0.

**Type scale (per use):**

| Use | Font | Size | Weight | Tracking | Notes |
|---|---|---|---|---|---|
| Hero h1 | Cinzel | clamp(40, 7.2vw, 96)px | 500 | 0.06em | lh 1.0 |
| Hero h1 amp | Cormorant Garamond | 0.55em (of h1) | 400 italic | 0.02em | lowercase |
| Hero tagline | Cormorant Garamond | clamp(18, 2vw, 24)px | 400 italic | — | parchment 78% |
| Hero eyebrow | Cinzel | 12px | 500 | 0.45em | uppercase, gold |
| Section h2 | Cinzel | clamp(32, 4.5vw, 56)px | 500 | 0.04em | parchment |
| Section roman | Cinzel | 12px | 500 | 0.5em | uppercase, gold |
| Section sub | Cormorant Garamond | 19px | 400 italic | — | parchment 72% |
| Triad card name | Cinzel | 30px | 500 | 0.06em | ink |
| Triad card en-sub | Cormorant Garamond | 16px | 400 italic | — | ink-soft |
| Triad card blurb | EB Garamond | 15.5px | 400 | — | ink-soft |
| Triad card school item | Cinzel | 11px | 500 | 0.28em | uppercase, ink |
| Band head triad-name | Cinzel | 22px | 500 | 0.12em | uppercase, parchment |
| School card name | Cinzel | 22px | 500 | 0.08em | ink |
| School card role | Cormorant Garamond | 15px | 400 italic | — | ink-soft |
| School card desc | EB Garamond | 15px | 400 | — | lh 1.55, ink-soft |
| School "Read entry" | Cinzel | 10px | 500 | 0.4em | uppercase, gold-deep |
| Quiz counter | Cinzel | 11px | 500 | 0.4em | uppercase, gold-deep |
| Quiz question | Cormorant Garamond | 30px (24 mobile) | 500 | — | lh 1.3, ink |
| Quiz answer | EB Garamond | 17px | 400 | — | ink |
| Quiz marker (A/B/C/D) | Cinzel | 11px | 500 | 0.3em | gold-deep |
| Quiz nav button | Cinzel | 11px | 500 | 0.36em | uppercase, ink-soft |
| Result school name | Cinzel | 46px | 500 | 0.04em | ink |
| Result triad | Cormorant Garamond | 18px | 400 italic | — | ink-soft |
| Result blurb | EB Garamond | 17px | 400 | — | lh 1.7, ink |
| Result flavour | Cormorant Garamond | 19px | 400 italic | — | ink-soft |
| Modal nm | Cinzel | 44px (32 mobile) | 500 | 0.04em | ink |
| Modal h4 | Cinzel | 12px | 500 | 0.36em | uppercase, gold-deep |
| Modal body | EB Garamond | 17px | 400 | — | lh 1.7, ink |
| Modal flavour | Cormorant Garamond | 19px | 400 italic | — | lh 1.65, ink-soft, left-bordered |
| Nav brand | Cinzel | 14px | 500 | 0.32em | uppercase, gold |
| Nav links | Cinzel | 11px | 500 | 0.28em | uppercase, parchment 70% |
| Footer line 1 | Cinzel | 11px | 500 | 0.4em | uppercase, gold |
| Footer line 2 | Cormorant Garamond | 15px | 400 italic | — | parchment 55% |
| Footer line 3 | Cinzel | 10px | 500 | 0.36em | uppercase, gold-deep |

### Spacing

- Section padding (vertical): 120px desktop / 80px mobile
- Section padding (horizontal): 40px desktop / 18px mobile
- Section-head bottom margin: 64px
- Triad grid gap: 22px
- School grid gap: 18px
- Triad band bottom margin: 80px (last has no margin)
- Triad band head padding-bottom: 14px, margin-bottom 30px
- Triad card padding: 36px 28px 30px
- School card padding: 30px 26px 26px
- Quiz frame padding: 60px 52px 50px (50px 24px 36px on ≤600px)
- Modal padding: 60px 50px 50px (50px 26px 30px on ≤560px)
- Footer padding: 70px 30px 50px

### Border radii

The design intentionally uses **no rounded corners** anywhere — parchment cards are crisp rectangles (border-radius 2px or 0). Two exceptions: the modal close button (`border-radius: 50%`) and the central 4px star dot (circle by definition).

### Shadows

- Card default (inset only, via parchment): `inset 0 0 60px rgba(120,90,40,0.35), inset 0 0 0 1px rgba(120,90,40,0.18)`
- Card `.tight` variant: `inset 0 0 30px rgba(120,90,40,0.30), inset 0 0 0 1px rgba(120,90,40,0.18)`
- Triad card hover: above + `0 24px 50px rgba(0,0,0,0.45)` outer
- School card hover: `inset 0 0 35px rgba(120,90,40,0.40), inset 0 0 0 1px var(--gold-deep), 0 20px 40px rgba(0,0,0,0.5)`
- Hero h1 text-shadow: `0 2px 20px rgba(201,169,97,0.18)`

### Motion

| Animation | Duration | Easing | Properties |
|---|---|---|---|
| Card hover lift | 0.45s (triad) / 0.4s (school) | ease | translateY, box-shadow |
| Quiz answer hover | 0.25s | ease | translateX, background, border-color |
| Sigil outer ring | 90s linear infinite | linear | rotate 360° |
| Sigil inner ring | 60s linear infinite reverse | linear | rotate -360° |
| Scroll cue line pulse | 2.4s infinite | ease-in-out | opacity 0.3↔1, scaleY 0.6↔1 |
| Section reveal | 0.9s | cubic-bezier(.2,.7,.2,1) | opacity 0→1, translateY 28→0 |
| Reveal stagger | 80ms increments | — | via `.delay-1`/`.delay-2`/`.delay-3`/`.delay-4` |
| Modal backdrop fade | 0.3s | ease | opacity |
| Modal panel | 0.4s | cubic-bezier(.2,.7,.2,1) | scale 0.96→1 |
| Quiz stage swap | 0.5s | ease | opacity 0→1, translateY 8→0 |

---

## Assets

**No external assets, images, or icon fonts are used.** Every visual element is one of:

- **Inline SVG** drawn from primitives (lines, polygons, circles, paths)
- **CSS gradients** (radial / linear)
- **SVG turbulence noise** generated inline via data-URL (the parchment grain)
- **Unicode glyphs:** `✦` (triad card school bullets), `×` (modal close), `→` (read-entry arrow), `↺` (restart quiz), `←` (previous question)

### The 12 sigils

Each school has a unique geometric SVG sigil (viewBox 64×64, gold-deep stroke `#8e7338` 1.2px, no fill on outer strokes, small gold-deep filled dot accents).

| School | Sigil composition |
|---|---|
| Enchantment | Concentric hexagons with radial spokes and a central dot |
| Transmutation | Square > circle > triangle, with a small filled circle inside |
| Animation | Square frame around an inward-spiralling path with terminal dot |
| Evocation | 8-armed cross of straight lines emanating from a central circle |
| Abjuration | Heater-shield silhouette with inner cross and inner shield outline |
| Kinesis | Circle with a horizontal double-arrow through its centre |
| Conjuration | Figure-8 / lemniscate woven knot with four corner dots |
| Summoning | Pentagram inside a circle with 4 cardinal external spokes |
| Pacting | Two interlocking circles bisected by a horizontal line, each with a central dot |
| Telepathy | A vesica piscis (two opposing arcs) with central dot |
| Illusion | Two interlocking crescent forms |
| Delirium | Two recursive S-curves (dashed strokes) with central dot |

Full SVG source is in `Codex Arcanum.html` inside the `SCHOOLS` data array.

### The two reusable SVGs

- `#corner-orn` — symbol defined in `<defs>` at the bottom of the document. A small curved gold-brown filigree, mirrored via CSS at each corner via `transform: scaleX/Y(-1)` on a wrapping `<div class="frame-deco">`.
- Triad sigil — defined in JS as `triadSigil` and rendered into each triad card's `.sigil-bg` at 0.07 opacity. A circle-within-circle plus two opposing filled triangles.
- Hero ring — three composed SVGs (outer/inner/centre), defined directly in markup. See `.hero-sigil` block.
- Footer sig — circle + circle + two diamonds + central dot, 80×80.

---

## Content data

All copy is final and intentional. Port it verbatim. Source of truth: the `SCHOOLS`, `TRIADS`, and `QUIZ` arrays in `Codex Arcanum.html`. Recommended TypeScript shapes:

```ts
type TriadId = "materia" | "potentia" | "vocatio" | "mentis";
type SchoolId =
  | "enchantment" | "transmutation" | "animation"
  | "evocation"   | "abjuration"    | "kinesis"
  | "conjuration" | "summoning"     | "pacting"
  | "telepathy"   | "illusion"      | "delirium";

interface Triad {
  id: TriadId;
  roman: "I" | "II" | "III" | "IV";
  name: string;       // e.g. "Materia"
  en: string;         // "the magic of matter"
  blurb: string;
  schools: string[];  // English display names of the 3 schools
  color: string;      // reserved for future per-triad theming
}

interface School {
  id: SchoolId;
  name: string;
  triad: TriadId;
  role: string;       // italic subtitle
  desc: string;       // definition paragraph
  flavour: string;    // master's quote (already includes attribution)
  sigil: string;      // raw SVG string, or replace with a React component reference
}

type WeightMap = Partial<Record<SchoolId, number>>;

interface QuizQuestion {
  q: string;
  answers: { t: string; w: WeightMap }[];
}
```

There are 4 triads, 12 schools, and 6 quiz questions, each with exactly 4 answers.

---

## Responsive breakpoints

| Breakpoint | Changes |
|---|---|
| `≤ 980px` | Triad grid 4 → 2 columns |
| `≤ 900px` | School grid 3 → 2 columns |
| `≤ 720px` | Nav padding shrinks; nav links hidden (recommend adding a hamburger if your codebase has a Sheet/Drawer primitive) |
| `≤ 600px` | Quiz frame padding shrinks; quiz question 30 → 24px |
| `≤ 560px` | School grid 2 → 1 column; modal padding shrinks; modal name 44 → 32px |
| `≤ 540px` | Triad grid 2 → 1 column |

The hero, h1 size, h2 size, and tagline use `clamp()` and reflow continuously — no breakpoint needed.

---

## Accessibility notes

- All decorative SVGs have `aria-hidden="true"`. School modals should set focus on the panel on open and return focus to the triggering card on close (the current HTML does not do this — add `useEffect` focus management when porting).
- The modal close button currently has `aria-label="Close"`. Add `role="dialog"` and `aria-modal="true"` to the panel, and `aria-labelledby` referencing the school name id when porting.
- Quiz answer buttons are real `<button>` elements — keyboard-accessible by default.
- Provide `prefers-reduced-motion` handling: disable the sigil ring rotations, the scroll cue pulse, and the scroll-reveal animations.

```css
@media (prefers-reduced-motion: reduce) {
  .ring-outer, .ring-inner, .scroll-cue .line { animation: none; }
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

Not included in the reference HTML — please add when porting.

---

## Files

- `Codex Arcanum.html` — the working design reference. Single self-contained file. All data (`TRIADS`, `SCHOOLS`, `QUIZ`), all SVG sigils, all styles, and all interactivity live here. Open it directly in a browser to interact with the prototype.

## Suggested file layout in target codebase

A reasonable Next.js / Astro layout:

```
app/
  page.tsx                      // composes the sections
  components/
    Nav.tsx
    Hero.tsx
    HeroSigil.tsx               // the 3-layer rotating SVG
    SectionHead.tsx             // roman + h2 + ornamental rule + sub
    TriadsGrid.tsx
    TriadCard.tsx
    SchoolsSection.tsx
    TriadBand.tsx
    SchoolCard.tsx
    SchoolModal.tsx
    Quiz.tsx
    Quiz.QuestionStage.tsx
    Quiz.ResultStage.tsx
    Footer.tsx
    CornerOrnament.tsx          // wraps the #corner-orn symbol; 4 corners as a render-prop or composed children
    Sigil.tsx                   // a registry component that takes a SchoolId and renders the right SVG
  data/
    triads.ts
    schools.ts
    quiz.ts
    types.ts
  styles/
    globals.css                 // CSS vars (--navy, --gold, etc.), body bg, parchment utility class
    parchment.svg               // extracted turbulence noise (or inline data-URL in CSS)
  lib/
    useReveal.ts                // IntersectionObserver hook
    useEscape.ts                // dismiss-on-Escape hook
    rankSchools.ts              // quiz scoring
```
