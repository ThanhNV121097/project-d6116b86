import { useRef } from "react";
import { Link } from "react-router-dom";
import { T, useContent, useList } from "../editable";
import { usePageMeta } from "../seo";
import { useCollection } from "../data";
import { Picture } from "../picture";
import type { Note, Product } from "../lib/shop";
import Icon from "../components/Icon";
import ProductCard from "../components/ProductCard";
import Script from "../components/Script";
import SiteHeader from "../components/SiteHeader";

const pill = "inline-flex items-center gap-3 rounded-full bg-accent py-1.5 pl-6 pr-1.5 font-display text-sm uppercase leading-none text-accent-ink hover:opacity-90";
const pillDot = "grid h-9 w-9 place-items-center rounded-full bg-ground text-ink";
const head = "relative text-[length:var(--size-h1)] uppercase leading-[0.98] text-ink";

/**
 * THE HOME PAGE. One photograph of the thing being enjoyed fills the first
 * screen, with ONE WORD set enormous and half-transparent across its foot,
 * the header as a bar of glass over its top, and the first two things for
 * sale floated over its lower corners as small white cards.
 *
 * Then the range as a row of cards on sky; a pale band of notes; a second
 * photograph asking one question; a line that sends people to write; and the
 * footer, which ends on the name set as wide as the page.
 *
 * Every heading is the heavy capitals with a few handwritten words across
 * its end. A band with nothing in it is not drawn.
 */
