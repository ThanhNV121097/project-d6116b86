import { useState, type FormEvent, type ReactNode } from "react";
import { T, useContent } from "../editable";
import { clearCart, useCart } from "../lib/cart";
import { formatPrice } from "../lib/format";
import { canSend, sendEnquiry } from "../site";

type State = "idle" | "sending" | "sent" | "failed";

/**
 * THE ORDER, SENT. The bag's lines go to the owner as one message with who
 * it is for and where it goes (src/site.ts — the same inbox the contact form
 * reaches), and the bag is emptied once it has gone. Nothing is charged
 * here: the shop confirms the order and the delivery charge by message.
 *
 * A shop that takes payment online replaces this with its gateway's own
 * step; what it must keep is that an order is marked paid by the gateway's
 * notice to the server, never by this page.
 */
export default function OrderForm({ className = "" }: { className?: string }) {
  const { lines, total } = useCart();
  const [state, setState] = useState<State>("idle");
  const [problem, setProblem] = useState("");
  const offline = useContent("contact.form.offline");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const value = (k: string) => String(data.get(k) ?? "").trim();
    const order = lines.map((l) => `${l.qty} × ${l.name}${l.variant ? ` (${l.variant})` : ""} — ${formatPrice(l.price * l.qty)}`).join("\n");
    setState("sending");
    try {
      await sendEnquiry({
        name: value("name"), reply_to: value("reply_to"), website: value("website"),
        message: [order, value("message")].filter(Boolean).join("\n\n"),
        details: { address: value("address"), total: formatPrice(total) },
      });
      clearCart();
      setState("sent");
    } catch (err) {
      setProblem(err instanceof Error ? err.message : "");
      setState("failed");
    }
  }

  if (state === "sent") {
    return <T k="contact.form.sent" as="p" data-testid="order-sent" className={`text-lg text-ink ${className}`} />;
  }
  const input = "w-full rounded-[var(--radius-sm)] border border-field bg-ground px-4 py-3 text-ink";
  return (
    <form onSubmit={(e) => void submit(e)} className={`flex flex-col gap-4 ${className}`}>
      <Field k="name"><input name="name" autoComplete="name" required className={input} /></Field>
      <Field k="reply_to"><input name="reply_to" autoComplete="tel" required className={input} /></Field>
      <Field k="fields.address"><input name="address" autoComplete="street-address" required className={input} /></Field>
      <Field k="message"><textarea name="message" rows={3} className={input} /></Field>
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
      {state === "failed" && <p role="alert" className="text-sm text-ink">{problem}</p>}
      {!canSend && <p className="text-sm text-ink-soft">{offline}</p>}
      <button type="submit" disabled={state === "sending" || lines.length === 0} data-testid="place-order"
        className="self-start rounded-full bg-accent px-7 py-3 font-medium text-accent-ink disabled:opacity-60">
        <T k={state === "sending" ? "contact.form.sending" : "contact.form.send"} />
      </button>
    </form>
  );
}

function Field({ k, children }: { k: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <T k={`contact.form.${k}`} className="text-ink-soft" />
      {children}
    </label>
  );
}
