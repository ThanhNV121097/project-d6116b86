import { T, useContent, useList } from "../editable";
import { usePageMeta } from "../seo";
import { useCollection } from "../data";
import { Picture } from "../picture";
import { Marquee, Pin, SplitHeading } from "../motion";
import type { Note, Product } from "../lib/shop";
import Icon from "../components/Icon";
import Pill from "../components/Pill";
import ProductCard from "../components/ProductCard";
import Script from "../components/Script";
import SiteHeader from "../components/SiteHeader";

const head = "relative font-display text-[length:var(--size-h1)] uppercase leading-[0.95] text-ink";
const chip = "inline-flex items-center gap-2 self-start rounded-full border border-line bg-ground px-4 py-2 text-xs font-medium uppercase tracking-widest text-ink";

/**
 * THE HOME PAGE, in the order the owner's template has it: one sunlit
 * photograph of juice being enjoyed with SQUEEZED set across it and the first
 * two bottles floated over its corners; the bottles as a row that holds the
 * screen while it passes; a lime band of what goes into them; the handling
 * notes on the pale band; a second photograph that sends people to the shop;
 * and a line that sends them to write.
 */
export default function Home() {
  usePageMeta("pages.home.title", "pages.home.description");
  const products = useCollection<Product>("products", { where: { status: "live" }, pageSize: 12 }).items;
  const ingredients = [...new Set(products.flatMap((p) => p.ingredients ?? []))];
  const bandLabel = useContent("home.band.label");
  // The first two bottles are on the hero's cards; the row carries the rest.
  const row = products.slice(2);
  return (
    <>
      <Hero lead={products.slice(0, 2)} />

      {row.length > 0 && (
        <section className="pt-16 lg:pt-6">
          <Pin heading={
            <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col">
                <p className={`mb-6 ${chip}`}><Icon name="fresh" size={14} /><T k="home.range.chip" /></p>
                <h2 className={`max-w-[19ch] ${head}`}><T k="home.range.title" /><Script k="home.range.script" /></h2>
              </div>
              <Pill to="/shop" testid="range-all"><T k="home.range.cta" /></Pill>
            </div>
          }>
            {row.map((p) => (
              <div key={p.id} className="w-[72vw] sm:w-[19rem]"><ProductCard product={p} /></div>
            ))}
          </Pin>
        </section>
      )}

      {ingredients.length > 0 && (
        <section aria-label={bandLabel} className="mx-[calc(var(--gutter)*-1)] mt-16 bg-accent py-5 text-accent-ink lg:mt-10">
          <Marquee className="font-display text-[clamp(2rem,4vw,3.5rem)] uppercase leading-none">
            {ingredients.map((w) => (
              <span key={w} className="inline-flex items-center gap-14">{w}<Icon name="fresh" size={28} /></span>
            ))}
          </Marquee>
        </section>
      )}

      <Notes />
      <Ask />

      <section className="flex flex-col gap-6 pt-16 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="relative font-display text-[length:var(--size-h2)] uppercase leading-none text-ink"><T k="home.write.title" /><Script k="home.write.script" /></h2>
        <Pill to="/contact" testid="write" glyph="chat"><T k="home.write.cta" /></Pill>
      </section>
    </>
  );
}

/** The hero: the photograph, the ghosted word across its foot rising word by
 *  word and drifting with the scroll, the script over it, the header as glass
 *  across its top, and the first two bottles as cards over its corners. */
