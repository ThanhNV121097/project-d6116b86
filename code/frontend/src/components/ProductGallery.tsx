import { useState } from "react";
import ProductImage, { type Aspect } from "./ProductImage";

/**
 * More than one picture of one thing: the large one, and the others under it
 * to switch to.
 *
 * A record's own page that shows a single photograph has shown the listing
 * again, larger. Somebody deciding about a shirt, a room or a dish wants the
 * back of it, the detail, the thing in use — and on a real run the product
 * page was one picture, a price and a button, 341px of a 790px screen
 * (the walk's `thin-page`).
 *
 *   <ProductGallery images={[shirt.image, ...shirt.gallery]} alt={shirt.name} />
 *
 * One picture is drawn as one picture, with no empty strip of thumbnails
 * under it: the part never invents a second photograph the record does not
 * have.
 */
export default function ProductGallery({ images, alt, aspect = "4/5", className = "" }: {
  images: readonly (string | null | undefined)[];
  alt: string;
  aspect?: Aspect;
  className?: string;
}) {
  const shown = images.filter((s): s is string => Boolean(s));
  const [at, setAt] = useState(0);
  const current = shown[Math.min(at, Math.max(0, shown.length - 1))];
  return (
    <div data-block="gallery" className={`flex flex-col gap-3 ${className}`}>
      {/* Looked INTO under the pointer, at twice its size (src/motion). */}
      <div data-lens="">
        <ProductImage src={current} alt={alt} aspect={aspect} eager />
      </div>
      {shown.length > 1 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="More pictures">
          {shown.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setAt(i)}
              aria-label={`Picture ${i + 1} of ${shown.length}`}
              aria-pressed={i === at}
              className={`w-16 overflow-hidden rounded-sm border sm:w-20 ${i === at ? "border-ink" : "border-line opacity-70 hover:opacity-100"}`}
            >
              <ProductImage src={src} alt="" aspect="1/1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
