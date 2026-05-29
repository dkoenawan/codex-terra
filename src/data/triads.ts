import type { Triad, TriadId } from "./types";

/** Display/iteration order of the four triads. */
export const TRIAD_ORDER: TriadId[] = ["materia", "potentia", "vocatio", "mentis"];

/** The four sacred triads. Copy is final — ported verbatim from the prototype. */
export const TRIADS: Record<TriadId, Triad> = {
  materia: {
    id: "materia",
    roman: "I",
    name: "Materia",
    en: "the magic of matter",
    blurb:
      "Substance, form, and animate motion. The Materian shapes what already is — bending the qualities, the silhouette, or the very stride of the world's stuff.",
    schools: ["Enchantment", "Transmutation", "Animation"],
    color: "#a07840",
  },
  potentia: {
    id: "potentia",
    roman: "II",
    name: "Potentia",
    en: "the magic of raw power",
    blurb:
      "Force given, force withheld, force redirected. Where Materia reshapes, Potentia exerts — calling out the elements, raising the ward, or laying hands at a distance.",
    schools: ["Evocation", "Abjuration", "Kinesis"],
    color: "#8a4a3a",
  },
  vocatio: {
    id: "vocatio",
    roman: "III",
    name: "Vocatio",
    en: "the magic of calling & binding",
    blurb:
      "To name a thing is to summon it; to summon it is to be answered. Vocatians draw from the loom of possibility, the far country, and the language of binding contracts.",
    schools: ["Conjuration", "Summoning", "Pacting"],
    color: "#5a4a7a",
  },
  mentis: {
    id: "mentis",
    roman: "IV",
    name: "Mentis",
    en: "the magic of the mind",
    blurb:
      "Thought, perception, and the slipping veil between them. The Mentian works upon awareness itself — touching it, fooling it, or unraveling its quiet seams.",
    schools: ["Telepathy", "Illusion", "Delirium"],
    color: "#3e5a6e",
  },
};
