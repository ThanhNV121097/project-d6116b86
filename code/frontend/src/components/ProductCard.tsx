import { Link } from "react-router-dom";
import Icon from "./Icon";
import ProductImage from "./ProductImage";
import { addToCart } from "../lib/cart";
import { formatPrice } from "../lib/format";
import type { Product } from "../lib/shop";

/**
 * A FLAVOUR, AS THIS LOOK SHOWS ONE: the thing standing cut out ON SKY — a
 * tall rounded tile, blue at its head and pale at its foot — with a small
 * lime chip at its top right carrying one word and a mark; and under the
 * tile the name in the heavy capitals, the price, and a round lime button
 * that puts one in the bag. Three to a row.
 *
 * The chip's word is the record's one fact ("Lime · mint", "330 ml"): one or
 * two words. A record with no fact has no chip.
 */
export default function ProductCard({ product, floating = false }: {
  product: Product;
  /** The small white card floated over the hero's corner. */
  floating?: boolean;
}) {
  const add = () => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
  return (
    <article data-record={`products:${product.id}`}
      className={`flex h-full flex-col overflow-hidden rounded bg-ground ${floating ? "p-1.5 shadow-[var(--shadow-md)]" : "border border-line"}`}>
      <Link to={`/shop/${product.id}`} data-testid={`${floating ? "float" : "card"}-${product.id}`}
        className={`relative block bg-[linear-gradient(180deg,var(--sky-top),var(--sky-foot))] [--product-ground:transparent] ${floating ? "rounded-[var(--radius-sm)]" : ""}`}>
        <ProductImage src={product.image} hover={product.image_back} alt={product.name} aspect={floating ? "1/1" : "4/5"} eager={floating} className="rounded-none" />
        {!floating && product.fact && (
          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-wide text-accent-ink">
            <Icon name="fast" size={12} />{product.fact}
          </span>
        )}
      </Link>
      <div className={`flex items-center justify-between gap-3 ${floating ? "px-2.5 py-2.5" : "p-4"}`}>
        <Link to={`/shop/${product.id}`} className="min-w-0">
          <span className={`block truncate font-display uppercase leading-tight text-ink ${floating ? "text-lg" : "text-xl"}`}>{product.name}</span>
          <span className="mt-0.5 block text-sm tabular-nums text-ink-soft">{formatPrice(product.price)}</span>
        </Link>
        <button type="button" aria-label={`Add ${product.name} to the bag`} data-testid={`add-${product.id}`} onClick={add}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-accent-ink hover:opacity-90">
          <Icon name="bag" size={17} />
        </button>
      </div>
    </article>
  );
}
