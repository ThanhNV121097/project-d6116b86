import { useState } from "react";
import { Link } from "react-router-dom";
import { T, useContent, useList } from "../editable";
import { usePageMeta } from "../seo";
import { useCollection } from "../data";
import { useDemo } from "../lib/demo";
import { formatDateTime, formatPrice } from "../lib/format";
import { lastOrder, type PlacedOrder } from "../lib/mock/orders";
import type { Product } from "../lib/shop";
import { Picture } from "../picture";
import Icon from "../components/Icon";
import Pill from "../components/Pill";
import ProductImage from "../components/ProductImage";
import Script from "../components/Script";

/** Where an order stands on this page: it has just been paid. */
const NOW = 0;

/**
 * AFTER PAYING. The answer first and largest — ORDER PLACED with its number —
 * then where it stands as one line of steps, what happens next and who to
 * ask; at the right a sunlit photograph with a white card floated over it
 * carrying the total, how it was paid and where it is going. Under both,
 * what was ordered with its pictures.
 */
export default function Order() {
  usePageMeta("pages.order.title", "pages.order.description");
  const [placed] = useState<PlacedOrder | null>(() => lastOrder());
  const demo = useDemo();
  const products = useCollection<Product>("products", { where: { status: "live" }, pageSize: 2 }).items;
  const image = useContent("pages.order.image");
  const tbc = useContent("pages.checkout.fee_tbc");
  const steps = useList<string>("pages.order.steps");
  const example = demo && products.length > 0 ? exampleOrder(products) : null;
  const order = placed ?? example;
  if (!order) {
    return (
      <div className="flex min-h-[50vh] flex-col items-start justify-center gap-6 py-16">
        <h1 className="font-display text-[length:var(--size-h1)] uppercase leading-[0.95] text-ink"><T k="pages.order.none" /></h1>
        <Pill to="/shop"><T k="pages.order.again" /></Pill>
      </div>
    );
  }
  return (
    <div className="pb-8 pt-8">
      <section className="grid gap-10 lg:grid-cols-12 lg:items-stretch">
        <div className="flex flex-col gap-6 lg:col-span-6 lg:py-4">
          <p className="inline-flex items-center gap-2 self-start rounded-full bg-accent px-4 py-2 text-xs font-medium uppercase tracking-widest text-accent-ink">
            <Icon name="check" size={14} /><T k="pages.order.chip" />
          </p>
          <h1 data-testid="order-placed" className="relative font-display text-[length:var(--size-h1)] uppercase leading-[0.95] text-ink">
            <T k="pages.order.heading" /><Script k="pages.order.script" />
          </h1>
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-ink-soft">
            <T k="pages.order.number" />
            <span data-testid="order-ref" className="font-display text-2xl tabular-nums text-ink">{order.ref}</span>
            <span>{formatDateTime(order.placedAt)}</span>
          </p>
          {steps.length > 0 && (
            <ol className="grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
              {steps.map((_, i) => (
                <li key={i} aria-current={i === NOW ? "step" : undefined} className="flex flex-col gap-2">
                  <span className={`h-1.5 rounded-full ${i <= NOW ? "bg-accent" : "bg-line"}`} />
                  <span className={`flex items-center gap-1.5 text-xs uppercase tracking-wide ${i <= NOW ? "text-ink" : "text-ink-soft"}`}>
                    {i <= NOW && <Icon name="check" size={13} />}<T k={`pages.order.steps.${i}`} />
                  </span>
                </li>
              ))}
            </ol>
          )}
          <T k="pages.order.next" as="p" className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink" />
          <div className="mt-2 flex flex-wrap items-center gap-6">
            <Pill to="/shop" testid="order-shop"><T k="pages.order.again" /></Pill>
            <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-medium text-ink underline-offset-4 hover:underline"><Icon name="chat" size={16} /><T k="pages.order.ask" /></Link>
          </div>
        </div>
        <div className="relative min-h-[26rem] overflow-hidden rounded bg-[var(--photo-deep)] lg:col-span-6">
          {image && <Picture src={image} alt="" loading="eager" width={1280} height={853} className="absolute inset-0 h-full w-full object-cover" />}
          <div data-tilt="" className="absolute bottom-4 left-4 right-4 rounded bg-ground p-5 text-ink shadow-[var(--shadow-md)] sm:right-auto sm:w-80">
            <T k="pages.order.total" as="p" className="text-xs uppercase tracking-widest text-ink-soft" />
            <p className="mt-1 font-display text-4xl tabular-nums">{formatPrice(order.total)}</p>
            <p className="mt-3 flex items-center gap-2 text-sm"><Icon name="card" size={16} />{order.payment}</p>
            <p className="mt-1 flex items-start gap-2 text-sm"><Icon name="shipping" size={16} /><span>{[order.delivery, order.address].filter(Boolean).join(" — ")}</span></p>
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="relative mb-6 font-display text-[length:var(--size-h2)] uppercase leading-[0.95] text-ink"><T k="pages.order.what" /><Script k="pages.order.what_script" /></h2>
        <ul className="divide-y divide-line border-y border-line">
          {order.lines.map((l) => (
            <li key={`${l.id}-${l.variant ?? ""}`} className="flex items-center gap-5 py-4">
              <div className="w-20 shrink-0"><ProductImage src={l.image} alt={l.name} aspect="1/1" /></div>
              <div className="min-w-0 flex-1">
                <p className="font-display text-xl uppercase leading-tight text-ink">{l.name}</p>
                <p className="text-sm tabular-nums text-ink-soft">{l.qty} × {formatPrice(l.price)}</p>
              </div>
              <p className="font-display text-xl tabular-nums text-ink">{formatPrice(l.price * l.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="ml-auto mt-6 flex max-w-sm flex-col gap-2 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-ink-soft"><T k="pages.checkout.subtotal" /></dt><dd className="tabular-nums text-ink">{formatPrice(order.subtotal)}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-ink-soft">{order.delivery}</dt><dd className="tabular-nums text-ink">{order.fee === null ? tbc : formatPrice(order.fee)}</dd></div>
          <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3"><dt className="text-ink-soft"><T k="pages.checkout.total" /></dt><dd className="font-display text-3xl tabular-nums text-ink">{formatPrice(order.total)}</dd></div>
        </dl>
      </section>
    </div>
  );
}

/** What the Studio and the walk are shown when nobody has paid on this
 *  browser: two real bottles, as an order would hold them. */
function exampleOrder(products: Product[]): PlacedOrder {
  const lines = products.map((p, i) => ({ id: p.id, name: p.name, price: p.price, image: p.image, qty: i === 0 ? 2 : 1 }));
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  return {
    ref: "EP-7K2Q9", placedAt: "2026-11-13T09:30:00", name: "", reply: "", address: "",
    delivery: "Delivery", payment: "E-wallet", lines, subtotal, fee: null, total: subtotal,
  };
}
