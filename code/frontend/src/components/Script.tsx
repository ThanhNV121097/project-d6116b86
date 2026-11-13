import { T } from "../editable";

/**
 * THE HANDWRITTEN WORDS: three or four of them in the script, in the accent,
 * tilted a little and laid ACROSS THE END OF A HEADING so they overlap it.
 * Give it to a heading as its last child; it places itself.
 *
 * IT BRINGS ITS OWN SPACE, AND THE SPACE DOES NOT BREAK. Laid straight after
 * the heading's words, the two were one word to anything that reads text —
 * "Your bagnearly yours!" to a screen reader, a search engine and the walk,
 * seven times on the first site built in this look. And when the heading was
 * short the script wrapped to a line of its own, where the shift that lays it
 * over the heading's end pushed it out past the page's left edge instead. A
 * no-break space answers both: the words are two, and the script stays on the
 * line of the word it overlaps. `alone` is for the script standing by itself
 * (over the hero, in the footer), where there is no heading to stay with.
 *
 * A mark, not a face — it never carries a sentence, and a heading with no
 * words for it draws none.
 */
export default function Script({ k, className = "", alone = false, onPhoto = false }: { k: string; className?: string; alone?: boolean; onPhoto?: boolean }) {
  // On white the script is the olive-lime that reads at 3:1; on a photograph
  // it is the bright lime on its own deep-green shadow.
  const ink = onPhoto
    ? "text-accent [text-shadow:0_0_1px_var(--script-shadow),0_0_1px_var(--script-shadow),0_0_3px_var(--script-shadow),0_0_10px_var(--script-shadow),0_0_26px_var(--script-shadow),0_2px_3px_var(--script-shadow)]"
    : "text-[var(--script-ink)]";
  return (
    <>
      {alone ? null : "\u00A0"}
      <T k={k} as="span"
        className={`pointer-events-none inline-block -translate-x-[0.6em] translate-y-[0.35em] -rotate-6 whitespace-nowrap font-[family-name:var(--font-accent)] text-[0.82em] font-medium normal-case leading-none tracking-normal ${ink} ${className}`} />
    </>
  );
}
