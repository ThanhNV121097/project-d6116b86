import { Link } from "react-router-dom";
import { T, useContent } from "../editable";
import { usePageMeta } from "../seo";
import { lineKey, removeFromCart, setQuantity, useCart } from "../lib/cart";
import { formatPrice } from "../lib/format";
import Icon from "../components/Icon";
import ProductImage from "../components/ProductImage";
import QuantityStepper from "../components/QuantityStepper";

/**
 * THE BAG, as a page: each line small — a thumbnail tile, the name and its
 * option, how many, what it comes to — and the total with the one button at
 * the right. A line is a row to read across, not a card: three things in a
 * bag must not be three screens.
 */
export default function Bag() {
  usePageMeta("pages.bag.title", "pages.bag.description");
  const { lines, total } = useCart();
  const remove = useContent("pages.bag.remove");
  return (
    <div className="py-8">
      <T k="pages.bag.heading" as="h1" className="mb-8 block text-[length:var(--size-h1)] leading-tight text-ink" />
      {lines.length === 0 ? (
        <div className="rounded bg-surface px-6 py-16 text-center">
          <T k="pages.bag.empty" as="p" className="text-ink-soft" />
          <Link to="/shop" className="mt-5 inline-flex rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-ink"><T k="pages.bag.browse" /></Link>
        </div>
      ) : (
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
          <ul className="min-w-0 flex-1 divide-y divide-line border-y border-line">
            {lines.map((l) => (
              <li key={lineKey(l)} data-testid={`bag-line-${l.id}`} className="flex items-center gap-5 py-4">
                <Link to={`/shop/${l.id}`} className="w-20 shrink-0"><ProductImage src={l.image} alt={l.name} aspect="1/1" /></Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/shop/${l.id}`} className="line-clamp-2 text-sm font-medium text-ink hover:underline">{l.name}</Link>
                  {l.variant && <p className="mt-1 text-xs text-ink-soft">{l.variant}</p>}
                </div>
                <QuantityStepper value={l.qty} onChange={(q) => setQuantity(lineKey(l), q)} />
                <p className="w-28 shrink-0 text-right text-sm font-bold tabular-nums text-ink">{formatPrice(l.price * l.qty)}</p>
                <button type="button" onClick={() => removeFromCart(lineKey(l))} aria-label={`${remove} ${l.name}`}
                  className="p-2 text-ink-soft hover:text-ink"><Icon name="remove" size={16} /></button>
              </li>
            ))}
          </ul>
          <aside className="rounded bg-surface p-6 lg:w-80 lg:shrink-0">
            <p className="flex items-baseline justify-between">
              <T k="pages.bag.total" className="text-sm text-ink-soft" />
              <span data-testid="bag-total" className="text-2xl font-bold tabular-nums text-ink">{formatPrice(total)}</span>
            </p>
            <Link to="/checkout" data-testid="bag-checkout"
              className="mt-6 block rounded-full bg-accent px-6 py-3.5 text-center font-medium text-accent-ink hover:opacity-90">
              <T k="pages.bag.checkout" />
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
