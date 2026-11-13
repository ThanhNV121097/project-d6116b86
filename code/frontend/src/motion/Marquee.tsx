import { type ReactNode } from "react";
import { movement } from "./level";

/**
 * A BAND THAT RUNS BY ITSELF — and only on a site whose owner chose
 * showpiece. Everywhere else the same things stand still in ONE row, which is
 * the house rule: nothing moves sideways on its own unless that was asked for.
 * One row, cut by the screen's edge and pulled sideways by hand — it used to
 * wrap, and seven names in a display face were seven lines and a screen and a
 * half of a phone, which is what the Studio's canvas (always still) showed.
 *
 *   <Marquee>{names.map((n) => <span key={n}>{n}</span>)}</Marquee>
 *
 * The row is drawn twice so it has no end; the second copy is hidden from a
 * screen reader. It stops under the pointer, so a link in it can be pressed.
 */
export default function Marquee({ children, className = "", seconds = 32 }: { children: ReactNode; className?: string; seconds?: number }) {
  if (movement() !== "showpiece") {
    return <div data-drag="" className={`flex items-center gap-x-14 overflow-x-auto [scrollbar-width:none] [&>*]:shrink-0 ${className}`}>{children}</div>;
  }
  const row = "flex shrink-0 items-center gap-x-14 pr-14";
  return (
    <div data-motion="marquee" className={`group flex overflow-hidden ${className}`}>
      <div className="flex min-w-max animate-[motion-marquee_linear_infinite] group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${seconds}s` }}>
        <div className={row}>{children}</div>
        <div className={row} aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
