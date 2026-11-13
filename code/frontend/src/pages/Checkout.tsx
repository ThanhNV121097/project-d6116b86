import { T } from "../editable";
import { usePageMeta } from "../seo";
import { useCollection } from "../data";
import { useCart, type CartLine } from "../lib/cart";
import { useDemo } from "../lib/demo";
import type { Product } from "../lib/shop";
import Grid from "../components/Grid";
import OrderForm from "../components/OrderForm";
import Pill from "../components/Pill";
import ProductCard from "../components/ProductCard";
import Script from "../components/Script";

/**
 * PAYING. The heading and what the three steps are on the pale band, running
 * to both edges; then the steps at the left — who it is for, how it gets to
 * them, how they pay — and the order at the right with its pictures, what the
 * total is made of, and the Pay pill naming the amount. What happens after
 * Pay is said under the pill, before it is pressed.
 */
export default function Checkout() {
  usePageMeta("pages.checkout.title", "pages.checkout.description");
  const cart = useCart();
  const demo = useDemo();
  const products = useCollection<Product>("products", { where: { status: "live" }, pageSize: 3 }).items;
  const lines: CartLine[] = demo && cart.lines.length === 0
    ? products.slice(0, 2).map((p, i) => ({ id: p.id, name: p.name, price: p.price, image: p.image, qty: i === 0 ? 2 : 1 }))
    : cart.lines;
  return (
    <div className="pb-8">
      <section className="mx-[calc(var(--gutter)*-1)] mt-4 bg-surface px-[var(--gutter)] py-10 lg:py-12">
        <h1 className="relative font-display text-[length:var(--size-h1)] uppercase leading-[0.95] text-ink"><T k="pages.checkout.heading" /><Script k="pages.checkout.script" /></h1>
        <T k="pages.checkout.lead" as="p" className="mt-5 max-w-[60ch] text-[0.9375rem] leading-relaxed text-ink-soft" />
      </section>
      {lines.length === 0 ? (
        <div className="mt-10 flex flex-col gap-12">
          <div className="flex flex-col items-start gap-6 rounded border border-line p-8 lg:flex-row lg:items-center lg:justify-between">
            <T k="pages.checkout.empty" as="p" className="text-lg text-ink" />
            <Pill to="/shop"><T k="pages.bag.browse" /></Pill>
          </div>
          {products.length > 0 && (
            <Grid count={products.length} max={3}>
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </Grid>
          )}
        </div>
      ) : (
        <OrderForm lines={lines} className="mt-10" />
      )}
    </div>
  );
}
