import { Link } from "react-router-dom";
import { T, useContent } from "../editable";
import { usePageMeta } from "../seo";
import { useCollection } from "../data";
import { lineKey, removeFromCart, setQuantity, useCart, type CartLine } from "../lib/cart";
import { useDemo } from "../lib/demo";
import { formatPrice } from "../lib/format";
import { payIcon, type PaymentMethod, type Product } from "../lib/shop";
import Grid from "../components/Grid";
import Icon from "../components/Icon";
import Pill from "../components/Pill";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import QuantityStepper from "../components/QuantityStepper";
import Script from "../components/Script";

/**
 * THE BAG: each bottle a rounded line — its picture on the pale sky, the name
 * in the heavy capitals, the size and unit price, how many, what the line
 * comes to (right-aligned), and a way to take it out — beside one summary
 * card with the total set large, the lime pill, and the ways to pay online.
 * An empty bag shows three bottles to start with.
 */
export default function Bag() {
  usePageMeta("pages.bag.title", "pages.bag.description");
  const cart = useCart();
  const demo = useDemo();
  const everything = useCollection<Product>("products", { where: { status: "live" }, pageSize: 200 }).items;
  const methods = useCollection<PaymentMethod>("payment_methods", { pageSize: 10 }).items;
  const remove = useContent("pages.bag.remove");
  const byId = new Map(everything.map((p) => [p.id, p]));
  const suggestions = everything.slice(0, 3);
  const lines: CartLine[] = demo && cart.lines.length === 0
    ? suggestions.map((p, i) => ({ id: p.id, name: p.name, price: p.price, image: p.image, qty: i === 0 ? 2 : 1 }))
    : cart.lines;
  const total = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  return (
    <div className="pb-8 pt-8">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <h1 className="relative font-display text-[length:var(--size-h1)] uppercase leading-[0.95] text-ink"><T k="pages.bag.heading" /><Script k="pages.bag.script" /></h1>
        {lines.length > 0 && <p className="text-sm text-ink-soft"><span className="font-display text-3xl tabular-nums text-ink">{count}</span>{" "}<T k="pages.bag.bottles" /></p>}
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-col gap-12">
          <div className="flex flex-col items-start gap-6 rounded bg-surface p-8 lg:flex-row lg:items-center lg:justify-between">
            <T k="pages.bag.empty" as="p" className="max-w-[44ch] text-lg text-ink" />
            <Pill to="/shop" testid="bag-browse"><T k="pages.bag.browse" /></Pill>
          </div>
          {suggestions.length > 0 && (
            <div>
              <T k="pages.bag.start" as="h2" className="mb-6 block font-display text-[length:var(--size-h2)] uppercase leading-none text-ink" />
              <Grid count={suggestions.length} max={3}>
                {suggestions.map((p) => <ProductCard key={p.id} product={p} />)}
              </Grid>
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
          <ul className="flex flex-col gap-4 lg:col-span-8">
            {lines.map((l) => {
              const p = byId.get(l.id);
              const about = [p?.volume, formatPrice(l.price), l.variant].filter(Boolean).join(" · ");
              return (
                <li key={lineKey(l)} data-testid={`bag-line-${l.id}`} className="flex items-center gap-4 rounded border border-line p-3 sm:gap-6">
                  <Link to={`/shop/${l.id}`} className="w-24 shrink-0 sm:w-32"><ProductImage src={l.image} alt={l.name} aspect="1/1" /></Link>
                  <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <Link to={`/shop/${l.id}`} className="block font-display text-xl uppercase leading-tight text-ink hover:underline">{l.name}</Link>
                      <p className="mt-1 text-sm tabular-nums text-ink-soft">{about}</p>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-6">
                      <QuantityStepper value={l.qty} onChange={(q) => setQuantity(lineKey(l), q)} />
                      <p className="ml-auto w-28 text-right font-display text-xl tabular-nums text-ink">{formatPrice(l.price * l.qty)}</p>
                      <button type="button" onClick={() => removeFromCart(lineKey(l))} aria-label={`${remove} ${l.name}`}
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-surface hover:text-ink">
                        <Icon name="remove" size={18} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="flex flex-col gap-5 rounded bg-surface p-6 lg:col-span-4">
            <T k="pages.bag.summary" as="h2" className="font-display text-2xl uppercase text-ink" />
            <dl className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between gap-4"><dt className="text-ink-soft"><T k="pages.bag.subtotal" /></dt><dd className="tabular-nums text-ink">{formatPrice(total)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-ink-soft"><T k="pages.bag.delivery" /></dt><dd className="text-right text-ink"><T k="pages.bag.delivery_later" /></dd></div>
            </dl>
            <p className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
              <T k="pages.bag.total" className="text-sm text-ink-soft" />
              <span data-testid="bag-total" className="font-display text-4xl tabular-nums text-ink">{formatPrice(total)}</span>
            </p>
            <Pill to="/checkout" testid="bag-checkout" className="justify-between"><T k="pages.bag.checkout" /></Pill>
            {methods.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-line pt-4">
                <T k="pages.bag.pay_with" as="p" className="text-xs uppercase tracking-widest text-ink-soft" />
                <ul className="flex flex-wrap gap-2">
                  {methods.map((m) => (
                    <li key={m.id} className="inline-flex items-center gap-1.5 rounded-full bg-ground px-3 py-1.5 text-xs text-ink"><Icon name={payIcon(m.icon)} size={14} />{m.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
