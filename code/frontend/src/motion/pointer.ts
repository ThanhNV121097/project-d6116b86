import { atLeastLively, hasPointer, type Movement } from "./level";

/**
 * Two more things the pointer does, each found by an attribute:
 *
 *   [data-lens]  a frame whose picture is looked INTO: under the pointer it
 *                is drawn at twice its size, about the point the pointer is
 *                on. <ProductGallery> carries it, so every thing's own page
 *                has it.
 *   [data-drag]  a row that scrolls sideways and can be THROWN: dragged with
 *                the pointer, it carries on and slows. A drag is not a click,
 *                so letting go over a card does not open it.
 *
 * Both need a fine pointer and a site at least lively; a finger already
 * pinches and swipes.
 */
type Undo = () => void;

export function lenses(root: ParentNode, m: Movement): Undo {
  if (!atLeastLively(m) || !hasPointer()) return () => undefined;
  const undo: Undo[] = [];
  root.querySelectorAll<HTMLElement>("[data-lens]").forEach((frame) => {
    const subject = () => frame.querySelector<HTMLElement>("img");
    const move = (ev: PointerEvent) => {
      const img = subject();
      if (!img) return;
      const r = frame.getBoundingClientRect();
      img.style.transformOrigin = `${(((ev.clientX - r.left) / r.width) * 100).toFixed(1)}% ${(((ev.clientY - r.top) / r.height) * 100).toFixed(1)}%`;
      img.style.transform = "scale(2)";
      frame.dataset.motion = "lens";
    };
    const rest = () => {
      const img = subject();
      if (img) img.style.transform = "";
    };
    frame.style.cursor = "zoom-in";
    frame.addEventListener("pointermove", move);
    frame.addEventListener("pointerleave", rest);
    undo.push(() => { frame.removeEventListener("pointermove", move); frame.removeEventListener("pointerleave", rest); rest(); frame.style.cursor = ""; });
  });
  return () => undo.forEach((u) => u());
}

export function dragging(root: ParentNode, m: Movement): Undo {
  if (!atLeastLively(m) || !hasPointer()) return () => undefined;
  const undo: Undo[] = [];
  root.querySelectorAll<HTMLElement>("[data-drag]").forEach((row) => {
    let from = 0, start = 0, last = 0, speed = 0, held = false, moved = false, frame = 0;
    const glide = () => {
      row.scrollLeft -= speed;
      speed *= 0.94;
      frame = Math.abs(speed) > 0.4 ? requestAnimationFrame(glide) : 0;
      if (!frame) row.style.scrollSnapType = "";
    };
    const down = (ev: PointerEvent) => {
      if (ev.button !== 0) return;
      held = true; moved = false; from = ev.clientX; start = row.scrollLeft; last = ev.clientX; speed = 0;
      if (frame) cancelAnimationFrame(frame);
    };
    const move = (ev: PointerEvent) => {
      if (!held) return;
      if (Math.abs(ev.clientX - from) > 6) moved = true;
      if (!moved) return;
      row.style.scrollSnapType = "none";
      row.scrollLeft = start - (ev.clientX - from);
      speed = ev.clientX - last;
      last = ev.clientX;
      row.dataset.motion = "drag";
    };
    const up = () => {
      if (!held) return;
      held = false;
      if (moved) frame = requestAnimationFrame(glide);
    };
    // The click that ends a drag belongs to the drag.
    const click = (ev: MouseEvent) => {
      if (moved) { ev.preventDefault(); ev.stopPropagation(); moved = false; }
    };
    row.style.cursor = "grab";
    row.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    row.addEventListener("click", click, true);
    undo.push(() => {
      row.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      row.removeEventListener("click", click, true);
      if (frame) cancelAnimationFrame(frame);
      row.style.cursor = ""; row.style.scrollSnapType = "";
    });
  });
  return () => undo.forEach((u) => u());
}
