import site from "../site.json";

/**
 * HOW MUCH THIS SITE MOVES — the owner chose it on the form, and it is
 * written into src/site.json when the project starts:
 *
 *   calm       a short load moment, sections that fade and rise as they come
 *              into view, a hover that answers. Nothing else.
 *   lively     that, and: children arriving one after another, headings whose
 *              words rise, pictures that drift a little as the page scrolls,
 *              figures that count up, buttons and cards that follow the
 *              pointer, a page that hands over to the next.
 *   showpiece  that, and: the wheel taken into a smooth scroll, pictures that
 *              move further and grow as they pass, a band of words that runs
 *              by itself, rows that slide sideways with the scroll, a line
 *              along the top that fills as the page is read, a dot that
 *              follows the pointer.
 *
 * "still" is none of them and nobody chooses it: a visitor who asked their
 * device for less motion, or the Studio's canvas, which shows the page whole
 * and held. Then nothing moves and NOTHING IS HIDDEN WAITING TO MOVE — every
 * device here starts from the finished page and animates towards it, so a
 * page with this file's script never run is a complete page.
 */
export type MotionLevel = "calm" | "lively" | "showpiece";
export type Movement = MotionLevel | "still";

const LEVELS: readonly string[] = ["calm", "lively", "showpiece"];

/** The level the owner chose. A site.json from before the choice existed is calm. */
export function chosenLevel(): MotionLevel {
  const asked = (site as { motion?: string }).motion ?? "";
  return LEVELS.includes(asked) ? (asked as MotionLevel) : "calm";
}

/** What this visitor gets, now: the owner's level, or still. */
export function movement(): Movement {
  if (typeof window === "undefined") return "still";
  const less = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = new URLSearchParams(window.location.search).has("canvas");
  return less || canvas ? "still" : chosenLevel();
}

/** Lively or more: the devices that need a pointer or a scroll to mean anything. */
export function atLeastLively(m: Movement): boolean {
  return m === "lively" || m === "showpiece";
}

/** A device that follows the pointer needs one. */
export function hasPointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export const EASE = "cubic-bezier(0.2, 0.7, 0.2, 1)";
