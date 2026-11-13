import { T, useContent } from "../editable";
import { usePageMeta } from "../seo";
import { useCollection } from "../data";
import { useTableQuery } from "../lib/table";
import { Picture } from "../picture";
import type { Department, Product } from "../lib/shop";
import Grid from "../components/Grid";
import Icon from "../components/Icon";
import Pill from "../components/Pill";
import ProductCard from "../components/ProductCard";
import Script from "../components/Script";

const chipBase = "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.8125rem] font-medium uppercase tracking-wide transition-colors";
const onPhotoText = "[text-shadow:0_1px_3px_var(--script-shadow),0_0_24px_var(--scrim)]";
const chipOn = "bg-accent text-accent-ink";
const chipOff = "bg-ground text-ink hover:bg-surface";

/**
 * THE JUICES. A photograph band of cut fruit carries the heading, how many
 * bottles there are, and the chips a juice buyer narrows by — the kind and
 * the bottle size — laid over it the way the template lays its chips on a
 * photograph. Under it the bottles three to a row on the same pale sky as
 * everywhere else, each card saying what is in it.
 *
 * The chips live in the address (useTableQuery): "greens, 250 ml" is a link
 * somebody can send, and coming back from a bottle lands on the same list.
 */
export default function Shop() {
  usePageMeta("pages.shop.title", "pages.shop.description");
  const t = useTableQuery({ size: 12 });
  const image = useContent("pages.shop.image");
  const groupLabel = useContent("pages.shop.filter_label");
  const kinds = useCollection<Department>("categories", { pageSize: 24 }).items;
  const everything = useCollection<Product>("products", { where: { status: "live" }, pageSize: 200 }).items;
  const sizes = [...new Set(everything.map((p) => p.volume).filter((v): v is string => Boolean(v)))].sort();
  const kind = t.list("category");
  const size = t.list("volume");
  const { items, total, hasMore, loadMore, loading } = useCollection<Product>("products", {
    where: { status: "live", category: kind.length > 0 ? kind : undefined, volume: size.length > 0 ? size : undefined },
    pageSize: 12,
  });
  const toggle = (name: string, value: string, chosen: string[]) =>
    t.set(name, chosen.includes(value) ? chosen.filter((v) => v !== value) : [...chosen, value]);
  const one = kind.length === 1 ? kinds.find((d) => d.id === kind[0]) : undefined;
  const nothing = kind.length + size.length === 0;
  return (
    <div className="pb-8">
      <section className="relative mx-[calc(var(--gutter)*-1)] mt-4 flex min-h-[17rem] flex-col justify-between gap-8 overflow-hidden bg-[var(--photo-deep)] px-[var(--gutter)] py-8 text-[var(--on-photo)] lg:h-[17rem]">
        {image && <Picture src={image} alt="" loading="eager" width={1600} height={900} motion="parallax" className="absolute inset-0 h-full w-full object-cover" />}
        <span className="absolute inset-0 bg-[linear-gradient(100deg,var(--scrim),transparent_75%)]" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h1 className={`relative font-display text-[length:var(--size-h1)] uppercase leading-[0.95] ${onPhotoText}`}>
            {one ? one.name : <T k="pages.shop.heading" />}<Script onPhoto k="pages.shop.script" />
          </h1>
          <p data-testid="shop-count" className="inline-flex shrink-0 items-baseline gap-2 self-start rounded-full bg-[var(--glass)] px-5 py-2 font-display text-2xl uppercase leading-none backdrop-blur-md sm:self-auto">
            <span data-count="" className="tabular-nums">{total}</span><T k="pages.shop.count" />
          </p>
        </div>
        <div role="group" aria-label={groupLabel} className="relative flex flex-wrap items-center gap-2">
          <button type="button" onClick={t.clear} data-testid="chip-all" aria-pressed={nothing} className={`${chipBase} ${nothing ? chipOn : chipOff}`}>
            <Icon name="grid" size={13} /><T k="pages.shop.all" />
          </button>
          {kinds.map((d) => {
            const on = kind.includes(d.id);
            return (
              <button key={d.id} type="button" onClick={() => toggle("category", d.id, kind)} data-testid={`chip-category-${d.id}`} aria-pressed={on}
                className={`${chipBase} ${on ? chipOn : chipOff}`}>
                <Icon name="fresh" size={13} />{d.name}
              </button>
            );
          })}
          {sizes.length > 1 && <span aria-hidden="true" className="mx-1 h-5 w-px bg-[var(--on-photo)] opacity-50" />}
          {sizes.length > 1 && sizes.map((v) => {
            const on = size.includes(v);
            return (
              <button key={v} type="button" onClick={() => toggle("volume", v, size)} data-testid={`chip-volume-${v.replace(/\s+/g, "")}`} aria-pressed={on}
                className={`${chipBase} ${on ? chipOn : chipOff}`}>
                <Icon name="package" size={13} />{v}
              </button>
            );
          })}
        </div>
      </section>

      <section className="pt-10">
        {items.length === 0 && !loading ? (
          <div className="flex flex-col items-start gap-6 rounded bg-surface px-8 py-14">
            <h2 className="font-display text-[length:var(--size-h2)] uppercase leading-none text-ink"><T k="pages.shop.empty" /></h2>
            <Pill onClick={t.clear} testid="shop-clear" glyph="close"><T k="pages.shop.clear" /></Pill>
          </div>
        ) : (
          <Grid count={items.length} max={3}>
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </Grid>
        )}
        {hasMore && (
          <div className="mt-10">
            <Pill onClick={loadMore} glyph="plus" testid="shop-more"><T k="pages.shop.more" /></Pill>
          </div>
        )}
      </section>
    </div>
  );
}
