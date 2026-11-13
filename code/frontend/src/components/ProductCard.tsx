import { Link } from "react-router-dom";
import Icon from "./Icon";
import ProductImage from "./ProductImage";
import { addToCart } from "../lib/cart";
import { formatPrice } from "../lib/format";
import { sameKind, type Product } from "../lib/shop";

/**
 * A BOTTLE, AS THIS LOOK SHOWS ONE: the bottle standing on ONE flat pale-sky
 * tile (the same tile for a cut-out and for a glass bottle kept whole), its
 * lead fruit on a small lime chip at the tile's top right; under it the name
 * in the heavy capitals, the size and what is in it, the price, and a round
 * lime button that puts one in the bag.
 *
 * `floating` is the small white card laid over the hero's lower corners.
 */
export default function ProductCard({ product, floating = false }: {
  product: Product;
  floating?: boolean;
}) {
  const add = () => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
  const hover = sameKind(product.image, product.image_back) ? product.image_back : undefined;
  const inside = [product.volume, (product.ingredients ?? []).join(", ")].filter(Boolean).join(" · ");
  return (
    <article data-record={`products:${product.id}`}
      className={`flex h-full flex-col overflow-hidden rounded bg-ground ${floating ? "p-1.5 shadow-[var(--shadow-md)]" : "border border-line"}`}>
      <Link to={`/shop/${product.id}`} data-testid={`${floating ? "float" : "card"}-${product.id}`} className="relative block">
        <ProductImage src={product.image} hover={hover} alt={product.name} aspect="1/1" eager={floating}
          className={floating ? "rounded-[var(--radius-sm)]" : "rounded-none"} />
        {!floating && product.fact && (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-wide text-accent-ink">
            <Icon name="fresh" size={12} />{product.fact}
          </span>
        )}
      </Link>
      <div className={`flex flex-1 items-center justify-between gap-3 ${floating ? "px-2.5 py-2.5" : "p-4"}`}>
        <Link to={`/shop/${product.id}`} className="min-w-0">
          <span className={`block font-display uppercase leading-tight text-ink ${floating ? "truncate text-lg" : "line-clamp-2 text-xl"}`}>{product.name}</span>
          {!floating && inside && <span className="mt-1 block truncate text-xs text-ink-soft">{inside}</span>}
          <span className="mt-1 block text-sm tabular-nums text-ink">{formatPrice(product.price)}</span>
        </Link>
        <button type="button" aria-label={`Add ${product.name} to the bag`} data-testid={`add-${product.id}`} onClick={add}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-accent-ink hover:opacity-90">
          <Icon name="bag" size={17} />
        </button>
      </div>
    </article>
  );
}
