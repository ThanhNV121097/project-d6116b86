import { useEffect, useRef } from "react";
import { hasPointer, movement } from "./level";

/**
 * PICTURES THE SCROLL PLAYS: the frame holds, and as the reader scrolls one
 * picture gives way to the next — a thing seen from the front, then the
 * side, then close; a place in the morning, then at night.
 *
 *   <Sequence images={["/images/a.jpg", "/images/b.jpg", "/images/c.jpg"]} alt="…" />
 *
 * Three to eight pictures of ONE subject, shot alike: unrelated pictures
 * dissolving into each other is a slideshow nobody asked for. Showpiece, at a
 * width and with a pointer that can carry it; everywhere else the first
 * picture stands alone, which is why the first is the one that matters.
 */
export default function Sequence({ images, alt, className = "" }: { images: readonly string[]; alt: string; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const shown = images.filter(Boolean);
  const played = shown.length > 1 && movement() === "showpiece" && hasPointer() && typeof window !== "undefined" && window.innerWidth >= 1024;

  useEffect(() => {
    const box = outer.current;
    if (!played || !box) {
      return undefined;
    }
    const frames = Array.from(box.querySelectorAll<HTMLElement>("[data-frame]"));
    let frame = 0;
    const draw = () => {
      frame = 0;
      const room = box.offsetHeight - window.innerHeight;
      const done = room > 0 ? Math.min(1, Math.max(0, -box.getBoundingClientRect().top / room)) : 0;
      const at = done * (frames.length - 1);
      frames.forEach((f, i) => { f.style.opacity = String(Math.max(0, Math.min(1, 1 - Math.abs(at - i)))); });
    };
    const ask = () => { if (!frame) frame = requestAnimationFrame(draw); };
    draw();
    window.addEventListener("scroll", ask, { passive: true });
    return () => {
      window.removeEventListener("scroll", ask);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [played, shown.length]);

  if (shown.length === 0) return null;
  if (!played) {
    return <img src={shown[0]} alt={alt} loading="lazy" decoding="async" className={`h-auto w-full ${className}`} />;
  }
  return (
    <div ref={outer} data-motion="sequence" style={{ height: `${100 + shown.length * 60}vh` }}>
      <div className={`sticky top-0 h-screen overflow-hidden ${className}`}>
        {shown.map((src, i) => (
          <img key={src} data-frame="" src={src} alt={i === 0 ? alt : ""} decoding="async"
            className="absolute inset-0 h-full w-full object-contain" style={{ opacity: i === 0 ? 1 : 0 }} />
        ))}
      </div>
    </div>
  );
}
