import { createElement, Fragment, useEffect, useRef, type ElementType } from "react";
import { useContent } from "../editable";
import { atLeastLively, EASE, movement } from "./level";

/**
 * A HEADING WHOSE WORDS RISE, one after another, the first time it is seen:
 * <SplitHeading k="hero.headline" as="h1" className="…" />.
 *
 * The words are the content key's own, so the owner still edits the line in
 * the Studio (the element carries data-edit); each word is only a window its
 * letters rise into. When the site is calm or still it is a plain heading.
 * One a page, on the line that matters: a page where every heading performs
 * has no heading that does.
 */
export default function SplitHeading({ k, as = "h2", className = "" }: { k: string; as?: ElementType; className?: string }) {
  const text = String(useContent(k) ?? "");
  const box = useRef<HTMLElement>(null);
  const lively = atLeastLively(movement());
  useEffect(() => {
    const el = box.current;
    if (!el || !lively) {
      return undefined;
    }
    const seen = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      seen.disconnect();
      el.dataset.motion = "split";
      el.querySelectorAll<HTMLElement>("[data-word]").forEach((w, i) =>
        w.animate([{ transform: "translateY(105%)" }, { transform: "none" }], { duration: 760, delay: i * 55, easing: EASE, fill: "backwards" }));
    }, { threshold: 0.4 });
    seen.observe(el);
    return () => { seen.disconnect(); };
  }, [lively, text]);
  if (!lively) return createElement(as, { className, "data-edit": k }, text);
  // THE SAME WHITE SPACE IN BOTH RENDERINGS. Each word used to carry a space
  // after it, the last one included, and the plain heading above carries none
  // — so `<SplitHeading as="span" /><em>…</em>` read "for the climb" while it
  // moved and "for theclimb" when still, and still is what the Studio's canvas
  // draws: the owner saw a typo the author's own browser never showed. The
  // spaces now sit BETWEEN the words, and a space the content itself begins or
  // ends with is kept, exactly as the plain heading keeps it.
  const words = text.split(/\s+/).filter(Boolean);
  return createElement(as, { ref: box, className, "data-edit": k, "aria-label": text },
    /^\s/.test(text) ? " " : null,
    words.map((word, i) => (
      <Fragment key={`${word}-${i}`}>
        {i > 0 ? " " : null}
        <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <span data-word="" className="inline-block">{word}</span>
        </span>
      </Fragment>
    )),
    /\s$/.test(text) && words.length > 0 ? " " : null);
}
