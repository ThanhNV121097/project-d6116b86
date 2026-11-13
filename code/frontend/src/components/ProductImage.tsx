import type * as React from "react";
import { Picture } from "../picture";

/** The frame's shape. One per grid: every card in a row has the same one. */
export type Aspect = "1/1" | "4/5" | "4/3";

// The size a picture is declared at, so the browser holds its place before it
// loads. The tools save product pictures as transparent squares; the frame,
// not the file, decides the shape.
const INTRINSIC: Record<Aspect, [number, number]> = {
  "1/1": [800, 800],
  "4/5": [800, 1000],
  "4/3": [800, 600],
};

/**
 * Every product picture on the site: <ProductImage src={p.image} alt={p.name} />.
 *
 * A fixed frame (aspect "1/1" by default, or "4/5", "4/3") on a light tile
 * (var(--product-ground) in theme.css, light in dark mode too — a white or
 * silver product cut out onto a dark ground loses its shading), the product
 * shown whole with `object-contain` and an 8% margin all round. A phone and a
 * laptop in one grid keep the same margin, so no subject looks bigger than
 * the next.
 * Never `object-cover` on a product: it crops the thing being sold (the
 * scaffold's lint refuses it in card, product and shop files).
 *
 * TWO KINDS OF FILE, AND THE EXTENSION SAYS WHICH. The tools save a product
 * one of two ways and each is drawn its own way:
 *   - `.png` — CUT OUT: a solid thing with its background taken away. Drawn
 *     with the margin above, on the tile's colour.
 *   - `.jpg` — KEPT WHOLE: its maker's photograph on white, for a thing that
 *     is OPEN (a bicycle's wheels, a chair's slats, a bag's handle) and so
 *     cannot be cut without leaving white inside it. It fills the tile and is
 *     MULTIPLIED onto `--product-photo-ground`: white times a colour is that
 *     colour, so the photograph's white becomes the tile, the gaps in the
 *     thing included, and its own soft shadow stays. That ground has to be
 *     LIGHT — multiplied onto a strong colour a white thing vanishes — which
 *     is why it is a token of its own and not whatever is behind the card.
 * Never choose between them here, and never rename a file to move it across:
 * the tool that saved it measured which it is.
 *
 * With no `src` the frame shows the flat <Picture> block with the caption;
 * give `slot` (`/images/products/<id>.png`) and the owner can drop the photo
 * on it in the Studio. `eager` only for a picture in view on load.
 */
export default function ProductImage({ src, alt, aspect = "1/1", slot, caption, eager = false, className = "", hover }: {
  src?: string | null;
  /** The thing's SECOND picture — its back, a detail — shown in place of the
   *  first while the pointer is on its card, on a site at least lively. Only
   *  a picture of the same kind as the first (cut out with cut out, whole
   *  with whole): two treatments swapping under the pointer is a flicker. */
  hover?: string | null;
  alt: string;
  aspect?: Aspect;
  slot?: string;
  caption?: string;
  eager?: boolean;
  className?: string;
}) {
  const [width, height] = INTRINSIC[aspect];
  // Kept whole on white (a .jpg) rather than cut out (a .png): see above.
  const whole = /\.jpe?g(?:$|[?#])/i.test(src ?? "");
  return (
    <div data-product-image="" data-product-whole={whole || undefined} style={{
      aspectRatio: aspect.replace("/", " / "),
      background: whole ? "var(--product-photo-ground)" : "var(--product-ground)",
      // The tile is light in both modes, so a <Picture> block inside it is
      // drawn on the tile rather than on the site's surface. Without this a
      // product with no photograph yet was a dark hole in a lit grid.
      ["--picture-ground" as string]: "var(--product-ground)",
      ["--picture-ink" as string]: "var(--product-ground-ink)",
    } as React.CSSProperties}
      className={`relative w-full overflow-hidden rounded ${className}`}>
      {src && whole ? (
        <Picture src={src} alt={alt} caption={caption} width={width} height={height} fit="contain"
          loading={eager ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-contain mix-blend-multiply" />
      ) : src ? (
        <Picture src={src} alt={alt} caption={caption} width={width} height={height} fit="contain"
          loading={eager ? "eager" : "lazy"}
          className="absolute inset-[8%] h-[84%] w-[84%] object-contain" />
      ) : (
        <Picture src={slot ?? ""} alt={alt} caption={caption} fit="contain"
          className="absolute inset-0 h-full w-full" />
      )}
      {src && hover && hover !== src && (
        <img data-product-hover="" src={hover} alt="" loading="lazy" decoding="async"
          className={whole ? "absolute inset-0 h-full w-full object-contain mix-blend-multiply" : "absolute inset-[8%] h-[84%] w-[84%] object-contain"} />
      )}
    </div>
  );
}
