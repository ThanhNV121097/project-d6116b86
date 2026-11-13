import { useState, type FormEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { T, useContent } from "../editable";
import { useCollection } from "../data";
import { clearCart, lineKey, type CartLine } from "../lib/cart";
import { formatPrice } from "../lib/format";
import { newRef, saveOrder, type PlacedOrder } from "../lib/mock/orders";
import { payIcon, type DeliveryOption, type PaymentMethod } from "../lib/shop";
import { canSend, sendEnquiry } from "../site";
import Icon from "./Icon";
import Pill from "./Pill";
import ProductImage from "./ProductImage";

type State = "idle" | "paying" | "failed";

/**
 * THE CHECKOUT FORM: who, how it arrives, how it is paid — and beside it the
 * order and the Pay pill.
 *
 * Paying here is the design's mock: a success state with no charge. The order
 * goes to the owner's inbox in Agent Team (src/site.ts) with who it is for,
 * where it goes and how it was paid, and the visitor lands on /order. After
 * approval the payment provider's own step replaces the mock, and an order is
 * marked paid only by its notice to the server, never by this page.
 *
 * The delivery fee and the ways to pay are the owner's (src/data): a fee they
 * have not set reads as to be confirmed, never as free.
 */
export default function OrderForm({ lines, className = "" }: { lines: CartLine[]; className?: string }) {
  const navigate = useNavigate();
  const delivery = useCollection<DeliveryOption>("delivery_options", { pageSize: 10 }).items;
  const methods = useCollection<PaymentMethod>("payment_methods", { pageSize: 10 }).items;
  const [how, setHow] = useState("");
  const [pay, setPay] = useState("");
  const [state, setState] = useState<State>("idle");
  const [problem, setProblem] = useState("");
  const tbc = useContent("pages.checkout.fee_tbc");
  const choosePay = useContent("pages.checkout.choose_pay");
  const payLabel = useContent("pages.checkout.pay");
  const paying = useContent("pages.checkout.paying");
  const option = delivery.find((d) => d.id === how) ?? delivery[0];
  const method = methods.find((m) => m.id === pay);
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const fee = typeof option?.fee === "number" ? option.fee : null;
  const total = subtotal + (fee ?? 0);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!method) {
      setProblem(choosePay);
      setState("failed");
      return;
    }
    const data = new FormData(e.currentTarget);
    const value = (k: string) => String(data.get(k) ?? "").trim();
    const order: PlacedOrder = {
      ref: newRef(), placedAt: new Date().toISOString(),
      name: value("name"), reply: value("reply_to"), address: value("address"), note: value("message"),
      delivery: option?.name ?? "", payment: method.name, lines, subtotal, fee, total,
    };
    setState("paying");
    // The order also goes to the owner's inbox when the site is connected.
    // That message never stands in the way of the (mock) payment, which the
    // payment provider's own step replaces after approval.
    if (canSend) {
      void sendEnquiry({
        name: order.name, reply_to: order.reply, website: value("website"),
        message: [order.ref, ...lines.map((l) => `${l.qty} × ${l.name} — ${formatPrice(l.price * l.qty)}`), order.note].filter(Boolean).join("\n"),
        details: { order: order.ref, delivery: order.delivery, address: order.address, payment: order.payment, total: formatPrice(total) },
      }).catch(() => undefined);
    }
    saveOrder(order);
    clearCart();
    navigate("/order");
  }

  const input = "w-full appearance-none rounded-[var(--radius-sm)] border border-field bg-ground px-4 py-3 text-ink focus:border-ink focus:outline-none";
  const card = (checked: boolean) => `relative flex cursor-pointer gap-3 rounded border p-4 transition-colors ${checked ? "border-ink bg-surface" : "border-line hover:border-field"}`;
  return (
    <form onSubmit={submit} className={`relative grid gap-10 lg:grid-cols-12 lg:items-start ${className}`}>
      <div className="flex flex-col gap-10 lg:col-span-7">
        <Step n={1} k="pages.checkout.step_contact">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="checkout-name" k="contact.form.name"><input id="checkout-name" name="name" autoComplete="name" required className={input} /></Field>
            <Field id="checkout-reply" k="contact.form.reply_to"><input id="checkout-reply" name="reply_to" autoComplete="tel" required className={input} /></Field>
          </div>
        </Step>

        <Step n={2} k="pages.checkout.step_delivery">
          {delivery.length > 0 && (
            <div role="radiogroup" className="grid gap-3 sm:grid-cols-2">
              {delivery.map((d) => {
                const checked = option?.id === d.id;
                return (
                  <label key={d.id} data-testid={`delivery-${d.id}`} className={`${card(checked)} items-center`}>
                    <input type="radio" name="delivery" value={d.id} checked={checked} onChange={() => setHow(d.id)} className="sr-only" />
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-accent-ink"><Icon name={d.id === "pickup" ? "store" : "shipping"} size={18} /></span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-ink">{d.name}</span>
                      <span className="block text-[0.8125rem] tabular-nums text-ink-soft">{typeof d.fee === "number" ? formatPrice(d.fee) : tbc}</span>
                      {d.note && <span className="block text-[0.8125rem] text-ink-soft">{d.note}</span>}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
          <Field id="checkout-address" k="contact.form.fields.address"><input id="checkout-address" name="address" autoComplete="street-address" required={option?.id !== "pickup"} className={input} /></Field>
          <Field id="checkout-note" k="pages.checkout.note"><textarea id="checkout-note" name="message" rows={3} className={input} /></Field>
        </Step>

        <Step n={3} k="pages.checkout.step_pay">
          <div role="radiogroup" className="grid gap-3 sm:grid-cols-3">
            {methods.map((m) => {
              const checked = pay === m.id;
              return (
                <label key={m.id} data-testid={`pay-${m.id}`} className={`${card(checked)} flex-col`}>
                  <input type="radio" name="payment" value={m.id} checked={checked} onChange={() => setPay(m.id)} className="sr-only" />
                  <span className="flex items-center justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-ink"><Icon name={payIcon(m.icon)} size={18} /></span>
                    {checked && <Icon name="check" size={18} className="text-ink" />}
                  </span>
                  <span className="font-medium text-ink">{m.name}</span>
                  {m.note && <span className="text-xs text-ink-soft">{m.note}</span>}
                </label>
              );
            })}
          </div>
        </Step>
      </div>

      <aside className="flex flex-col gap-5 rounded bg-surface p-6 lg:col-span-5">
        <T k="pages.checkout.summary" as="h2" className="font-display text-2xl uppercase text-ink" />
        <ul className="flex flex-col gap-3">
          {lines.map((l) => (
            <li key={lineKey(l)} data-record={`products:${l.id}`} className="flex items-center gap-4">
              <div className="w-16 shrink-0"><ProductImage src={l.image} alt={l.name} aspect="1/1" /></div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-ink">{l.name}</p>
                <p className="text-xs tabular-nums text-ink-soft">{l.qty} × {formatPrice(l.price)}</p>
              </div>
              <p className="tabular-nums text-ink">{formatPrice(l.price * l.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="flex flex-col gap-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-ink-soft"><T k="pages.checkout.subtotal" /></dt><dd className="tabular-nums text-ink">{formatPrice(subtotal)}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-ink-soft">{option?.name ?? <T k="pages.bag.delivery" />}</dt><dd className="text-right tabular-nums text-ink">{fee === null ? tbc : formatPrice(fee)}</dd></div>
        </dl>
        <p className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
          <T k="pages.checkout.total" className="text-sm text-ink-soft" />
          <span data-testid="checkout-total" className="font-display text-4xl tabular-nums text-ink">{formatPrice(total)}</span>
        </p>
        {state === "failed" && problem && <p role="alert" className="flex items-start gap-2 text-sm text-danger"><Icon name="alert" size={18} />{problem}</p>}
        <Pill type="submit" testid="place-order" glyph={state === "paying" ? "hours" : "lock"} disabled={state === "paying"} className="w-full justify-between">
          {state === "paying" ? paying : `${payLabel} ${formatPrice(total)}`}
        </Pill>
        <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-soft"><Icon name="info" size={16} /><T k="pages.checkout.after" /></p>
      </aside>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
    </form>
  );
}

/** One numbered step: the steps of paying are a sequence, so they count. */
function Step({ n, k, children }: { n: number; k: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-4 flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-ink font-display text-lg leading-none text-ground">{n}</span>
        <T k={k} className="font-display text-2xl uppercase text-ink" />
      </legend>
      {children}
    </fieldset>
  );
}

function Field({ id, k, children }: { id: string; k: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <label htmlFor={id} className="text-ink-soft"><T k={k} /></label>
      {children}
    </div>
  );
}
