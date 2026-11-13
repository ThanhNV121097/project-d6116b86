import { movement } from "./level";

/**
 * A PICTURE THAT MOVES: a short, silent, looping film behind a hero or in a
 * band, with the photograph it starts from.
 *
 *   <HeroVideo src="/videos/workshop.mp4" poster="/images/workshop.jpg" className="absolute inset-0 h-full w-full object-cover" />
 *
 * ONLY WITH A FILM THE OWNER SUPPLIED. There is no library of films here and
 * a stock clip of somebody else's workshop is a claim about this business.
 * The poster is the same frame as a photograph and is ALL that a calm site,
 * a visitor who asked for less motion, or a slow connection is shown — so it
 * has to be good enough to be the hero by itself. Under 8 MB, no sound, and
 * nothing the page needs is said only in it.
 */
export default function HeroVideo({ src, poster, className = "" }: { src: string; poster: string; className?: string }) {
  const m = movement();
  if (m === "still" || m === "calm" || !src) {
    return <img src={poster} alt="" decoding="async" className={className} />;
  }
  return (
    <video data-motion="video" className={className} src={src} poster={poster}
      autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
  );
}
