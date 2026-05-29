/* ═══════════════════════════════════════════════════════════════════════
   CODEX TERRA — shared content types
   The eight domains (books), the Arcana magic system, and the generic deep
   "dossier" entry shape that future books (Gentes, Ordines, …) will reuse.
   ═══════════════════════════════════════════════════════════════════════ */

/** The eight books of the world — drives theming via [data-domain]. */
export type DomainId =
  | "arcana"
  | "terrae"
  | "gentes"
  | "ordines"
  | "annales"
  | "divinitas"
  | "bestiarum"
  | "personae";

export type BookStatus = "live" | "soon";

/** A book in the hub index. */
export interface Book {
  id: DomainId;
  roman: string; // "I"…"VIII"
  latin: string; // "Arcana"
  en: string; // "the workings of magic"
  blurb: string;
  status: BookStatus;
  href: string; // internal path (run through withBase at render)
  footStatus: string; // small status line in the card foot
  /** raw inner SVG markup for the crest (paths drawn in the accent colour) */
  crest: string;
}

/* ── Arcana (Liber I) ──────────────────────────────────────────────────── */

export type TriadId = "materia" | "potentia" | "vocatio" | "mentis";

export type SchoolId =
  | "enchantment"
  | "transmutation"
  | "animation"
  | "evocation"
  | "abjuration"
  | "kinesis"
  | "conjuration"
  | "summoning"
  | "pacting"
  | "telepathy"
  | "illusion"
  | "delirium";

export interface Triad {
  id: TriadId;
  roman: "I" | "II" | "III" | "IV";
  name: string; // "Materia"
  en: string; // "the magic of matter"
  blurb: string;
  schools: string[]; // English display names of the 3 member schools
  color: string; // reserved for future per-triad theming
}

export interface School {
  id: SchoolId;
  name: string;
  triad: TriadId;
  role: string; // italic subtitle
  desc: string; // definition paragraph
  flavour: string; // master's quote (includes attribution)
}

/** A partial map school→weight, summed across answered quiz questions. */
export type WeightMap = Partial<Record<SchoolId, number>>;

export interface QuizQuestion {
  q: string;
  answers: { t: string; w: WeightMap }[];
}

/* ── Generic deep entry (future deep-dossier books) ────────────────────── */

export interface CodexEntry {
  slug: string;
  domain: DomainId;
  title: string;
  epithet?: string; // italic subtitle
  kicker?: string; // small label / index
  crest?: string; // sigil/heraldry SVG markup or component id
  fields: { k: string; v: string }[]; // the dossier grid
  sections: { heading: string; body: string }[]; // long-form lore
  relations: { kind: string; targetSlug: string; label: string }[];
  gallery?: { src: string; caption?: string }[];
}
