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
 * THE BAG. The heading on the pale band, running to both edges; then every
 * bottle as a card of its own — its picture large on the pale sky, the name
 * in the heavy capitals, the size and unit price, how many, and what the
 * line comes to — beside one summary card with the total set large, the lime
 * pill, and the ways to pay online. A bag holds a few bottles, so each is
 * shown large rather than as a thumbnail in a list. An empty bag shows three
 * bottles to start with.
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
    <div className="pb-8">
      <section className="mx-[calc(var(--gutter)*-1)] mb-10 mt-4 bg-surface px-[var(--gutter)] py-10 lg:py-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="relative font-display text-[length:var(--size-h1)] uppercase leading-[0.95] text-ink"><T k="pages.bag.heading" /><Script k="pages.bag.script" /></h1>
          {lines.length > 0 && <p className="text-base text-ink-soft"><span className="font-display text-4xl tabular-nums text-ink">{count}</span>{" "}<T k="pages.bag.bottles" /></p>}
        </div>
      </section>

      {lines.length === 0 ? (
        <div className="flex flex-col gap-12">
          <div className="flex flex-col items-start gap-6 rounded border border-line p-8 lg:flex-row lg:items-center lg:justify-between">
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
          <div className="lg:col-span-8">
            <Grid count={lines.length} max={3}>
              {lines.map((l) => {
                const p = byId.get(l.id);
                const about = [p?.volume, formatPrice(l.price), l.variant].filter(Boolean).join(" · ");
                return (
                  <article key={lineKey(l)} data-testid={`bag-line-${l.id}`} data-record={`products:${l.id}`}
                    className="flex h-full flex-col overflow-hidden rounded border border-line bg-ground">
                    <Link to={`/shop/${l.id}`} className="block"><ProductImage src={l.image} alt={l.name} aspect="4/3" className="rounded-none" /></Link>
                    <div className="flex flex-1 flex-col gap-2 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <Link to={`/shop/${l.id}`} className="line-clamp-2 min-h-[2.5em] font-display text-xl uppercase leading-tight text-ink hover:underline">{l.name}</Link>
                        <button type="button" onClick={() => removeFromCart(lineKey(l))} aria-label={`${remove} ${l.name}`}
                          className="-mr-2 -mt-2 grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-soft hover:bg-surface hover:text-ink">
                          <Icon name="remove" size={18} />
                        </button>
                      </div>
                      <p className="text-[0.8125rem] tabular-nums text-ink-soft">{about}</p>
                      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                        <QuantityStepper value={l.qty} onChange={(q) => setQuantity(lineKey(l), q)} />
                        <p className="text-right font-display text-xl tabular-nums text-ink">{formatPrice(l.price * l.qty)}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </Grid>
          </div>

          <aside className="flex flex-col gap-5 rounded bg-surface p-6 lg:col-span-4">
            <T k="pages.bag.summary" as="h2" className="font-display text-2xl uppercase text-ink" />
            <dl className="flex flex-col gap-3 text-[0.9375rem]">
              <div className="flex justify-between gap-4"><dt className="text-ink-soft"><T k="pages.bag.subtotal" /></dt><dd className="tabular-nums text-ink">{formatPrice(total)}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-ink-soft"><T k="pages.bag.delivery" /></dt><dd className="text-right text-ink"><T k="pages.bag.delivery_later" /></dd></div>
            </dl>
            <p className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
              <T k="pages.bag.total" className="text-[0.9375rem] text-ink-soft" />
              <span data-testid="bag-total" className="font-display text-4xl tabular-nums text-ink">{formatPrice(total)}</span>
            </p>
            <Pill to="/checkout" testid="bag-checkout" className="justify-between"><T k="pages.bag.checkout" /></Pill>
            {methods.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-line pt-4">
                <T k="pages.bag.pay_with" as="p" className="text-xs uppercase tracking-widest text-ink-soft" />
                <ul className="flex flex-wrap gap-2">
                  {methods.map((m) => (
                    <li key={m.id} className="inline-flex items-center gap-1.5 rounded-full bg-ground px-3 py-1.5 text-[0.8125rem] text-ink"><Icon name={payIcon(m.icon)} size={14} />{m.name}</li>
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
