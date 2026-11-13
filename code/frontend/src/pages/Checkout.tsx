import { Link } from "react-router-dom";
import { T } from "../editable";
import { usePageMeta } from "../seo";
import { useCart } from "../lib/cart";
import { formatPrice } from "../lib/format";
import OrderForm from "../components/OrderForm";

/**
 * CHECKING OUT: who it is for and where it goes at the left, and what is
 * being ordered at the right, where it can be read while the form is filled
 * in. The shop confirms by message; nothing is charged on this page.
 */
export default function Checkout() {
  usePageMeta("pages.checkout.title", "pages.checkout.description");
  const { lines, total } = useCart();
  return (
    <div className="py-8">
      <T k="pages.checkout.heading" as="h1" className="block text-[length:var(--size-h1)] leading-tight text-ink" />
      <T k="pages.checkout.lead" as="p" className="mt-3 max-w-[60ch] text-sm leading-relaxed text-ink-soft" />
      <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-14">
        <OrderForm className="min-w-0 flex-1" />
        <aside className="rounded bg-surface p-6 lg:w-96 lg:shrink-0">
          <T k="pages.checkout.summary" as="h2" className="mb-4 block text-lg text-ink" />
          {lines.length === 0 ? (
            <p className="text-sm text-ink-soft">
              <T k="pages.checkout.empty" />{" "}
              <Link to="/shop" className="font-medium text-accent hover:underline"><T k="pages.bag.browse" /></Link>
            </p>
          ) : (
            <>
              <ul className="flex flex-col gap-3 text-sm">
                {lines.map((l) => (
                  <li key={`${l.id}-${l.variant ?? ""}`} className="flex items-baseline justify-between gap-4">
                    <span className="min-w-0 text-ink">
                      <span className="tabular-nums text-ink-soft">{l.qty} ×</span>{" "}{l.name}
                    </span>
                    <span className="shrink-0 tabular-nums text-ink">{formatPrice(l.price * l.qty)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
                <T k="pages.checkout.total" className="text-sm text-ink-soft" />
                <span className="text-xl font-bold tabular-nums text-ink">{formatPrice(total)}</span>
              </p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