export default function Home() {
  usePageMeta("pages.home.title", "pages.home.description");
  const products = useCollection<Product>("products", { where: { status: "live" }, pageSize: 9 }).items;
  const track = useRef<HTMLDivElement>(null);
  const slide = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth, behavior: "smooth" });
  const round = "grid h-14 w-14 place-items-center rounded-full border text-ink";
  return (
    <>
      <Hero lead={products.slice(0, 2)} />

      {products.length > 0 && (
        <section className="pt-16 lg:pt-20">
          <T k="home.range.chip" as="p" className="mb-8 inline-flex rounded-full border border-line px-4 py-2 text-xs font-medium uppercase tracking-widest text-ink" />
          <div className="mb-10 flex items-end justify-between gap-8">
            <h2 className={`max-w-[19ch] ${head}`}><T k="home.range.title" /><Script k="home.range.script" /></h2>
            {products.length > 3 && (
              <div className="hidden shrink-0 gap-3 lg:flex">
                <button type="button" aria-label="Back" onClick={() => slide(-1)} className={`${round} border-line`}><Icon name="back" size={22} /></button>
                <button type="button" aria-label="More" data-testid="range-next" onClick={() => slide(1)} className={`${round} border-[var(--accent)]`}><Icon name="next" size={22} /></button>
              </div>
            )}
          </div>
          <div ref={track} data-drag=""
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto [scrollbar-width:none] [&>*]:w-[78%] [&>*]:shrink-0 [&>*]:snap-start sm:[&>*]:w-[calc((100%_-_1.25rem)/2)] lg:[&>*]:w-[calc((100%_-_2.5rem)/3)]">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      <Notes />
      <Ask />

      <section className="flex flex-col gap-6 pt-16 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="relative text-[length:var(--size-h2)] uppercase leading-none text-ink"><T k="home.write.title" /><Script k="home.write.script" /></h2>
        <Link to="/contact" data-testid="write" data-magnetic="" className={pill}><T k="home.write.cta" /><span className={pillDot}><Icon name="arrow" size={16} /></span></Link>
      </section>
    </>
  );
}

/** The hero: the photograph, the ghosted word across its foot, the script
 *  over it, and the first two things for sale as cards over its corners. */
function Hero({ lead }: { lead: Product[] }) {
  const image = useContent("hero.image");
  return (
    <section className="relative mx-[calc(var(--gutter)*-1)] bg-[var(--photo-deep)] text-[var(--on-photo)]">
      <div className="relative min-h-[30rem] overflow-hidden lg:h-[44rem]">
        {image && <Picture src={image} alt="" loading="eager" motion="parallax" width={1600} height={900} className="absolute inset-0 h-full w-full object-cover" />}
        {/* NO VEIL OVER THIS PHOTOGRAPH. The look is a bright picture, and a
            scrim deep enough to carry type across it turned the first site
            built in this look grey-green from edge to edge. The header stands
            on its own glass and the script on its own shadow; the ghosted
            word is meant to let the picture through. */}
        <T k="hero.headline" as="h1" className="sr-only" />
        {/* THE GHOSTED WORD: as wide as the page, cut off by the picture's
            foot, and pale enough that the photograph reads through it. */}
        <T k="hero.word" as="p" aria-hidden="true" data-drift=""
          className="absolute inset-x-0 -bottom-[0.16em] whitespace-nowrap text-center font-display text-[clamp(6rem,23vw,25rem)] uppercase leading-[0.85] opacity-80" />
        <p className="absolute inset-x-0 bottom-[36%] text-center text-[clamp(2.5rem,5vw,5rem)]"><Script alone k="hero.script" className="translate-x-0 [text-shadow:0_0_3px_var(--script-shadow),0_0_10px_var(--script-shadow),0_0_26px_var(--script-shadow),0_2px_3px_var(--script-shadow)]" /></p>
      </div>
      <SiteHeader over />
      {lead.length > 0 && (
        <div className="flex gap-3 bg-ground p-3 lg:contents">
          {lead.map((p, i) => (
            <div key={p.id} className={`min-w-0 flex-1 lg:absolute lg:bottom-10 lg:w-56 ${i === 0 ? "lg:left-[calc(var(--gutter)+2rem)]" : "lg:right-[calc(var(--gutter)+2rem)]"}`}>
              <ProductCard product={p} floating />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/**
 * THE NOTES, on the pale band: up to three white cards, each a photograph
 * and a few lines under a large quote mark. They are the shop's own words
 * about what it sells — this system has nobody's reviews, and a card that
 * names a customer nobody can find is a lie with an avatar. With real
 * reviews, each card takes the reviewer's name under its lines.
 */
function Notes() {
  const notes = useList<Note>("home.notes.items");
  if (notes.length === 0) return null;
  return (
    <section className="mx-[calc(var(--gutter)*-1)] mt-20 bg-surface px-[var(--gutter)] py-16">
      <h2 className={`mx-auto mb-12 max-w-[19ch] text-center ${head}`}><T k="home.notes.title" /><Script k="home.notes.script" /></h2>
      <div className="flex flex-col gap-5 md:flex-row">
        {notes.slice(0, 3).map((n, i) => (
          <figure key={n.line} className="flex flex-1 flex-col overflow-hidden rounded bg-ground p-2 shadow-[var(--shadow-sm)]">
            {n.image && <Picture src={n.image} alt="" width={800} height={600} className="aspect-[6/5] w-full rounded-[var(--radius-sm)] object-cover" />}
            <blockquote className="flex gap-3 p-4">
              <Icon name="quote" size={22} className="shrink-0 fill-current text-accent" />
              <T k={`home.notes.items.${i}.line`} as="p" className="text-[0.9375rem] leading-snug text-ink" />
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
 *  left, and the lime pill at its bottom right. */
function Ask() {
  const image = useContent("home.ask.image");
  return (
    <section className="relative mx-[calc(var(--gutter)*-1)] flex min-h-[24rem] flex-col justify-between gap-10 overflow-hidden bg-[var(--photo-deep)] p-[var(--gutter)] text-[var(--on-photo)] lg:h-[32rem] lg:py-14">
      {image && <Picture src={image} alt="" width={1600} height={800} className="absolute inset-0 h-full w-full object-cover" />}
      <span className="absolute inset-0 bg-[linear-gradient(120deg,var(--scrim),transparent_60%)]" />
      <h2 className="relative max-w-[13ch] text-[length:var(--size-h1)] uppercase leading-[0.98]"><T k="home.ask.title" /><Script k="home.ask.script" /></h2>
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <T k="home.ask.line" as="p" className="max-w-[40ch] text-sm leading-relaxed" />
        <Link to="/shop" data-testid="ask-cta" data-magnetic="" className={pill}><T k="home.ask.cta" /><span className={pillDot}><Icon name="arrow" size={16} /></span></Link>
      </div>
    </section>
  );
}