function Hero({ lead }: { lead: Product[] }) {
  const image = useContent("hero.image");
  const alt = useContent("hero.alt");
  const headline = useContent("hero.headline");
  return (
    <section className="relative mx-[calc(var(--gutter)*-1)] bg-[var(--photo-deep)] text-[var(--on-photo)]">
      <div className="relative min-h-[30rem] overflow-hidden lg:h-[44rem]">
        {image && <Picture src={image} alt={alt} loading="eager" motion="parallax" width={1600} height={900} className="absolute inset-0 h-full w-full object-cover" />}
        {/* THE GHOSTED WORD is the page's heading: as wide as the page, cut
            off by the picture's foot, pale enough that the photograph reads
            through it. Read aloud, it is the whole headline. */}
        <h1 aria-label={headline} data-drift=""
          className="absolute inset-x-0 -bottom-[0.16em] text-center font-display text-[clamp(6rem,23vw,25rem)] uppercase leading-[0.85] opacity-80 [text-shadow:0_0_2px_var(--scrim),0_2px_30px_var(--scrim)]">
          <SplitHeading k="hero.word" as="span" className="block whitespace-nowrap" />
        </h1>
        <p className="absolute inset-x-0 bottom-[36%] text-center text-[clamp(2.5rem,5vw,5rem)]"><Script alone onPhoto k="hero.script" className="translate-x-0" /></p>
      </div>
      <SiteHeader over />
      {lead.length > 0 && (
        <div className="flex gap-3 bg-ground p-3 lg:contents">
          {lead.map((p, i) => (
            <div key={p.id} data-tilt="" className={`min-w-0 flex-1 lg:absolute lg:bottom-10 lg:w-56 ${i === 0 ? "lg:left-[calc(var(--gutter)+2rem)]" : "lg:right-[calc(var(--gutter)+2rem)]"}`}>
              <ProductCard product={p} floating />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * THE NOTES, on the pale band: three white cards, each a photograph, a lime
 * quote mark and two lines. They are the shop's own handling notes — there
 * are no reviews yet, and a card naming a customer nobody can find is a lie
 * with an avatar. With real reviews, each card takes the reviewer's name.
 */
function Notes() {
  const notes = useList<Note>("home.notes.items");
  if (notes.length === 0) return null;
  return (
    <section className="mx-[calc(var(--gutter)*-1)] bg-surface px-[var(--gutter)] py-16 lg:py-20">
      <div className="mb-12 flex flex-col gap-6">
        <p className={chip}><Icon name="info" size={14} /><T k="home.notes.chip" /></p>
        <h2 className={`max-w-[18ch] ${head}`}><T k="home.notes.title" /><Script k="home.notes.script" /></h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {notes.slice(0, 3).map((n, i) => (
          <figure key={n.line} className="flex flex-col overflow-hidden rounded bg-ground p-2 shadow-[var(--shadow-sm)]">
            {n.image && <Picture src={n.image} alt="" width={800} height={600} className="aspect-[4/3] w-full rounded-[var(--radius-sm)] object-cover" />}
            <blockquote className="flex gap-3 p-4">
              <Icon name="quote" size={22} className="shrink-0 fill-current text-accent" />
              <div>
                {n.title && <T k={`home.notes.items.${i}.title`} as="p" className="font-display text-xl uppercase leading-tight text-ink" />}
                <T k={`home.notes.items.${i}.line`} as="p" className="mt-1 text-[0.9375rem] leading-snug text-ink-soft" />
              </div>
            </blockquote>
            {n.name && (
              <figcaption className="mx-4 mt-auto border-t border-line py-4">
                <T k={`home.notes.items.${i}.name`} as="span" className="font-display text-sm uppercase text-ink" />
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}

/** The second photograph: one question in the heavy capitals at its top
 *  left, growing as it passes, and the lime pill at its bottom right. */
function Ask() {
  const image = useContent("home.ask.image");
  return (
    <section className="relative mx-[calc(var(--gutter)*-1)] flex min-h-[26rem] flex-col justify-between gap-10 overflow-hidden bg-[var(--photo-deep)] p-[var(--gutter)] text-[var(--on-photo)] lg:h-[34rem] lg:py-14">
      {image && <Picture src={image} alt="" width={1600} height={900} motion="zoom" className="absolute inset-0 h-full w-full object-cover" />}
      <span className="absolute inset-0 bg-[linear-gradient(120deg,var(--scrim),transparent_60%)]" />
      <h2 className="relative max-w-[24ch] font-display text-[length:var(--size-h1)] uppercase leading-[0.95]"><T k="home.ask.title" /><Script onPhoto k="home.ask.script" /></h2>
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <T k="home.ask.line" as="p" className="max-w-[40ch] text-sm leading-relaxed" />
        <Pill to="/shop" testid="ask-cta"><T k="home.ask.cta" /></Pill>
      </div>
    </section>
  );
}
