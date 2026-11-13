import { atLeastLively, EASE, hasPointer, type Movement } from "./level";

/**
 * The devices that need no component: they find their elements on the page.
 *
 *   every <section> under <main>   arrives as it comes into view
 *   [data-parallax]                drifts against the scroll
 *   [data-zoom]                    grows as it passes          (showpiece)
 *   [data-drift]                   slides sideways with scroll (showpiece)
 *   [data-count]                   its number counts up
 *   [data-magnetic]                leans towards the pointer
 *   [data-tilt]                    tilts under the pointer
 *
 * So a page gets its floor of motion by being written as sections, and a
 * designer places the rest with one attribute. Each element that moved is
 * marked data-motion="<kind>": that is what the walk counts.
 *
 * Every function returns what undoes it. They are started again on each page.
 */
type Undo = () => void;

function mark(el: Element, kind: string) {
  (el as HTMLElement).dataset.motion = kind;
}

/** Sections arrive: together when calm, their children one after another when lively. */
export function arrivals(root: ParentNode, m: Movement): Undo {
  const rise = [{ opacity: 0, transform: "translateY(18px)" }, { opacity: 1, transform: "none" }];
  const seen = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      seen.unobserve(e.target);
      const parts = atLeastLively(m) && e.target.children.length > 1 && e.target.children.length <= 10
        ? Array.from(e.target.children) : [e.target];
      parts.forEach((p, i) => p.animate(rise, { duration: 620, delay: i * 70, easing: EASE, fill: "backwards" }));
      mark(e.target, "reveal");
    }
  }, { threshold: 0.08 });
  // A page written as sections arrives section by section. One written as
  // plain blocks — a list beside a rail, a form beside a summary — arrives
  // block by block: the children of the page's own root.
  let parts = Array.from(root.querySelectorAll("main section, main [data-reveal]"));
  if (parts.length === 0) parts = Array.from(root.querySelectorAll("main > * > *")).slice(0, 12);
  parts.forEach((el) => seen.observe(el));
  return () => seen.disconnect();
}

/** How far through the viewport an element is: -1 below it, 0 centred, 1 above. */
function passage(el: Element): number {
  const r = el.getBoundingClientRect();
  const mid = r.top + r.height / 2;
  return Math.max(-1, Math.min(1, (window.innerHeight / 2 - mid) / (window.innerHeight / 2 + r.height / 2)));
}

/** Pictures drift, grow and slide with the scroll. One frame's work for all of them. */
export function scrollLinked(root: ParentNode, m: Movement): Undo {
  if (!atLeastLively(m)) return () => undefined;
  const far = m === "showpiece";
  const drifting = Array.from(root.querySelectorAll<HTMLElement>("[data-parallax]"));
  const growing = far ? Array.from(root.querySelectorAll<HTMLElement>("[data-zoom]")) : [];
  const sliding = far ? Array.from(root.querySelectorAll<HTMLElement>("[data-drift]")) : [];
  if (drifting.length + growing.length + sliding.length === 0) return () => undefined;
  drifting.forEach((el) => mark(el, "parallax"));
  growing.forEach((el) => mark(el, "zoom"));
  sliding.forEach((el) => mark(el, "drift"));
  let frame = 0;
  const draw = () => {
    frame = 0;
    // A drifting picture is drawn a little large, so its edge never shows.
    const reach = far ? 7 : 4;
    drifting.forEach((el) => { el.style.transform = `translate3d(0, ${(-passage(el) * reach).toFixed(2)}%, 0) scale(${far ? 1.16 : 1.1})`; });
    growing.forEach((el) => { el.style.transform = `scale(${(1.04 + (passage(el) + 1) * 0.05).toFixed(3)})`; });
    sliding.forEach((el) => { el.style.transform = `translate3d(${(-passage(el) * 6).toFixed(2)}%, 0, 0)`; });
  };
  const ask = () => { if (!frame) frame = requestAnimationFrame(draw); };
  draw();
  window.addEventListener("scroll", ask, { passive: true });
  window.addEventListener("resize", ask);
  return () => {
    window.removeEventListener("scroll", ask);
    window.removeEventListener("resize", ask);
    if (frame) cancelAnimationFrame(frame);
    [...drifting, ...growing, ...sliding].forEach((el) => { el.style.transform = ""; });
  };
}

/** A number counts up to itself the first time it is seen. Its own text is put back at the end. */
export function counting(root: ParentNode, m: Movement): Undo {
  if (!atLeastLively(m)) return () => undefined;
  const seen = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      seen.unobserve(e.target);
      const el = e.target as HTMLElement;
      const full = el.textContent ?? "";
      const found = /\d[\d.,\s]*/.exec(full);
      const to = found ? Number(found[0].replace(/\D/g, "")) : NaN;
      if (!found || !Number.isFinite(to) || to === 0) continue;
      mark(el, "count");
      const started = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - started) / 900);
        const at = Math.round(to * (1 - Math.pow(1 - t, 3)));
        el.textContent = t < 1 ? full.replace(found[0], String(at)) : full;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }, { threshold: 0.6 });
  root.querySelectorAll("[data-count]").forEach((el) => seen.observe(el));
  return () => seen.disconnect();
}

/** Buttons lean towards the pointer and cards tilt under it, where there is a pointer. */
export function pointing(root: ParentNode, m: Movement): Undo {
  if (!atLeastLively(m) || !hasPointer()) return () => undefined;
  const undo: Undo[] = [];
  const follow = (el: HTMLElement, kind: string, draw: (dx: number, dy: number) => string) => {
    mark(el, kind);
    el.style.transition = `transform 0.35s ${EASE}`;
    const move = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.transform = draw((ev.clientX - r.left) / r.width - 0.5, (ev.clientY - r.top) / r.height - 0.5);
    };
    const rest = () => { el.style.transform = ""; };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", rest);
    undo.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", rest); rest(); el.style.transition = ""; });
  };
  root.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) =>
    follow(el, "magnetic", (dx, dy) => `translate3d(${(dx * 14).toFixed(1)}px, ${(dy * 10).toFixed(1)}px, 0)`));
  root.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) =>
    follow(el, "tilt", (dx, dy) => `perspective(900px) rotateX(${(-dy * 5).toFixed(2)}deg) rotateY(${(dx * 6).toFixed(2)}deg)`));
  return () => undo.forEach((u) => u());
}

/** The wheel, taken into a smooth scroll. Showpiece, and only with a fine pointer. */
export function smoothScroll(m: Movement): Undo {
  if (m !== "showpiece" || !hasPointer()) return () => undefined;
  let stop: Undo = () => undefined;
  let gone = false;
  void import("lenis").then(({ default: Lenis }) => {
    if (gone) return;
    const lenis = new Lenis({ duration: 1.05 });
    let frame = requestAnimationFrame(function loop(now: number) {
      lenis.raf(now);
      frame = requestAnimationFrame(loop);
    });
    document.documentElement.dataset.motionScroll = "smooth";
    stop = () => { cancelAnimationFrame(frame); lenis.destroy(); delete document.documentElement.dataset.motionScroll; };
  });
  return () => { gone = true; stop(); };
}
