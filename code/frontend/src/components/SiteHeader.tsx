import { useState } from "react";
import { Link } from "react-router-dom";
import { T, useContent, useList } from "../editable";
import { useCart } from "../lib/cart";
import type { NavItem } from "../lib/shop";
import CartDrawer from "./CartDrawer";
import Icon from "./Icon";
import MenuToggle from "./MenuToggle";
import MobileMenu from "./MobileMenu";

/**
 * THE HEADER: one rounded bar — the name at the left in the heavy capitals,
 * the links in the middle, and at the right the bag with its count and one
 * pill. On the home page it is a bar of GLASS lying across the top of the
 * hero photograph (`over`), in white; on every other page the same bar is
 * outlined on the white page in the deep green.
 *
 * The glass is a layer BEHIND the row, not a filter on the header itself: a
 * filter on an ancestor would trap the bag's drawer inside the bar.
 */
export default function SiteHeader({ over = false }: { over?: boolean }) {
  const name = useContent("site.name");
  const bagLabel = useContent("header.bag");
  const links = useList<NavItem>("nav.links");
  const { count } = useCart();
  const [menu, setMenu] = useState(false);
  const [bag, setBag] = useState(false);
  return (
    <header className={over ? "absolute inset-x-[var(--gutter)] top-4 z-20 text-[var(--on-photo)]" : "mx-auto mt-4 max-w-page px-[var(--gutter)] text-ink"}>
      <div className="relative">
        <span className={`absolute inset-0 rounded ${over ? "border border-[var(--glass-line)] bg-[var(--glass)] backdrop-blur-md" : "border border-line"}`} />
        <div className="relative flex h-[var(--header-h)] items-center gap-8 px-5">
          <Link to="/" aria-label={name} className="shrink-0 font-display text-2xl uppercase leading-none"><T k="site.name" /></Link>
          <nav aria-label="Main" className="mx-auto hidden items-center gap-10 text-sm lg:flex">
            {links.map((l, i) => (
              <Link key={l.href} to={l.href} className="underline-offset-4 hover:underline"><T k={`nav.links.${i}.label`} /></Link>
            ))}
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-4 text-sm lg:ml-0">
            <button type="button" onClick={() => setBag(true)} data-testid="open-bag" aria-label={bagLabel} className="inline-flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-ground text-ink"><Icon name="bag" size={16} /></span>
              <span className="hidden lg:inline"><T k="header.bag" />{" "}<span className="tabular-nums">({count})</span></span>
            </button>
            <Link to="/shop" data-testid="header-cta"
              className="hidden rounded-full bg-ground px-5 py-2.5 font-display text-sm uppercase leading-none text-ink lg:block">
              <T k="nav.cta.label" />
            </Link>
            <MenuToggle open={menu} onToggle={() => setMenu((o) => !o)} className={`lg:hidden ${over ? "text-[var(--on-photo)]! hover:bg-transparent!" : ""}`} />
          </div>
        </div>
      </div>

      <MobileMenu open={menu} onClose={() => setMenu(false)}>
        <nav className="flex flex-col gap-4 font-display text-4xl uppercase text-ink" aria-label="Main">
          {links.map((l, i) => (
            <Link key={l.href} to={l.href} onClick={() => setMenu(false)}><T k={`nav.links.${i}.label`} /></Link>
          ))}
          <Link to="/admin" onClick={() => setMenu(false)} className="font-body text-base normal-case text-ink-soft"><T k="header.account" /></Link>
        </nav>
      </MobileMenu>

      <CartDrawer open={bag} onClose={() => setBag(false)} checkout="/checkout"
        title={<T k="pages.bag.heading" />} empty={<T k="pages.bag.empty" />}
        pay={<T k="pages.bag.drawer_pay" />} totalLabel={<T k="pages.bag.total" />} />
    </header>
  );
}
