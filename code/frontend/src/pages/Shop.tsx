import { Link } from "react-router-dom";
import { T } from "../editable";
import { usePageMeta } from "../seo";
import { useCollection } from "../data";
import { useTableQuery } from "../lib/table";
import type { Department, Product } from "../lib/shop";
import FilterRail from "../components/FilterRail";
import Grid from "../components/Grid";
import Icon from "../components/Icon";
import ProductCard from "../components/ProductCard";

/**
 * THE CATALOGUE: where you are and how many there are, the departments to
 * narrow by down the left, and the same card as everywhere else, four across
 * beside the rail.
 *
 * Everything that narrows the list lives in the address (useTableQuery): the
 * department, today's deals, and what was typed in the header's search — so
 * "kettles in the kitchen" is a link somebody can send, and coming back from
 * a product lands on the same list. A search that finds nothing says so and
 * offers the way back, never an empty page that looks like an empty shop.
 */
export default function Shop() {
  usePageMeta("pages.shop.title", "pages.shop.description");
  const t = useTableQuery({ size: 12 });
  const departments = useCollection<Department>("categories", { pageSize: 24 }).items;
  const chosen = t.list("category");
  const { items, total, page, pages } = useCollection<Product>("products", {
    where: { status: "live", category: chosen, deal: t.get("deal") === "true" ? true : undefined },
    q: t.q, search: ["name", "fact", "description"], page: t.page, pageSize: t.size,
  });
  const one = chosen.length === 1 ? departments.find((d) => d.id === chosen[0]) : undefined;
  return (
    <div className="py-8">
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-ink-soft">
        <Link to="/" className="hover:text-ink"><Icon name="home" size={16} label="Home" /></Link>
        <Icon name="next" size={14} />
        <Link to="/shop" className="hover:text-ink"><T k="pages.shop.crumb" /></Link>
        {one && (<><Icon name="next" size={14} /><span className="text-ink">{one.name}</span></>)}
      </nav>
      <div className="mb-8 flex items-end justify-between gap-6">
        <h1 className="text-[length:var(--size-h1)] leading-tight text-ink">
          {one ? one.name : <T k="pages.shop.heading" />}
        </h1>
        <p data-testid="shop-count" className="shrink-0 pb-1 text-sm text-ink-soft">
          <span className="font-bold tabular-nums text-ink">{total}</span>{" "}<T k="pages.shop.count" />
        </p>
      </div>
      {t.q && (
        <p className="mb-6 text-sm text-ink-soft"><T k="pages.shop.searching" />{" "}<span className="font-medium text-ink">“{t.q}”</span></p>
      )}
      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        <FilterRail
          className="lg:w-52 lg:shrink-0"
          clear={<T k="pages.shop.clear" />}
          groups={[{ key: "category", label: <T k="pages.shop.filter_department" />, options: departments.map((d) => [d.id, d.name] as const) }]}
        />
        <div className="min-w-0 flex-1">
          {items.length === 0 ? (
            <div className="rounded bg-surface px-6 py-16 text-center">
              <T k="pages.shop.empty" as="p" className="text-ink-soft" />
              <button type="button" onClick={t.clear} data-testid="shop-clear"
                className="mt-5 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-ink">
                <T k="pages.shop.clear" />
              </button>
            </div>
          ) : (
            <Grid max={3}>
              {items.map((p) => <ProductCard key={p.id} product={p} />)}
            </Grid>
          )}
          {pages > 1 && (
            <nav aria-label="Pages" className="mt-12 flex items-center justify-center gap-4 text-sm">
              <button type="button" disabled={page <= 1} onClick={() => t.setPage(page - 1)}
                className="rounded-full bg-surface px-5 py-2 font-medium text-ink disabled:text-ink-soft">
                <T k="pages.shop.previous" />
              </button>
              <span className="tabular-nums text-ink-soft">{page} / {pages}</span>
              <button type="button" disabled={page >= pages} onClick={() => t.setPage(page + 1)}
                className="rounded-full bg-surface px-5 py-2 font-medium text-ink disabled:text-ink-soft">
                <T k="pages.shop.next" />
              </button>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
