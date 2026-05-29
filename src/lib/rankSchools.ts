import type { SchoolId, WeightMap } from "../data/types";
import { SCHOOLS } from "../data/schools";

/**
 * Sum the weight maps recorded across answered quiz questions and return the
 * school ids ranked high→low. Index [0] is the primary affinity, [1] the
 * second affinity. Ported from the prototype's renderResult tally.
 */
export function rankSchools(answers: WeightMap[]): SchoolId[] {
  const totals = Object.fromEntries(SCHOOLS.map((s) => [s.id, 0])) as Record<SchoolId, number>;
  for (const w of answers) {
    for (const k in w) {
      const id = k as SchoolId;
      totals[id] += w[id] ?? 0;
    }
  }
  return (Object.entries(totals) as [SchoolId, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);
}

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

/** 1 → "I", 12 → "XII"; falls back to the decimal string past XII. */
export function romanize(n: number): string {
  return ROMAN[n] ?? String(n);
}
