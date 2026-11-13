import { useEffect, useRef, useState, type ReactNode } from "react";
import { hasPointer, movement } from "./level";

/**
 * A SECTION THAT HOLDS WHILE ITS CONTENT PASSES — showpiece, and only at a
 * width and with a pointer that can carry it. The page stops; the row inside
 * travels sideways as the reader scrolls; when the last of it has passed, the
 * page moves on.
 *
 *   <Pin heading={<h2>…</h2>}>{cards}</Pin>
 *
 * EVERYWHERE ELSE IT IS AN ORDINARY ROW that scrolls sideways under the
 * finger, with nothing held: on a calm or lively site, on a phone, for a
 * visitor who asked for less motion, in the Studio's canvas. So the content
 * is always all there and always reachable.
 *
 * THE HELD SCREEN IS FILLED, AND THE STAGE DOES THAT ITSELF. The first real
 * run to use this gave it five cards 320px wide: the row was 480px tall on a
 * 790px screen with a sixth of the screen empty above and below it, and it
 * had 256px to travel — the page paused for a quarter of a second over a
 * strip. A held section is the one large moment a showpiece page has, and
 * "make your cards big enough" is a sentence in a brief. So the row is
 * ENLARGED to the height the stage has free (never reduced, and by no more
 * than half again, so a picture is not drawn far past its file), which also
 * gives it further to travel. The cards keep their own proportions: the
 * author sizes them as for any row.
 *
 * AND A ROW WITH NOWHERE TO GO IS NOT HELD. Enlarged and still narrower than
 * the stage, it is the ordinary row: a page that stops for nothing reads as a
 * page that has stuck.
 *
 * One a page, at most. The height it adds is exactly what the row has to
 * travel, measured.
 */
const GROW = 1.5;
/** Less than this to travel and the page would stop for nothing. */
const WORTH = 160;

export default function Pin({ heading, children, className = "" }: { heading?: ReactNode; children: ReactNode; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);
  const [flat, setFlat] = useState(false);
  const able = movement() === "showpiece" && hasPointer() && typeof window !== "undefined" && window.innerWidth >= 1024;
  const held = able && !flat;

  useEffect(() => {
    if (!held) {
      return undefined;
    }
    let far = 0;
    const measure = () => {
      const s = stage.current;
      const r = row.current;
      const t = track.current;
      if (!s || !r || !t) return;
      // Measured at its own size first: what `zoom` does to offsetHeight has
      // differed between browsers, and a rect of an unzoomed box has not.
      r.style.zoom = "1";
      const own = r.getBoundingClientRect();
      const css = getComputedStyle(s);
      const free = s.clientHeight - parseFloat(css.paddingTop) - parseFloat(css.paddingBottom) - (head.current?.getBoundingClientRect().height ?? 0);
      const grow = own.height > 0 ? Math.min(GROW, Math.max(1, free / own.height)) : 1;
      r.style.zoom = String(grow);
      far = Math.max(0, t.getBoundingClientRect().width - (s.clientWidth - parseFloat(css.paddingLeft) - parseFloat(css.paddingRight)));
      if (far < WORTH) {
        setFlat(true);
        return;
      }
      setTravel(far);
      draw();
    };
    let frame = 0;
    const draw = () => {
      frame = 0;
      const box = outer.current;
      if (!box || !track.current) return;
      const room = box.offsetHeight - window.innerHeight;
      const done = room > 0 ? Math.min(1, Math.max(0, -box.getBoundingClientRect().top / room)) : 0;
      track.current.style.transform = `translate3d(${(-done * far).toFixed(1)}px, 0, 0)`;
    };
    const ask = () => { if (!frame) frame = requestAnimationFrame(draw); };
    measure();
    // A card's height is often its picture's: measured again once they are in.
    const sized = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => measure());
    if (sized && row.current) sized.observe(row.current);
    window.addEventListener("scroll", ask, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      sized?.disconnect();
      window.removeEventListener("scroll", ask);
      window.removeEventListener("resize", measure);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [held]);

  if (!held) {
    return (
      <div className={className}>
        {heading}
        <div data-drag="" className="flex snap-x gap-[var(--space-6)] overflow-x-auto pb-2 [scrollbar-width:none] [&>*]:shrink-0 [&>*]:snap-start">{children}</div>
      </div>
    );
  }
  return (
    <div ref={outer} data-motion="pin" className={className} style={{ height: `calc(100vh + ${travel}px)` }}>
      <div ref={stage} className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden py-[5vh]">
        <div ref={head}>{heading}</div>
        <div ref={track} className="w-max will-change-transform">
          <div ref={row} className="flex w-max gap-[var(--space-6)] [&>*]:shrink-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
