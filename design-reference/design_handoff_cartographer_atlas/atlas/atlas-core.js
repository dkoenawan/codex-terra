/* ═══════════════════════════════════════════════════════════════════════
   THE CARTOGRAPHER'S ENGINE — core (design prototype of /engine)
   ─────────────────────────────────────────────────────────────────────
   A faithful JS stand-in for the Python pipeline described in Liber II.
   Physics is computed first; a single mana field (the Winds of Magic) is
   laid over it as its own layer — no affinities, just stronger & weaker
   pockets. Emits a world-state object shaped like the §IV contract.

   This is design scaffolding so the atlas renders against a REAL world,
   not a mock. Claude Code will re-implement the same chain in numpy.
   ═══════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  // ── seeded PRNG + value-noise (fBm) ──────────────────────────────────
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function makeNoise(seed) {
    // hash-based value noise on an integer lattice, smooth-interpolated
    const rnd = mulberry32(seed);
    const perm = new Float32Array(512);
    for (let i = 0; i < 512; i++) perm[i] = rnd();
    const hash = (x, y) => {
      const xi = ((x % 256) + 256) % 256;
      const yi = ((y % 256) + 256) % 256;
      return perm[(xi + perm[yi]) & 511];
    };
    const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a, b, t) => a + (b - a) * t;
    return function value(x, y) {
      const x0 = Math.floor(x), y0 = Math.floor(y);
      const fx = fade(x - x0), fy = fade(y - y0);
      const v00 = hash(x0, y0), v10 = hash(x0 + 1, y0);
      const v01 = hash(x0, y0 + 1), v11 = hash(x0 + 1, y0 + 1);
      return lerp(lerp(v00, v10, fx), lerp(v01, v11, fx), fy); // [0,1]
    };
  }
  function fbmFactory(noise) {
    return function fbm(x, y, oct = 5, lac = 2.0, gain = 0.5) {
      let amp = 0.5, freq = 1, sum = 0, norm = 0;
      for (let i = 0; i < oct; i++) {
        sum += amp * noise(x * freq, y * freq);
        norm += amp; amp *= gain; freq *= lac;
      }
      return sum / norm; // [0,1]
    };
  }

  // ── hex geometry: flat-top, odd-q offset ─────────────────────────────
  // (the hexagon is the bestagon — §V)
  const SQRT3 = Math.sqrt(3);
  function hexCenter(col, row, s, pad) {
    const x = pad + s + s * 1.5 * col;
    const y = pad + s * SQRT3 * (row + 0.5 * (col & 1)) + s * SQRT3 / 2;
    return [x, y];
  }
  function hexPolygon(cx, cy, s) {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI / 180) * (60 * i);
      pts.push([cx + s * Math.cos(a), cy + s * Math.sin(a)]);
    }
    return pts;
  }
  function mapPixelSize(cols, rows, s, pad) {
    const w = pad * 2 + s + s * 1.5 * (cols - 1) + s; // last col right point
    const h = pad * 2 + s * SQRT3 * (rows + 0.5);
    return [w, h];
  }
  // odd-q neighbour tables (redblobgames)
  const ODDQ = [
    [[+1, 0], [+1, -1], [0, -1], [-1, -1], [-1, 0], [0, +1]], // even col
    [[+1, +1], [+1, 0], [0, -1], [-1, 0], [-1, +1], [0, +1]], // odd col
  ];
  function neighbours(col, row, cols, rows) {
    const out = [];
    const dirs = ODDQ[col & 1];
    for (const [dc, dr] of dirs) {
      const c = col + dc, r = row + dr;
      if (c >= 0 && c < cols && r >= 0 && r < rows) out.push([c, r]);
    }
    return out;
  }

  // ── biome enum ───────────────────────────────────────────────────────
  const BIOME = {
    OCEAN: 0, COAST: 1, MARSH: 2, PASTURE: 3, FOREST: 4,
    HILLS: 5, MOUNTAIN: 6, PEAK: 7, DESERT: 8, TUNDRA: 9,
  };
  const BIOME_NAME = Object.fromEntries(Object.entries(BIOME).map(([k, v]) => [v, k.toLowerCase()]));

  // ── the pipeline ─────────────────────────────────────────────────────
  function generate(opts) {
    const cfg = Object.assign({ seed: 73, cols: 96, rows: 60, seaLevel: 0.36 }, opts || {});
    const { cols, rows, seed } = cfg;
    const N = cols * rows;
    const idx = (c, r) => r * cols + c;

    const nElev = fbmFactory(makeNoise(seed));
    const nWarp = fbmFactory(makeNoise(seed * 7 + 3));
    const nStone = fbmFactory(makeNoise(seed * 13 + 101));
    const nMoist = fbmFactory(makeNoise(seed * 17 + 57));
    const nFault = fbmFactory(makeNoise(seed * 23 + 211));

    const gauss = (nx, ny, cx, cy, rx, ry) => {
      const dx = (nx - cx) / rx, dy = (ny - cy) / ry;
      return Math.exp(-(dx * dx + dy * dy));
    };

    // FIELD 1 — elevation (continent shape: one landmass + an island) ----
    const elevRaw = new Float32Array(N);
    let eMin = Infinity, eMax = -Infinity;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const nx = c / cols;
        const ny = (r + 0.5 * (c & 1)) / rows;
        const wx = nx + 0.16 * (nWarp(nx * 2.4 + 11, ny * 2.4 + 7) - 0.5) + 0.07 * (nWarp(nx * 5 + 2, ny * 5 + 8) - 0.5);
        const wy = ny + 0.16 * (nWarp(nx * 2.4 + 5, ny * 2.4 + 19) - 0.5) + 0.07 * (nWarp(nx * 5 + 9, ny * 5 + 3) - 0.5);
        const n = nElev(wx * 2.2, wy * 2.2, 4);
        const main = gauss(nx, ny, 0.42, 0.46, 0.34, 0.40);
        const isle = gauss(nx, ny, 0.83, 0.74, 0.10, 0.085) * 0.9;
        const land = Math.max(main, isle);
        const e = n * 0.55 + land * 0.82 - 0.28;
        elevRaw[idx(c, r)] = e;
        if (e < eMin) eMin = e; if (e > eMax) eMax = e;
      }
    }
    const elevation = new Float32Array(N);
    for (let i = 0; i < N; i++) elevation[i] = (elevRaw[i] - eMin) / (eMax - eMin);
    // smoothing pass: de-speckle so highlands form contiguous RANGES rather
    // than salt-and-pepper peaks. Two light iterations of neighbour averaging.
    for (let pass = 0; pass < 2; pass++) {
      const next = new Float32Array(N);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const i = idx(c, r); let sum = elevation[i] * 1.4, wt = 1.4;
        for (const [nc, nr] of neighbours(c, r, cols, rows)) { sum += elevation[idx(nc, nr)]; wt += 1; }
        next[i] = sum / wt;
      }
      elevation.set(next);
    }
    const sea = cfg.seaLevel;
    const isLand = (i) => elevation[i] > sea;

    // coast proximity (cheap BFS-ish: distance in hexes to nearest sea) ---
    const coastDist = new Float32Array(N).fill(99);
    // seed sea hexes adjacent to land as distance 0 on the land side
    const queue = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = idx(c, r);
      if (!isLand(i)) continue;
      let touchesSea = false;
      for (const [nc, nr] of neighbours(c, r, cols, rows)) if (!isLand(idx(nc, nr))) { touchesSea = true; break; }
      if (touchesSea) { coastDist[i] = 0; queue.push([c, r]); }
    }
    for (let h = 0; h < queue.length; h++) {
      const [c, r] = queue[h]; const d = coastDist[idx(c, r)];
      for (const [nc, nr] of neighbours(c, r, cols, rows)) {
        const ni = idx(nc, nr);
        if (isLand(ni) && coastDist[ni] > d + 1) { coastDist[ni] = d + 1; queue.push([nc, nr]); }
      }
    }

    // FIELD 2 — temperature (latitude band − lapse rate) -----------------
    // FIELD 3 — moisture (noise + coastal boost − rain shadow) -----------
    const temperature = new Float32Array(N);
    const moisture = new Float32Array(N);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = idx(c, r);
        const ny = (r + 0.5 * (c & 1)) / rows;
        let t = 1 - Math.abs(ny - 0.60) * 1.55;          // warm band toward south
        t -= 0.55 * Math.max(0, elevation[i] - sea);     // lapse rate
        t += 0.06 * (nStone(c * 0.05, r * 0.05) - 0.5);
        temperature[i] = Math.max(0, Math.min(1, t));
        const cb = isLand(i) ? Math.max(0, 1 - coastDist[i] / 10) : 1;
        let m = nMoist(c * 0.06 + 4, r * 0.06 + 9, 4) * 0.62 + cb * 0.34 - elevation[i] * 0.18;
        moisture[i] = Math.max(0, Math.min(1, m));
      }
    }

    // local slope / gradient (for relief shading + the wind's ruffle) ----
    const slope = new Float32Array(N);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = idx(c, r); let mx = 0;
      for (const [nc, nr] of neighbours(c, r, cols, rows)) mx = Math.max(mx, Math.abs(elevation[i] - elevation[idx(nc, nr)]));
      slope[i] = mx;
    }

    // FIELD 4 — biome classification -------------------------------------
    // Highland thresholds are PERCENTILE-based on land elevation, so the
    // hypsometry is realistic (mostly lowland; mountains a concentrated
    // minority that clusters into ranges) regardless of the noise seed.
    const landElevs = [];
    for (let i = 0; i < N; i++) if (isLand(i)) landElevs.push(elevation[i]);
    landElevs.sort((a, b) => a - b);
    const pct = (p) => landElevs.length ? landElevs[Math.min(landElevs.length - 1, Math.floor(p * landElevs.length))] : 1;
    const T_PEAK = pct(0.94);   // top 6%  → peaks
    const T_MTN  = pct(0.83);   // next 11% → mountains
    const T_HILL = pct(0.64);   // next 19% → hills   (≈64% lowland)
    const biome = new Uint8Array(N);
    for (let i = 0; i < N; i++) {
      if (!isLand(i)) { biome[i] = BIOME.OCEAN; continue; }
      const e = elevation[i], t = temperature[i], m = moisture[i];
      if (e > T_PEAK) { biome[i] = BIOME.PEAK; continue; }
      if (e > T_MTN)  { biome[i] = BIOME.MOUNTAIN; continue; }
      if (e > T_HILL) { biome[i] = BIOME.HILLS; continue; }
      if (t < 0.22) { biome[i] = BIOME.TUNDRA; continue; }
      if (m < 0.26 && t > 0.45) { biome[i] = BIOME.DESERT; continue; }
      if (m > 0.66 && coastDist[i] <= 2) { biome[i] = BIOME.MARSH; continue; }
      if (m > 0.52) { biome[i] = BIOME.FOREST; continue; }
      biome[i] = BIOME.PASTURE;
    }

    // ── THE WINDS OF MAGIC — one mana field, no affinities (§II, revised) ─
    // There is no "type" of magic in a place. Mana is a single fuel that
    // blows across the world and pools unevenly: broad drifting pockets of
    // strong and weak wind, punctuated by a few concentrated WELLS. The field
    // has its OWN noise — the land only lightly stirs it (rugged, high-energy
    // ground ruffles the wind a touch; deep open ocean a touch less). The
    // terrain does not pick a flavour; it just makes the wind gust or lull.
    const mana = new Float32Array(N);
    const nWind = fbmFactory(makeNoise(seed * 29 + 13));
    // a handful of seeded wells — concentrated founts the wind gathers around
    const wellRnd = mulberry32(seed * 41 + 19);
    const WELLS = [];
    const N_WELLS = 5;
    for (let k = 0; k < N_WELLS; k++) {
      WELLS.push({ x: 0.10 + 0.80 * wellRnd(), y: 0.10 + 0.80 * wellRnd(), rad: 0.055 + 0.065 * wellRnd(), str: 0.55 + 0.45 * wellRnd() });
    }
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const i = idx(c, r);
      const nx = c / cols, ny = (r + 0.5 * (c & 1)) / rows;
      // broad wind: low-frequency fBm → big soft pockets of high & low mana
      let w = nWind(nx * 2.1 + 3, ny * 2.1 + 6, 3) * 0.66
            + nWind(nx * 4.4 + 9, ny * 4.4 + 1, 2) * 0.22;
      // wells: concentrated gaussian founts riding on top of the wind
      for (const wl of WELLS) w += wl.str * gauss(nx, ny, wl.x, wl.y, wl.rad, wl.rad);
      // the land only ruffles the wind — a gust over rugged ground, a lull
      // over the deep — never a flavour. (kept small on purpose.)
      w += 0.10 * Math.min(1, slope[i] * 6) + (isLand(i) ? 0.03 : -0.05);
      mana[i] = w;
    }
    // normalise across the WHOLE world → [0,1] (the wind blows over sea too)
    (function normMana() {
      let mn = Infinity, mx = -Infinity;
      for (let i = 0; i < N; i++) { if (mana[i] < mn) mn = mana[i]; if (mana[i] > mx) mx = mana[i]; }
      const d = mx - mn || 1;
      for (let i = 0; i < N; i++) mana[i] = (mana[i] - mn) / d;
    })();

    // ── FEATURES: rivers (downhill trace) ───────────────────────────────
    const rivers = [];
    const srcRnd = mulberry32(seed * 31 + 7);
    const candidates = [];
    for (let i = 0; i < N; i++) if (isLand(i) && elevation[i] > 0.66 && moisture[i] > 0.5) candidates.push(i);
    candidates.sort((a, b) => elevation[b] - elevation[a]);
    const used = new Set();
    let made = 0;
    for (const start of candidates) {
      if (made >= 9) break;
      if (srcRnd() > 0.5) continue;
      let c = start % cols, r = Math.floor(start / cols);
      const pts = [[c, r]]; let guard = 0; let ok = true;
      while (guard++ < 120) {
        const i = idx(c, r);
        if (!isLand(i)) break;             // reached the sea
        let best = null, bestE = elevation[i];
        for (const [nc, nr] of neighbours(c, r, cols, rows)) {
          const e = elevation[idx(nc, nr)];
          if (e < bestE) { bestE = e; best = [nc, nr]; }
        }
        if (!best) break;                  // local minimum (lake)
        c = best[0]; r = best[1]; pts.push([c, r]);
        if (used.has(idx(c, r))) { ok = pts.length > 6; break; }
      }
      if (ok && pts.length >= 5) { rivers.push({ points: pts, strength: 1 + Math.floor(pts.length / 14) }); pts.forEach(([pc, pr]) => used.add(idx(pc, pr))); made++; }
    }

    // ── FEATURES: the wells — where the wind gathers strongest (§VI) ─────
    // The strongest pockets of the mana field, spaced apart. No type — just
    // the deepest founts, ranked by how hard the wind blows there.
    const manaOrder = [];
    for (let i = 0; i < N; i++) manaOrder.push(i);
    manaOrder.sort((a, b) => mana[b] - mana[a]);
    const wells = [];
    for (const i of manaOrder) {
      const c = i % cols, r = Math.floor(i / cols);
      if (wells.every((n) => Math.abs(n.q - c) + Math.abs(n.r - r) > 12)) {
        wells.push({ q: c, r, intensity: +mana[i].toFixed(2) });
      }
      if (wells.length >= 3) break;
    }

    return {
      meta: { seed, version: '0.2.0-design', grid: { cols, rows, orientation: 'flat-top', offset: 'odd-q' }, sea_level: sea, wells },
      fields: { elevation, temperature, moisture, slope, biome, coastDist, mana },
      features: { rivers, exceptions: [] },
      BIOME, BIOME_NAME, idx, isLand,
    };
  }

  global.AtlasCore = { generate, hexCenter, hexPolygon, mapPixelSize, neighbours, BIOME, BIOME_NAME };
})(window);
