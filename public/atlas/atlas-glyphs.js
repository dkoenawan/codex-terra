/* ═══════════════════════════════════════════════════════════════════════
   THE GLYPH LIBRARY — Liber II Terrae
   ─────────────────────────────────────────────────────────────────────
   One <symbol> per landform/landcover, authored in a 24×24 box, in the
   "confident engraver" hand: bold, rounded, OPEN linework. No fills, no
   baked colour — every stroke inherits `currentColor` + the group's
   stroke-width, so Design re-themes the whole atlas from one CSS rule and
   Claude Code places each by <use href="#g-…">. (§VI: glyphs as symbols.)

   Coordinate space 0–24. Visual weight tuned to read down to ~12px hexes.
   ═══════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  // inner markup only — stroke/fill inherited from the #glyphs group
  const GLYPHS = {
    // sharp twin summit with a snow notch
    peak:
      '<path d="M3.5 20 L9.5 6.5 L13.5 14"/>' +
      '<path d="M11 18.5 L16 7 L20.5 20"/>' +
      '<path d="M13.6 11.3 L16 8.4 L18.4 11.3" stroke-opacity="0.55"/>',
    // rounded massif, two ridgelines
    mountain:
      '<path d="M2.5 19.5 L9 9 L13.5 16"/>' +
      '<path d="M11 18 L16.5 9.5 L21.5 19.5"/>',
    // gentle rolling bumps — domes sitting ON a ground line (not floating
    // arcs, which read as birds). Z closes each arc back along its base.
    hills:
      '<path d="M3 16.5 Q7.5 11 12 16.5 Z"/>' +
      '<path d="M11 17 Q15 12.5 19.5 17 Z"/>',
    // a fir — stem + two open canopy chevrons
    forest:
      '<path d="M12 20 L12 12.5"/>' +
      '<path d="M7 13 L12 6 L17 13"/>' +
      '<path d="M8.5 16.5 L12 11.5 L15.5 16.5"/>',
    // pasture — three blades of grass
    pasture:
      '<path d="M7 18.5 Q6.5 13.5 8.5 11.5"/>' +
      '<path d="M12 19 Q12 12.5 12 10.5"/>' +
      '<path d="M17 18.5 Q17.5 13.5 15.5 11.5"/>',
    // dunes — long, low, asymmetric desert swells with a wind ripple
    dune:
      '<path d="M2 16.5 Q7 12.5 12.5 16.5"/>' +
      '<path d="M11.5 17.5 Q16 14 21.5 17.5"/>' +
      '<path d="M5.5 19.5 Q8.5 18.2 11.5 19.5" stroke-opacity="0.5"/>',
    // marsh — reeds rising from a waterline
    marsh:
      '<path d="M5 19 Q12 16.5 19 19"/>' +
      '<path d="M8 18.5 L8 9.5"/><path d="M8 9.5 Q9.5 10.5 8 12" stroke-opacity="0.7"/>' +
      '<path d="M12.5 19 L12.5 7.5"/><path d="M12.5 7.5 Q14.2 8.6 12.5 10.4" stroke-opacity="0.7"/>' +
      '<path d="M16.5 18.5 L16.5 10"/><path d="M16.5 10 Q18 11 16.5 12.6" stroke-opacity="0.7"/>',
    // open sea swell — sparse, placed on only some ocean hexes
    wave:
      '<path d="M3.5 13.5 Q7 9.5 10.5 13.5 T17.5 13.5" stroke-opacity="0.8"/>',
    // tundra — sparse frost crosses
    tundra:
      '<path d="M9 12 L9 16 M7 14 L11 14" stroke-opacity="0.7"/>' +
      '<path d="M16 9.5 L16 13.5 M14 11.5 L18 11.5" stroke-opacity="0.55"/>',
    // coast — a dotted strand
    coast:
      '<path d="M6 14.5 L6.4 14.5" stroke-linecap="round"/>' +
      '<path d="M11 16 L11.4 16" stroke-linecap="round"/>' +
      '<path d="M16 14.5 L16.4 14.5" stroke-linecap="round"/>',
  };

  // biome enum (matches AtlasCore) → glyph key
  const BIOME_GLYPH = {
    0: null,        // OCEAN (wave is stamped sparsely, handled by renderer)
    1: 'coast',
    2: 'marsh',
    3: 'pasture',
    4: 'forest',
    5: 'hills',
    6: 'mountain',
    7: 'peak',
    8: 'dune',
    9: 'tundra',
  };

  // ordered list for the specimen sheet
  const GLYPH_ORDER = [
    ['peak', 'Peak', 'snow-crowned summit'],
    ['mountain', 'Mountain', 'high stone'],
    ['hills', 'Hills', 'rolling upland'],
    ['forest', 'Forest', 'woodland cover'],
    ['pasture', 'Pasture', 'open grassland'],
    ['dune', 'Dune', 'arid desert'],
    ['marsh', 'Marsh', 'fen & wetland'],
    ['tundra', 'Tundra', 'frozen waste'],
    ['coast', 'Coast', 'tidal strand'],
    ['wave', 'Swell', 'open sea'],
  ];

  // build the <defs> block of <symbol>s (called once per SVG document)
  function defs(prefix = 'g') {
    let s = '';
    for (const key in GLYPHS) {
      s += `<symbol id="${prefix}-${key}" viewBox="0 0 24 24" overflow="visible">${GLYPHS[key]}</symbol>`;
    }
    return s;
  }

  global.AtlasGlyphs = { GLYPHS, BIOME_GLYPH, GLYPH_ORDER, defs };
})(window);
