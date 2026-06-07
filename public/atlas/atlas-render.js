/* ═══════════════════════════════════════════════════════════════════════
   THE RENDERER — world-state → exploitable SVG  (design prototype of the bake)
   ─────────────────────────────────────────────────────────────────────
   Layered semantic groups, glyphs placed by <use>, per-hex data-* and a
   stable id — the document Astro can query and Design can restyle. Three
   terrain channels (glyph / relief / hypso) and their stack, plus the
   demoted magic layer: a few mana wells by default, an opt-in soft wash of
   the Winds (one hue, intensity = strength). Channel & magic are the live
   dials. (§VI, §VII.)
   ═══════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';
  const { hexCenter, hexPolygon, mapPixelSize, neighbours, BIOME } = global.AtlasCore;
  const { BIOME_GLYPH, defs } = global.AtlasGlyphs;

  // ── the codex palette (aged-atlas) ───────────────────────────────────
  const PAL = {
    sea:    '#bcd4dc',     // duck-egg shallow sea (the §VI ground)
    seaDeep:'#9cbcc8',
    land:   '#e8d9b8',     // parchment
    coast:  '#6b5130',     // coastline emphasis
    river:  '#5d8aa0',
    ink:    '#2a2418',     // glyph engraving
    // stepped hypsometric ramp — muted, aged
    seaRamp:  ['#7fa6b4', '#9cc0cb', '#bcd4dc'],                 // deep→shallow
    landRamp: ['#9fae72', '#bcbd80', '#cdbd84', '#c8a463',      // low→high
               '#b88a52', '#9c7146', '#b6a487', '#efe7d4'],
  };
  // the Winds of Magic — ONE arcane hue (no schools, no affinity). Weak
  // pockets read as a faint stain; strong wells glow toward the bright core.
  const MANA    = '#6a5a9c';   // arcane violet — the wind at rest
  const MANA_HI = '#9079d6';   // luminous core of a strong pocket
  // soft per-biome tint, blended lightly into the parchment so regions
  // read by colour even when glyphs are sparse (keys match BIOME enum)
  const BIOME_TINT = {
    1: '#e0d2a8',  // coast (subtle beach — close to parchment)
    2: '#9fb39a',  // marsh
    3: '#c2c585',  // pasture
    4: '#8ba869',  // forest
    5: '#cbb079',  // hills
    6: '#b3a288',  // mountain
    7: '#ece7da',  // peak
    8: '#dcc488',  // desert
    9: '#d2dadb',  // tundra
  };

  const lerpHex = (a, b, t) => {
    const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
    const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
    const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
    return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
  };

  // blend a hex colour toward black/white by a signed amount (-1..1)
  function shadeColor(hex, amt) {
    if (amt === 0) return hex;
    return amt < 0 ? lerpHex(hex, '#23190d', Math.min(0.5, -amt)) : lerpHex(hex, '#fffaf0', Math.min(0.45, amt));
  }

  function render(world, opts) {
    const o = Object.assign({ channel: 'glyph', hexSize: 9, pad: 8, magic: 'nodes', coast: true, prefix: 'g', glyphScale: 0.92, glyphBlock: 2 }, opts);
    const { cols, rows } = world.meta.grid;
    const sea = world.meta.sea_level;
    const F = world.fields;
    const idx = (c, r) => r * cols + c;
    const s = o.hexSize;
    const [W, H] = mapPixelSize(cols, rows, s, o.pad);

    // precompute centers
    const cx = new Float32Array(cols * rows), cy = new Float32Array(cols * rows);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const [x, y] = hexCenter(c, r, s, o.pad); cx[idx(c, r)] = x; cy[idx(c, r)] = y;
    }

    // ── per-hex hillshade (cheap aspect lighting, quantised) ────────────
    function shade(i, c, r) {
      let gx = 0, gy = 0; const e = F.elevation[i];
      for (const [nc, nr] of neighbours(c, r, cols, rows)) {
        const ni = idx(nc, nr);
        const dx = cx[ni] - cx[i], dy = cy[ni] - cy[i];
        const len = Math.hypot(dx, dy) || 1;
        const de = F.elevation[ni] - e;        // uphill if >0
        gx += (dx / len) * de; gy += (dy / len) * de;
      }
      const mag = Math.hypot(gx, gy);
      if (mag < 1e-4) return 0;
      // light from upper-left (screen up = -y)
      const dot = (gx / mag) * (-0.7) + (gy / mag) * (-0.7);
      return Math.max(-1, Math.min(1, -dot * Math.min(1, mag * 6))); // + = lit, − = shadow
    }

    // ── channel fill for a hex (shading baked in — no overlay layer) ─────
    const useRelief = (o.channel === 'relief' || o.channel === 'stack');
    const useTint  = (o.channel === 'glyph' || o.channel === 'relief');
    function baseFill(i, c, r) {
      const e = F.elevation[i], land = e > sea, b = F.biome[i];
      let col;
      if (o.channel === 'hypso' || o.channel === 'stack') {
        if (!land) { const t = Math.min(1, (sea - e) / sea); col = PAL.seaRamp[Math.min(2, Math.floor((1 - t) * 3))]; }
        else { const a = (e - sea) / (1 - sea); col = PAL.landRamp[Math.min(PAL.landRamp.length - 1, Math.floor(a * PAL.landRamp.length))]; }
      } else if (!land) {
        const t = Math.min(1, (sea - e) / sea);          // deeper sea reads darker
        col = lerpHex(PAL.sea, PAL.seaDeep, Math.min(1, t * 1.3));
      } else {
        // soft parchment + gentle biome identity
        col = useTint && BIOME_TINT[b] ? lerpHex(PAL.land, BIOME_TINT[b], 0.42) : PAL.land;
      }
      if (useRelief && land) col = shadeColor(col, shade(i, c, r) * 0.55);
      return col;
    }

    const poly = (i) => hexPolygon(cx[i], cy[i], s).map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');

    // shared-edge coastline: for a land hex, draw only the hex edges that
    // face the sea — the segments join into one continuous, smooth coast
    // (no chunky per-hex hexagon outlines).
    function coastEdges(c, r, i) {
      const verts = hexPolygon(cx[i], cy[i], s);
      let d = '';
      const dirs = [];
      for (const [nc, nr] of neighbours(c, r, cols, rows)) dirs.push([nc, nr, cx[idx(nc, nr)] - cx[i], cy[idx(nc, nr)] - cy[i], F.elevation[idx(nc, nr)] <= sea]);
      for (let j = 0; j < 6; j++) {
        const a = verts[j], bb = verts[(j + 1) % 6];
        const mx = (a[0] + bb[0]) / 2 - cx[i], my = (a[1] + bb[1]) / 2 - cy[i];
        const ml = Math.hypot(mx, my) || 1;
        // is the neighbour across this edge sea (or off-grid)?
        let best = null, bestDot = -2;
        for (const nb of dirs) { const nl = Math.hypot(nb[2], nb[3]) || 1; const dot = (mx / ml) * (nb[2] / nl) + (my / ml) * (nb[3] / nl); if (dot > bestDot) { bestDot = dot; best = nb; } }
        const seaSide = !best || bestDot < 0.5 ? true : best[4]; // off-grid edge → coast
        if (seaSide) d += `M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${bb[0].toFixed(1)} ${bb[1].toFixed(1)} `;
      }
      return d;
    }

    // ── build layered groups ────────────────────────────────────────────
    let terrain = '', coast = '', rivers = '', glyphs = '', wellMarks = '', manaWash = '';
    const useGlyphs = (o.channel === 'glyph' || o.channel === 'relief' || o.channel === 'stack');

    // pass 1 — base terrain (one polygon per hex) + coast + mana wash
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = idx(c, r);
        const e = F.elevation[i], land = e > sea, b = F.biome[i];
        const pts = poly(i);
        const mv = F.mana[i];
        terrain += `<polygon class="hx ${land ? 'land' : 'sea'}" points="${pts}" fill="${baseFill(i, c, r)}" data-q="${c}" data-r="${r}" data-biome="${world.BIOME_NAME[b]}" data-mana="${mv.toFixed(2)}"/>`;
        if (o.coast && land) {
          let edge = false;
          for (const [nc, nr] of neighbours(c, r, cols, rows)) if (F.elevation[idx(nc, nr)] <= sea) { edge = true; break; }
          if (edge) coast += coastEdges(c, r, i);
        }
        if (o.magic === 'wash' && mv > 0.12) {
          // the wind blows over sea and land alike; strength = opacity & glow
          const col = lerpHex(MANA, MANA_HI, Math.max(0, (mv - 0.5) * 2));
          manaWash += `<polygon points="${pts}" fill="${col}" fill-opacity="${(0.03 + mv * 0.42).toFixed(3)}"/>`;
        }
      }
    }

    // pass 2 — SPARSE glyphs: only FEATURE terrain gets a mark; plains,
    // grassland & tundra read by their soft tint alone (less noise, more
    // like a hand-engraved atlas). One legible mark per block by majority.
    if (useGlyphs) {
      // ONE density knob (0..100): denser → smaller blocks, lower dominance
      // threshold, and more terrain types earn a mark. (Falls back to the
      // older glyphBlock if density isn't supplied.)
      const density = (o.density != null) ? Math.max(0, Math.min(100, o.density))
                    : (6 - Math.max(1, o.glyphBlock)) / 4 * 100;
      const dN = density / 100;
      const B = Math.max(2, Math.min(6, Math.round(6 - dN * 4)));   // 100→2, 0→6
      const needFrac = 0.42 - dN * 0.26;                            // looser when denser
      const gSize = s * (1.05 + B * 0.55) * o.glyphScale;          // grows with block
      const HIGHLAND = { 5: 1, 6: 2, 7: 3 };                        // prefer tallest member
      // feature set widens as density climbs: landmarks → + hills → + dunes → + grass/tundra
      const FEATURE = { 2: 1, 4: 1, 6: 1, 7: 1 };                   // marsh, forest, mountain, peak
      if (dN >= 0.30) FEATURE[5] = 1;                               // + hill country
      if (dN >= 0.62) FEATURE[8] = 1;                               // + dunes
      if (dN >= 0.82) { FEATURE[3] = 1; FEATURE[9] = 1; }           // + grassland & tundra texture
      for (let br = 0; br < rows; br += B) {
        for (let bc = 0; bc < cols; bc += B) {
          const tally = {}; let landN = 0, oceanN = 0;
          let repI = -1, repScore = -1;
          for (let r = br; r < Math.min(rows, br + B); r++) {
            for (let c = bc; c < Math.min(cols, bc + B); c++) {
              const i = idx(c, r), b = F.biome[i];
              if (F.elevation[i] > sea) {
                landN++; if (FEATURE[b]) tally[b] = (tally[b] || 0) + 1;
              } else { oceanN++; }
            }
          }
          const hasFeature = Object.keys(tally).length > 0;
          if (landN >= Math.max(1, (B * B) * 0.34) && hasFeature) {
            // dominant FEATURE biome in the block (plains are skipped above)
            let domB = -1, domC = -1;
            for (const k in tally) if (tally[k] > domC) { domC = tally[k]; domB = +k; }
            // require the feature to genuinely DOMINATE the block, so a lone
            // peak in a plain doesn't speckle the lowland — marks cluster into
            // real ranges & woods. (peaks are rare, so allow them more easily.)
            const need = (domB === 7) ? Math.max(1, B * 0.7) : Math.max(2, (B * B) * needFrac);
            if (domC < need) {
              if (oceanN > 0 && ((bc / B + br / B) % 4 === 0)) {
                const ci2 = idx(Math.min(cols - 1, bc + (B >> 1)), Math.min(rows - 1, br + (B >> 1)));
                if (F.elevation[ci2] < sea - 0.05) glyphs += `<use href="#${o.prefix}-wave" x="${(cx[ci2] - gSize / 2).toFixed(1)}" y="${(cy[ci2] - gSize / 2).toFixed(1)}" width="${gSize.toFixed(1)}" height="${gSize.toFixed(1)}"/>`;
              }
              continue;
            }
            // representative hex: tallest if highland, else most-central of domB
            for (let r = br; r < Math.min(rows, br + B); r++) {
              for (let c = bc; c < Math.min(cols, bc + B); c++) {
                const i = idx(c, r);
                if (F.elevation[i] <= sea || F.biome[i] !== domB) continue;
                const score = (HIGHLAND[domB] ? F.elevation[i] * 10 : 5 - (Math.abs(c - bc - B / 2) + Math.abs(r - br - B / 2)));
                if (score > repScore) { repScore = score; repI = i; }
              }
            }
            const key = BIOME_GLYPH[domB];
            if (repI >= 0 && key) glyphs += `<use href="#${o.prefix}-${key}" x="${(cx[repI] - gSize / 2).toFixed(1)}" y="${(cy[repI] - gSize / 2).toFixed(1)}" width="${gSize.toFixed(1)}" height="${gSize.toFixed(1)}"/>`;
          } else if (oceanN > 0 && ((bc / B + br / B) % 4 === 0)) {
            // very sparse open-sea swell
            const ci = idx(Math.min(cols - 1, bc + (B >> 1)), Math.min(rows - 1, br + (B >> 1)));
            if (F.elevation[ci] < sea - 0.05) glyphs += `<use href="#${o.prefix}-wave" x="${(cx[ci] - gSize / 2).toFixed(1)}" y="${(cy[ci] - gSize / 2).toFixed(1)}" width="${gSize.toFixed(1)}" height="${gSize.toFixed(1)}"/>`;
          }
        }
      }
    }

    // rivers
    if (o.channel !== 'hypso' || true) {
      for (const rv of world.features.rivers) {
        const d = rv.points.map(([c, r], k) => (k ? 'L' : 'M') + cx[idx(c, r)].toFixed(1) + ' ' + cy[idx(c, r)].toFixed(1)).join(' ');
        rivers += `<path d="${d}" fill="none" stroke="${PAL.river}" stroke-width="${(s * 0.18 * rv.strength).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.85"/>`;
      }
    }

    // mana wells (the strongest pockets of the wind) — scaled by intensity
    if (o.magic !== 'off') {
      for (const n of world.meta.wells) {
        const i = idx(n.q, n.r);
        const x = cx[i], y = cy[i], rr = s * (1.05 + 0.95 * n.intensity);
        wellMarks +=
          `<g class="well" data-intensity="${n.intensity}">` +
          `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="none" stroke="${MANA}" stroke-width="${(s * 0.12).toFixed(2)}" stroke-opacity="0.42"/>` +
          `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(rr * 0.55).toFixed(1)}" fill="none" stroke="${MANA}" stroke-width="${(s * 0.12).toFixed(2)}" stroke-opacity="0.72"/>` +
          `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(s * 0.32).toFixed(1)}" fill="${MANA_HI}"/>` +
          `</g>`;
      }
    }

    const frame = `<rect x="0.5" y="0.5" width="${(W - 1).toFixed(1)}" height="${(H - 1).toFixed(1)}" fill="none" stroke="#6b5130" stroke-opacity="0.45" stroke-width="1"/>`;

    const gStroke = Math.max(1.3, s * 0.16);
    const svg =
      `<svg class="atlas-svg" viewBox="0 0 ${W.toFixed(1)} ${H.toFixed(1)}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">` +
      `<defs>${defs(o.prefix)}</defs>` +
      `<rect width="${W.toFixed(1)}" height="${H.toFixed(1)}" fill="${PAL.sea}"/>` +
      `<g id="${o.prefix}-terrain">${terrain}</g>` +
      `<g id="${o.prefix}-mana" style="mix-blend-mode:multiply">${manaWash}</g>` +
      `<g id="${o.prefix}-rivers">${rivers}</g>` +
      `<g id="${o.prefix}-coast"><path d="${coast}" fill="none" stroke="${PAL.coast}" stroke-opacity="0.5" stroke-width="${Math.max(1, s * 0.12).toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"/></g>` +
      `<g id="${o.prefix}-glyphs" fill="none" stroke="${PAL.ink}" stroke-width="${gStroke.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.85">${glyphs}</g>` +
      `<g id="${o.prefix}-wells">${wellMarks}</g>` +
      frame +
      `</svg>`;
    return { svg, width: W, height: H };
  }

  global.AtlasRender = { render, PAL, MANA, MANA_HI, lerpHex };
})(window);
