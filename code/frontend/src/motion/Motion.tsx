import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { arrivals, counting, pointing, scrollLinked, smoothScroll } from "./engine";
import { atLeastLively, EASE, hasPointer, movement } from "./level";
import { dragging, lenses } from "./pointer";

/**
 * Mount ONCE, inside the router, beside the page: <Motion />.
 *
 * It gives every page of the site the motion the owner chose (level.ts)
 * without a line in the page: sections arrive, the page hands over to the
 * next, and at showpiece the scroll is smooth, a line along the top fills as
 * the page is read and a dot follows the pointer. Then it starts the devices
 * placed by attribute (engine.ts) — again on every page, because a new page
 * is new elements.
 *
 * It writes the level on <html data-motion="…">, which the stylesheet reads
 * for hover and the walk reads to know what this site promised.
 */
export default function Motion() {
  const { pathname } = useLocation();
  const line = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const m = movement();

  // The whole site: the level, the smooth scroll, the line and the dot.
  useEffect(() => {
    document.documentElement.dataset.motion = m;
    const stopScroll = smoothScroll(m);
    if (m !== "showpiece") {
      return () => { stopScroll(); };
    }
    const fill = () => {
      const room = document.documentElement.scrollHeight - window.innerHeight;
      if (line.current) line.current.style.transform = `scaleX(${room > 0 ? Math.min(1, window.scrollY / room) : 0})`;
    };
    const follow = (ev: PointerEvent) => {
      if (dot.current) dot.current.style.transform = `translate3d(${ev.clientX}px, ${ev.clientY}px, 0)`;
    };
    fill();
    window.addEventListener("scroll", fill, { passive: true });
    window.addEventListener("pointermove", follow, { passive: true });
    return () => {
      stopScroll();
      window.removeEventListener("scroll", fill);
      window.removeEventListener("pointermove", follow);
    };
  }, [m]);

  // Each page: it arrives, and its devices start.
  useEffect(() => {
    if (m === "still") {
      return undefined;
    }
    const page = document.querySelector("main");
    if (page && atLeastLively(m)) {
      page.animate([{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "none" }],
        { duration: 360, easing: EASE, fill: "backwards" });
    }
    const undo = [arrivals(document, m), scrollLinked(document, m), counting(document, m), pointing(document, m),
      lenses(document, m), dragging(document, m)];
    return () => { undo.forEach((u) => u()); };
  }, [pathname, m]);

  if (m !== "showpiece") return null;
  return (
    <>
      <div ref={line} data-motion="progress" aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 origin-left scale-x-0 bg-accent" />
      {hasPointer() && (
        <div ref={dot} data-motion="cursor" aria-hidden="true"
          className="pointer-events-none fixed left-0 top-0 z-50 -ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-accent mix-blend-difference" />
      )}
    </>
  );
}
