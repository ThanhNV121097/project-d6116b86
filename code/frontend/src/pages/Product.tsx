import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { T } from "../editable";
import { usePageMeta } from "../seo";
import { useCollection, useRecord } from "../data";
import { addToCart } from "../lib/cart";
import { formatPrice } from "../lib/format";
import { picturesOf, type Department, type Policy, type Product as Item } from "../lib/shop";
import Icon from "../components/Icon";
import Pill from "../components/Pill";
import ProductCard from "../components/ProductCard";
import ProductGallery from "../components/ProductGallery";
import ProductTabs from "../components/ProductTabs";
import QuantityStepper from "../components/QuantityStepper";
import RelatedRow from "../components/RelatedRow";
import Script from "../components/Script";
import SpecList from "../components/SpecList";
import VariantPicker from "../components/VariantPicker";

const chip = "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wide";

/**
 * ONE BOTTLE, in the template's product order: the bottle photographed large
 * on its pale sky with its other pictures under it; at the right its kind and
 * size on chips, the name in the heavy capitals with a script line, the price
 * set large, how many, and the lime pill. Then what is in it on the pale band
 * — every ingredient a chip, the figures as a short table — then delivery and
 * cancelling in the owner's words, then other bottles.
 */
export default function Product() {
  const { id } = useParams();
  usePageMeta("pages.product.title", "pages.product.description");
  const { item, loading } = useRecord<Item>("products", id);
  const kinds = useCollection<Department>("categories", { pageSize: 24 }).items;
  const policies = useCollection<Policy>("policies", { pageSize: 10 }).items;
  const [option, setOption] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  if (!item) {
    if (loading) return <div className="min-h-[60vh]" />;
    return (
      <div className="flex flex-col items-start gap-6 py-24">
        <T k="pages.product.missing" as="h1" className="font-display text-[length:var(--size-h1)] uppercase leading-[0.95] text-ink" />
        <Pill to="/shop" glyph="back"><T k="pages.product.back" /></Pill>
      </div>
    );
  }
  const kind = kinds.find((d) => d.id === item.category);
  const options = item.options ?? [];
  const choice = option || options[0] || "";
  const ingredients = item.ingredients ?? [];
  const buy = () => {
    addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, variant: choice || undefined }, qty);
    setAdded(true);
  };
  return (
    <div className="pb-8 pt-6">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-ink-soft">
        <Link to="/shop" className="hover:text-ink"><T k="pages.shop.crumb" /></Link>
        {kind && (<><Icon name="next" size={14} /><Link to={`/shop?category=${kind.id}`} className="hover:text-ink">{kind.name}</Link></>)}
      </nav>

      <section className="flex flex-col gap-10 lg:flex-row lg:gap-14">
        <div className="lg:w-7/12">
          <ProductGallery images={picturesOf(item)} alt={item.name} aspect="1/1" />
        </div>
        <div data-record={`products:${item.id}`} className="flex flex-col gap-6 lg:w-5/12 lg:pt-2">
          <div className="flex flex-wrap gap-2">
            {kind && <Link to={`/shop?category=${kind.id}`} className={`${chip} bg-accent text-accent-ink`}><Icon name="fresh" size={13} />{kind.name}</Link>}
            {item.volume && <span className={`${chip} border border-line text-ink`}><Icon name="package" size={13} />{item.volume}</span>}
          </div>
          <h1 data-testid="product-name" className="relative font-display text-[length:var(--size-h1)] uppercase leading-[0.95] text-ink">
            {item.name}<Script k="pages.product.script" />
          </h1>
          {item.description && <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-soft">{item.description}</p>}
          <div className="flex items-end justify-between gap-6 border-y border-line py-5">
            <span data-testid="product-price" className="font-display text-[length:var(--size-h2)] leading-none tabular-nums text-ink">{formatPrice(item.price)}</span>
            {item.volume && <span className="pb-1 text-sm text-ink-soft"><T k="pages.product.per" />{" "}{item.volume}</span>}
          </div>
          <VariantPicker label={<T k="pages.product.option" />} options={options} value={choice} onChange={setOption} />
          <div className="flex flex-wrap items-center gap-4">
            <QuantityStepper value={qty} onChange={setQty} />
            <Pill onClick={buy} testid="product-add" glyph={added ? "check" : "bag"}>
              <T k={added ? "pages.product.added" : "pages.product.add"} />
            </Pill>
            {added && <Link to="/bag" className="text-sm font-medium text-ink underline underline-offset-4"><T k="pages.product.see_bag" /></Link>}
          </div>
          <ul className="flex flex-col gap-3 rounded bg-surface p-5 text-sm text-ink">
            <li className="flex items-center gap-3"><Icon name="fresh" size={18} /><T k="pages.product.pressed" /></li>
            {item.keeps && <li className="flex items-center gap-3"><Icon name="hours" size={18} /><span><T k="pages.product.keeps" />{" "}{item.keeps}</span></li>}
            <li className="flex items-center gap-3"><Icon name="secure" size={18} /><T k="pages.product.pay_online" /></li>
          </ul>
        </div>
      </section>

      {ingredients.length > 0 && (
        <section className="mx-[calc(var(--gutter)*-1)] mt-16 bg-surface px-[var(--gutter)] py-14 lg:py-20">
          <div className="flex flex-col gap-10 lg:flex-row">
            <h2 className="relative font-display text-[length:var(--size-h2)] uppercase leading-[0.95] text-ink lg:w-5/12">
              <T k="pages.product.inside" /><Script k="pages.product.inside_script" />
            </h2>
            <div className="lg:w-7/12">
              <ul className="flex flex-wrap gap-3">
                {ingredients.map((x) => (
                  <li key={x} className="inline-flex items-center gap-2 rounded-full bg-ground px-5 py-3 font-display text-xl uppercase leading-none text-ink shadow-[var(--shadow-sm)]">
                    <Icon name="fresh" size={18} />{x}
                  </li>
                ))}
              </ul>
              <SpecList className="mt-10 max-w-xl" items={[
                [<T key="k" k="pages.product.spec_kind" />, kind?.name],
                [<T key="v" k="pages.product.spec_volume" />, item.volume],
                [<T key="n" k="pages.product.spec_count" />, String(ingredients.length)],
                [<T key="e" k="pages.product.spec_keeps" />, item.keeps],
              ]} />
            </div>
          </div>
        </section>
      )}

      <ProductTabs className="mt-14" tabs={policies.map((p) => ({ label: p.title, content: p.body }))} />

      <RelatedRow<Item> collection="products" exclude={item.id} where={{ status: "live" }} max={3} className="mt-16"
        title={<h2 className="relative mb-8 font-display text-[length:var(--size-h2)] uppercase leading-[0.95] text-ink"><T k="pages.product.related" /><Script k="pages.product.related_script" /></h2>}>
        {(p) => <ProductCard product={p} />}
      </RelatedRow>
    </div>
  );
}
