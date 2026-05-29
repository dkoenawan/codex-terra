import type { QuizQuestion } from "./types";

/**
 * The Sorting Rite — six questions, four answers each, every answer carrying a
 * weight map toward one or more schools. Weights are tuned to reach all twelve
 * schools without ties on common paths. Copy & weights ported verbatim.
 */
export const QUIZ: QuizQuestion[] = [
  {
    q: "A leather-bound tome on your desk has caught fire. Your hand moves without thinking — to do what?",
    answers: [
      { t: "Snuff the flames from the air itself.", w: { evocation: 2, abjuration: 1 } },
      {
        t: "Lift the book, untouched, into the basin across the room.",
        w: { kinesis: 2, animation: 1 },
      },
      { t: "Make the parchment refuse to burn.", w: { enchantment: 2, transmutation: 1 } },
      { t: "Look again, and see that no fire was ever there.", w: { illusion: 2, delirium: 1 } },
    ],
  },
  {
    q: "You find yourself before a forgotten temple in a forest of black pine. What pulls at you first?",
    answers: [
      {
        t: "The unfamiliar grain of the stone — what was it, before?",
        w: { transmutation: 2, enchantment: 1 },
      },
      {
        t: "The faded carvings of creatures whose names I half-remember.",
        w: { summoning: 2, conjuration: 1 },
      },
      { t: "The ward-script worked into the threshold — still warm.", w: { abjuration: 2, pacting: 1 } },
      {
        t: "The whispers from the dark interior, which only I appear to hear.",
        w: { telepathy: 1, delirium: 2 },
      },
    ],
  },
  {
    q: "An opponent stands across the dueling-circle. Your first move is —",
    answers: [
      { t: "An overwhelming exertion — let the elements settle the matter.", w: { evocation: 2, kinesis: 1 } },
      {
        t: "Reshape the ground beneath them. Win the terrain, win the fight.",
        w: { transmutation: 2, animation: 1 },
      },
      {
        t: "Make them doubt where I am standing. Or whether I am there at all.",
        w: { illusion: 2, delirium: 1 },
      },
      { t: "Lean on a debt owed me by something older than either of us.", w: { pacting: 2, summoning: 1 } },
    ],
  },
  {
    q: "Of all that magic can do, the most beautiful thing is —",
    answers: [
      {
        t: "The way it transfigures a humble thing into a wondrous one.",
        w: { transmutation: 1, enchantment: 2 },
      },
      { t: "The way it draws forth what was never present before.", w: { conjuration: 2, summoning: 1 } },
      {
        t: "The way one mind may quietly touch another, and both be changed.",
        w: { telepathy: 2, illusion: 1 },
      },
      { t: "The way it bends what the world insisted was fixed.", w: { kinesis: 1, delirium: 1, evocation: 1 } },
    ],
  },
  {
    q: "Were a stranger to walk uninvited into your study, what would they find?",
    answers: [
      {
        t: "Half-finished bronze figures, gears in jars, a kettle that pours itself.",
        w: { animation: 2, enchantment: 1 },
      },
      {
        t: "Glass vessels of dim liquids; chalked diagrams over half-finished work.",
        w: { transmutation: 2, conjuration: 1 },
      },
      {
        t: "Bound ledgers of names, signed contracts in red wax, a single open ring.",
        w: { pacting: 2, summoning: 1 },
      },
      {
        t: "Mirrors at unhelpful angles. Masks, hung in a row. A door I refuse to discuss.",
        w: { illusion: 1, delirium: 2 },
      },
    ],
  },
  {
    q: "Magic, properly used, is best put toward —",
    answers: [
      { t: "Shielding those who cannot shield themselves.", w: { abjuration: 2, enchantment: 1 } },
      { t: "Drawing out the truth of things hidden.", w: { telepathy: 2, summoning: 1 } },
      { t: "Bringing into being what the world is missing.", w: { conjuration: 2, animation: 1 } },
      { t: "Moving past the limits the world is fond of imposing.", w: { kinesis: 2, evocation: 1 } },
    ],
  },
];
