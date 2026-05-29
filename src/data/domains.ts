import type { Book } from "./types";

/**
 * The eight books of Codex Terra — the hub index, and the single source for
 * each domain's roman/latin/en names, blurb, crest, and live/soon status.
 * Crest `stroke` colours match each domain's --accent-bright (see codex.css).
 * Ported verbatim from the prototype hub.
 */
export const DOMAINS: Book[] = [
  {
    id: "arcana",
    roman: "Liber I",
    latin: "Arcana",
    en: "the workings of magic",
    blurb:
      "The twelve schools and four triads — and the rite that names the school in which your own aptitude lies.",
    status: "live",
    href: "/arcana",
    footStatus: "✦ Complete",
    crest: `<polygon points="32,7 55,20 55,44 32,57 9,44 9,20"/><polygon points="32,17 46,25 46,39 32,47 18,39 18,25" opacity=".55"/><circle cx="32" cy="32" r="4.5" fill="#b89ad6"/>`,
  },
  {
    id: "terrae",
    roman: "Liber II",
    latin: "Terrae",
    en: "realms & geography",
    blurb:
      "The lands of the world — its realms, cities, and wilds — drawn by a living map that the cartographer's engine conjures anew.",
    status: "soon",
    href: "#books",
    footStatus: "Next ✦ map engine",
    crest: `<path d="M9,40 Q21,28 32,40 T55,40"/><path d="M9,48 Q21,36 32,48 T55,48"/><circle cx="32" cy="18" r="7"/><path d="M32,11 L32,4 M32,25 L32,30" opacity=".6"/>`,
  },
  {
    id: "gentes",
    roman: "Liber III",
    latin: "Gentes",
    en: "the peoples",
    blurb:
      "The races and cultures of Terra — their homelands, their tongues, their customs, and their long quarrels.",
    status: "soon",
    href: "#books",
    footStatus: "Planned",
    crest: `<circle cx="32" cy="24" r="11"/><path d="M16,54 Q32,37 48,54"/>`,
  },
  {
    id: "ordines",
    roman: "Liber IV",
    latin: "Ordines",
    en: "factions & houses",
    blurb:
      "The orders, houses, and powers that contend for the world — their banners, allegiances, and feuds.",
    status: "soon",
    href: "#books",
    footStatus: "Planned",
    crest: `<path d="M32,7 L53,16 L53,37 Q53,51 32,58 Q11,51 11,37 L11,16 Z"/><path d="M23,30 L41,30 M32,21 L32,43"/>`,
  },
  {
    id: "annales",
    roman: "Liber V",
    latin: "Annales",
    en: "history & the ages",
    blurb:
      "The chronicle of Terra from the first dawn — its epochs, its catastrophes, and the turning of its ages.",
    status: "soon",
    href: "#books",
    footStatus: "Planned",
    crest: `<circle cx="32" cy="32" r="23"/><path d="M32,12 L32,32 L47,41"/><circle cx="32" cy="32" r="2.5" fill="#d4bc72"/>`,
  },
  {
    id: "divinitas",
    roman: "Liber VI",
    latin: "Divinitas",
    en: "the pantheon",
    blurb:
      "The gods and faiths of the world — the powers above and below, their rites, their bargains, their silences.",
    status: "soon",
    href: "#books",
    footStatus: "Planned",
    crest: `<circle cx="32" cy="32" r="11"/><path d="M32,5 L32,16 M32,48 L32,59 M5,32 L16,32 M48,32 L59,32 M14,14 L21,21 M43,43 L50,50 M14,50 L21,43 M43,21 L50,14"/><circle cx="32" cy="32" r="2.5" fill="#9bbdcf"/>`,
  },
  {
    id: "bestiarum",
    roman: "Liber VII",
    latin: "Bestiarum",
    en: "beasts & monsters",
    blurb:
      "The bestiary of Terra, fair and foul — the creatures of wood and deep, and the horrors best left unnamed.",
    status: "soon",
    href: "#books",
    footStatus: "Planned",
    crest: `<path d="M14,42 Q14,20 32,20 Q50,20 50,42"/><circle cx="25" cy="35" r="2.6" fill="#a3b04e"/><circle cx="39" cy="35" r="2.6" fill="#a3b04e"/><path d="M22,48 L42,48 M16,24 L10,18 M48,24 L54,18"/>`,
  },
  {
    id: "personae",
    roman: "Liber VIII",
    latin: "Personae",
    en: "notable figures",
    blurb:
      "The persons who shaped the age — kings and traitors, archmages and fools, kept in full dossier.",
    status: "soon",
    href: "#books",
    footStatus: "Planned",
    crest: `<circle cx="32" cy="23" r="11"/><path d="M15,53 Q32,36 49,53"/><path d="M24,11 L32,4 L40,11"/>`,
  },
];

/** Crest stroke colours — each domain's accent-bright. */
export const CREST_STROKE: Record<string, string> = {
  arcana: "#b89ad6",
  terrae: "#6cb6a4",
  gentes: "#e0a85f",
  ordines: "#d46a5a",
  annales: "#d4bc72",
  divinitas: "#9bbdcf",
  bestiarum: "#a3b04e",
  personae: "#969ed0",
};
