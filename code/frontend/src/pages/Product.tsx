import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { T } from "../editable";
import { useCollection, useRecord } from "../data";
import { addToCart } from "../lib/cart";
import { formatPrice } from "../lib/format";
import { picturesOf, type Department, type Product as Item } from "../lib/shop";
import Icon from "../components/Icon";
import ProductCard from "../components/ProductCard";
import ProductGallery from "../components/ProductGallery";
import ProductTabs from "../components/ProductTabs";
import QuantityStepper from "../components/QuantityStepper";
import RelatedRow from "../components/RelatedRow";
import SaveButton from "../components/SaveButton";
import SpecList from "../components/SpecList";
import VariantPicker from "../components/VariantPicker";

/**
 * ONE PRODUCT, and everything somebody deciding about it asks: the pictures
 * at the left on the same pale tile as the cards, and at the right the name,
 * the one fact, the price with what it was, what is left, the choice, how
 * many, and the button. Under both, the longer answers on tabs, and a row of
 * five more from the same department.
 *
 * Each part draws nothing when the record gives it nothing — a product with
 * no options has no chooser, one with no care note has no Care tab — so what
 * is on this page is decided in src/data and never left as an empty frame.
 */
export default function Product() {
  const { id } = useParams();
  const { item } = useRecord<Item>("products", id);
  const departments = useCollection<Department>("categories", { pageSize: 24 }).items;
  const [option, setOption] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  if (!item) {
    return (
      <div className="flex flex-col items-start gap-6 py-24">
        <T k="pages.product.missing" as="h1" className="text-[length:var(--size-h1)] text-ink" />
        <Link to="/shop" className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-accent-ink"><T k="pages.product.back" /></Link>
      </div>
    );
  }
  const department = departments.find((d) => d.id === item.category);
  const options = item.options ?? [];
  const stock = item.stock ?? 0;
  const saving = item.was !== undefined && item.was > item.price ? item.was - item.price : 0;
  const choice = option || options[0] || "";
  const buy = () => {
    addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, variant: choice || undefined }, qty);
    setAdded(true);
  };
  return (
    <div className="py-8">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-ink-soft">
        <Link to="/shop" className="hover:text-ink"><T k="pages.shop.crumb" /></Link>
        {department && (<><Icon name="next" size={14} /><Link to={`/shop?category=${department.id}`} className="hover:text-ink">{department.name}</Link></>)}
      </nav>

      <section className="flex flex-col gap-10 lg:flex-row lg:gap-14">
        <div className="lg:w-7/12">
          <ProductGallery images={picturesOf(item)} alt={item.name} aspect="1/1" />
        </div>
        <div data-record={`products:${item.id}`} className="flex flex-col gap-6 lg:w-5/12">
          <div className="flex items-start justify-between gap-4">
            <h1 data-testid="product-name" className="text-[length:var(--size-h1)] leading-[1.1] text-ink">{item.name}</h1>
            <SaveButton id={item.id} name={item.name} className="mt-1 shrink-0 bg-surface" />
          </div>
          {item.fact && <p className="-mt-3 text-sm text-ink-soft">{item.fact}</p>}
          <div>
            <p className="flex items-baseline gap-3">
              <span className="text-3xl font-bold tabular-nums text-ink">{formatPrice(item.price)}</span>
              {saving > 0 && <span className="text-base tabular-nums text-ink-soft line-through">{formatPrice(item.was)}</span>}
            </p>
            {saving > 0 && (
              <p className="mt-2 inline-flex gap-1 rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-accent">
                <T k="pages.product.saved" /><span className="tabular-nums">{formatPrice(saving)}</span>
              </p>
            )}
          </div>
          <p className="flex items-center gap-2 text-sm text-ink">
            <Icon name={stock > 0 ? "done" : "alert"} size={18} className={stock > 0 ? "text-accent" : "text-danger"} />
            <T k={stock === 0 ? "pages.product.out" : stock < 10 ? "pages.product.low" : "pages.product.in_stock"} />
          </p>
          <VariantPicker label={<T k="pages.product.option" />} options={options} value={choice} onChange={setOption} />
          <div className="flex flex-wrap items-center gap-4">
            <QuantityStepper value={qty} onChange={setQty} max={stock > 0 ? stock : undefined} />
            <button type="button" onClick={buy} disabled={stock === 0} data-testid="product-add"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-7 py-3.5 font-medium text-accent-ink hover:opacity-90 disabled:opacity-50">
              <Icon name={added ? "check" : "cart"} size={18} />
              <T k={added ? "pages.product.added" : "pages.product.add"} />
            </button>
          </div>
          <ul className="flex flex-col gap-3 rounded bg-surface p-5 text-sm text-ink">
            <li className="flex items-center gap-3"><Icon name="shipping" size={18} className="text-ink-soft" /><T k="pages.product.delivery" /></li>
            <li className="flex items-center gap-3"><Icon name="returns" size={18} className="text-ink-soft" /><T k="pages.product.returns" /></li>
          </ul>
        </div>
      </section>

      <ProductTabs className="mt-14" tabs={[
        { label: <T k="pages.product.tab_about" />, content: item.description },
        { label: <T k="pages.product.tab_details" />, content: (
          <SpecList items={[
            [<T key="d" k="pages.product.spec_department" />, department?.name],
            [<T key="m" k="pages.product.spec_material" />, item.material],
            [<T key="o" k="pages.product.spec_options" />, options.join(", ")],
          ]} />
        ) },
        { label: <T k="pages.product.tab_care" />, content: item.care },
      ]} />

      <RelatedRow<Item> collection="products" exclude={item.id} where={{ category: item.category, status: "live" }} max={3} className="mt-14"
        title={<T k="pages.product.related" as="h2" className="mb-6 text-[length:var(--size-h2)] leading-tight text-ink" />}>
        {(p) => <ProductCard product={p} />}
      </RelatedRow>
    </div>
  );
}
