import type { School } from "./types";

/**
 * The twelve schools of magic, in canonical order (grouped by triad).
 * Copy is final — ported verbatim from the prototype. Sigil SVGs live in the
 * Sigil.astro registry (keyed by SchoolId), not here.
 */
export const SCHOOLS: School[] = [
  {
    id: "enchantment",
    name: "Enchantment",
    triad: "materia",
    role: "the gilding of virtue into matter",
    desc: "Imbues an object with a hidden virtue — strength, swiftness, luminance, ill-fortune — without changing its form. A blade may be sharp by craft, but enchanted, it remembers to remain sharp.",
    flavour:
      "“To enchant is to teach a thing its truest name, and ask it to live up to that name forever after.” — Vellis the Patient",
  },
  {
    id: "transmutation",
    name: "Transmutation",
    triad: "materia",
    role: "the rewriting of substance and form",
    desc: "Alters what a thing fundamentally is — lead to silver, flesh to bark, river to road. Where enchantment whispers to the object, transmutation overwrites its first letter.",
    flavour:
      "“Every substance is a sentence the world is reading aloud. The transmuter merely clears its throat.” — Brenwa of the Ash Forge",
  },
  {
    id: "animation",
    name: "Animation",
    triad: "materia",
    role: "the gift of motion to the still",
    desc: "Grants autonomous action to objects that were never alive — a broom that sweeps without hand, a watchman of bronze, a letter that delivers itself. The animator borrows no soul; she leaves a small intention behind.",
    flavour:
      "“Where breath was never granted, the Animator gives stride. The stride does not ask why.” — from the Lexicon of Murn",
  },
  {
    id: "evocation",
    name: "Evocation",
    triad: "potentia",
    role: "the calling-forth of elemental force",
    desc: "Summons the great elements — flame, wind, frost, thunder — out of the air itself. The most dramatic of the schools, and the easiest to misjudge. Evokers do not bargain with fire; they introduce it.",
    flavour:
      "“Storm, ember, and tide answer the evoker's cry — though seldom in the measure she asked for.” — Marshal Cyrra, On the Burning of Hesh",
  },
  {
    id: "abjuration",
    name: "Abjuration",
    triad: "potentia",
    role: "the discipline of the ward and the mend",
    desc: "Protects and restores. The abjurer raises wards against the storm, dispels what ought not to be there, and stitches what has been torn — flesh, oath, or stone alike. The quietest school, and the one most worth keeping near.",
    flavour:
      "“The unseen vault, the silent ward, the wound made wholesome — these are the abjurer's three gifts, and she gives them without applause.” — Sister Olne of the Closing Hand",
  },
  {
    id: "kinesis",
    name: "Kinesis",
    triad: "potentia",
    role: "the laying-on of will at any distance",
    desc: "Moves objects directly by act of will, with neither hand nor tool. A subtle school in skilled use — turning a key, deflecting an arrow, holding a falling friend aloft — and a brutal one when made loud.",
    flavour:
      "“Distance is a courtesy, not a law. The kinesist excuses herself from it.” — Verick of Anval",
  },
  {
    id: "conjuration",
    name: "Conjuration",
    triad: "vocatio",
    role: "the weaving of substance from possibility",
    desc: "Pulls into being objects and creatures of pure magical fabric — a sword that fades by dawn, a steed of light, a roof against rain. What the conjurer makes is never permanent, but for the hour it lasts, it is wholly real.",
    flavour:
      "“From the loom of possibility, the conjurer pulls thread. From the thread she makes whatever the morning requires.” — Eldred of the Eight Looms",
  },
  {
    id: "summoning",
    name: "Summoning",
    triad: "vocatio",
    role: "the calling of distant existing beings",
    desc: "Calls beings already-existing across great distance — beasts of the deeper wood, spirits of named place, persons answering a written sigil. Summoning does not create. It pulls a thread, and waits to see who walks down it.",
    flavour:
      "“Names spoken correctly will travel any distance. The trouble is that what hears them is not always what we named.” — Quill of Ravensreach",
  },
  {
    id: "pacting",
    name: "Pacting",
    triad: "vocatio",
    role: "the binding of being by named contract",
    desc: "Forges binding agreements between beings — between mortal and mortal, mortal and elder spirit, even spirit and spirit. The terms are absolute. The breach is always known. Pacters are rarely loved, but they are very often kept on retainer.",
    flavour:
      "“Every signature is a small surrender. The pacter merely keeps a tidy ledger of which surrender is owed to whom.” — Master Halv, Court of the Long Table",
  },
  {
    id: "telepathy",
    name: "Telepathy",
    triad: "mentis",
    role: "the reading and projecting of thought",
    desc: "Touches mind to mind. Reads surface thoughts, projects images, carries whole conversations across rooms or kingdoms in perfect silence. Skilled telepaths can sense the shape of a lie before its speaker has finished telling it.",
    flavour:
      "“Two minds touch, and a third is born between them — brief, blameless, and not entirely either's.” — Annis of the Twin Tower",
  },
  {
    id: "illusion",
    name: "Illusion",
    triad: "mentis",
    role: "the fabrication of false perception",
    desc: "Builds what is not there — sights, sounds, scents, the feel of warm hands. An illusion convinces the senses, but not the world: it leaves no footprints, no warmth, no body when the dawn comes.",
    flavour:
      "“Truth is a single line. Falsehood, an entire garden. Illusionists are merely careful gardeners.” — Caspian of the Painted Wood",
  },
  {
    id: "delirium",
    name: "Delirium",
    triad: "mentis",
    role: "the fracturing of reason and reality",
    desc: "The forbidden school — though never quite forbidden enough. Delirium loosens the threads holding sense together: time stutters, geometry slips, the floor remembers being a sea. Mastery is rare, because the school does not always know which mind it is supposed to be teaching.",
    flavour:
      "“Reason is a rope. The deliriarch teaches it to fray — and watches, with great interest, what the rope does next.” — anonymous, fragments recovered from the Cell at Vorre",
  },
];

/** Lookup by id. */
export const SCHOOL_BY_ID: Record<string, School> = Object.fromEntries(
  SCHOOLS.map((s) => [s.id, s]),
);
