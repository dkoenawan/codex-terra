declare const AtlasCore: {
  generate: (opts: { seed: number; cols?: number; rows?: number }) => unknown;
};
declare const AtlasRender: {
  render: (world: unknown, opts: Record<string, unknown>) => { svg: string };
};

export function mountAtlasMap() {
  const tip = document.getElementById("atlas-tip");
  const tipBiome = document.getElementById("atlas-tip-biome");
  const tipCoords = document.getElementById("atlas-tip-coords");
  const tipMana = document.getElementById("atlas-tip-mana");

  const BIOME_LABEL: Record<string, string> = {
    ocean: "Open Ocean", coast: "Coastline", marsh: "Fen & Marsh",
    pasture: "Pasture", forest: "Woodland", hills: "Hill Country",
    mountain: "Mountains", peak: "High Peaks", desert: "Desert", tundra: "Tundra",
  };

  function attachHover(svg: SVGSVGElement | null) {
    if (!svg || !tip || !tipBiome || !tipCoords || !tipMana) return;
    svg.addEventListener("mousemove", (e) => {
      const el = (e.target as Element).closest("[data-biome]") as HTMLElement | null;
      if (!el) { tip.classList.remove("visible"); return; }
      tipBiome.textContent = BIOME_LABEL[el.dataset.biome!] ?? el.dataset.biome!;
      tipCoords.textContent = `q ${el.dataset.q}  r ${el.dataset.r}`;
      tipMana.textContent = `mana  ${(+(el.dataset.mana ?? 0) * 100).toFixed(0)}%`;
      tip.classList.add("visible");
      tip.style.left = (e.clientX + 16) + "px";
      tip.style.top = (e.clientY - 10) + "px";
    });
    svg.addEventListener("mouseleave", () => tip?.classList.remove("visible"));
  }

  const CH_LABEL: Record<string, string> = { glyph: "glyphs", relief: "relief + glyphs", hypso: "hypsometric", stack: "full stack" };
  const MG_LABEL: Record<string, string> = { nodes: "wells", wash: "winds", off: "hidden" };

  let world: unknown = null;
  let currentSeed = 73;

  function generate(seed: number) {
    currentSeed = seed;
    const label = document.getElementById("atlas-seed-label");
    if (label) label.textContent = "Terra · seed " + seed;
    world = AtlasCore.generate({ seed, cols: 96, rows: 60 });
  }

  function renderMap() {
    if (!world) return;
    const channel = (document.getElementById("ctl-channel") as HTMLSelectElement).value;
    const magic = (document.getElementById("ctl-magic") as HTMLSelectElement).value;
    const density = +(document.getElementById("ctl-density") as HTMLInputElement).value;
    const coast = (document.getElementById("ctl-coast") as HTMLInputElement).checked;
    const { svg } = AtlasRender.render(world, { channel, magic, density, coast, hexSize: 9, pad: 8, prefix: "am" });
    const plate = document.getElementById("atlas-plate");
    if (plate) plate.innerHTML = svg;
    const cur = document.getElementById("atlas-cur");
    if (cur) cur.textContent = "channel: " + CH_LABEL[channel] + " · magic: " + MG_LABEL[magic];
    attachHover(plate?.querySelector("svg") ?? null);
  }

  document.getElementById("btn-roll")?.addEventListener("click", () => {
    const seed = Math.floor(Math.random() * 999999) + 1;
    (document.getElementById("ctl-seed") as HTMLInputElement).value = String(seed);
    generate(seed);
    renderMap();
  });

  document.getElementById("btn-generate")?.addEventListener("click", () => {
    const seed = parseInt((document.getElementById("ctl-seed") as HTMLInputElement).value, 10) || 73;
    generate(seed);
    renderMap();
  });

  ["ctl-channel", "ctl-magic", "ctl-coast"].forEach((id) => {
    document.getElementById(id)?.addEventListener("change", renderMap);
  });

  const densityInput = document.getElementById("ctl-density") as HTMLInputElement;
  const densityVal = document.getElementById("ctl-density-val");
  densityInput?.addEventListener("input", () => {
    if (densityVal) densityVal.textContent = densityInput.value;
    renderMap();
  });

  generate(73);
  renderMap();
}
