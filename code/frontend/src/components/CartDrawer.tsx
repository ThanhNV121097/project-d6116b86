import { type ReactNode } from "react";
import { Dialog } from "radix-ui";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import ProductImage from "./ProductImage";
import QuantityStepper from "./QuantityStepper";
import { lineKey, removeFromCart, setQuantity, useCart } from "../lib/cart";
import { formatPrice } from "../lib/format";

/**
 * The bag, as a panel from the right edge: what is in it, how many of each,
 * what it comes to, and the way to pay.
 *
 * A panel and not a page, because adding to the bag should not take the
 * visitor away from what they were looking at — they add a shirt, see it
 * land, and carry on. Radix carries the focus trap, the scroll lock and the
 * escape key. Reads src/lib/cart.ts; ONLY for a site whose brief sells
 * online.
 *
 *   const [open, setOpen] = useState(false);
 *   <CartDrawer open={open} onClose={() => setOpen(false)} checkout="/checkout"
 *     title={<T k="cart.title" />} empty={<T k="cart.empty" />} pay={<T k="cart.pay" />} />
 */
export default function CartDrawer({ open, onClose, checkout, title = "Your bag", empty = "Nothing in your bag yet.", pay = "Check out", totalLabel = "Total" }: {
  open: boolean;
  onClose: () => void;
  /** Where paying starts. */
  checkout: string;
  title?: ReactNode;
  empty?: ReactNode;
  pay?: ReactNode;
  totalLabel?: ReactNode;
}) {
  const { lines, total } = useCart();
  return (
    <Dialog.Root open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content
          data-block="cart"
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-ground text-ink shadow-xl outline-none"
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <Dialog.Title className="font-display text-lg">{title}</Dialog.Title>
            <Dialog.Close aria-label="Close" className="p-1 text-ink-soft hover:text-ink">
              <Icon name="close" size={20} />
            </Dialog.Close>
          </div>
          {lines.length === 0 ? (
            <p className="px-6 py-12 text-center text-ink-soft">{empty}</p>
          ) : (
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {lines.map((l) => (
                <li key={lineKey(l)} className="flex gap-4 py-4">
                  <div className="w-20 shrink-0"><ProductImage src={l.image} alt={l.name} aspect="1/1" /></div>
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="min-w-0 text-sm text-ink">
                        {l.name}
                        {l.variant && <span className="block text-ink-soft">{l.variant}</span>}
                      </p>
                      <p className="shrink-0 text-sm tabular-nums">{formatPrice(l.price * l.qty)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <QuantityStepper value={l.qty} onChange={(q) => setQuantity(lineKey(l), q)} />
                      <button type="button" onClick={() => removeFromCart(lineKey(l))} aria-label={`Remove ${l.name}`}
                        className="p-2 text-ink-soft hover:text-ink"><Icon name="remove" size={16} /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {lines.length > 0 && (
            <div className="border-t border-line px-6 py-5">
              <div className="mb-4 flex items-baseline justify-between">
                <span className="text-sm text-ink-soft">{totalLabel}</span>
                <span className="text-lg tabular-nums">{formatPrice(total)}</span>
              </div>
              <Link to={checkout} onClick={onClose}
                className="block rounded bg-accent px-5 py-3 text-center text-accent-ink hover:opacity-90">{pay}</Link>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
