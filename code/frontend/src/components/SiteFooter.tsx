import { Link } from "react-router-dom";
import { T } from "../editable";
import { useCollection } from "../data";
import type { Department } from "../lib/shop";
import PhotoCredits from "./PhotoCredits";
import Script from "./Script";

/**
 * THE FOOTER: three short columns under a hairline, the small print, and
 * then ONE WORD SET ENORMOUS — the heavy capitals in the deep green, as wide
 * as the page, cut off by its bottom edge, with the handwritten words across
 * it. It is how this page ends.
 *
 * ONE word, of about nine letters or fewer (`footer.word`): the size is set
 * so that nine letters fill the width, and a longer one runs off both sides.
 * The business's name when it is short; otherwise its one word.
 */
export default function SiteFooter() {
  const departments = useCollection<Department>("categories", { pageSize: 24 }).items;
  const col = "mb-3 font-display text-sm uppercase text-ink-soft";
  return (
    <footer className="mt-20 overflow-hidden text-ink">
      <div className="mx-auto max-w-page px-[var(--gutter)]">
        <div className="flex flex-col gap-10 border-t border-line py-10 text-sm lg:flex-row lg:gap-16">
          {departments.length > 0 && (
            <nav aria-label="Flavours" className="lg:w-4/12">
              <T k="footer.departments" as="p" className={col} />
              <ul className="flex flex-col gap-2">
                {departments.map((d) => (
                  <li key={d.id}><Link to={`/shop?category=${d.id}`} className="underline-offset-4 hover:underline">{d.name}</Link></li>
                ))}
              </ul>
            </nav>
          )}
          <nav aria-label="Help" className="lg:w-4/12">
            <T k="footer.help" as="p" className={col} />
            <ul className="flex flex-col gap-2">
              <li><Link to="/contact" className="underline-offset-4 hover:underline"><T k="footer.contact" /></Link></li>
              <li><Link to="/bag" className="underline-offset-4 hover:underline"><T k="footer.bag" /></Link></li>
              <li><Link to="/admin" className="underline-offset-4 hover:underline"><T k="footer.admin" /></Link></li>
            </ul>
          </nav>
          <T k="footer.line" as="p" className="max-w-[34ch] leading-relaxed text-ink-soft lg:ml-auto lg:w-4/12" />
        </div>
        <PhotoCredits className="border-t border-line py-5" />
      </div>
      <div aria-hidden="true" className="relative">
        <T k="footer.word" as="p" data-drift="" className="-mb-[0.17em] whitespace-nowrap text-center font-display text-[clamp(5rem,21vw,24rem)] uppercase leading-[0.85] text-ink" />
        <p className="absolute right-[14%] top-0 text-[clamp(2.25rem,4.5vw,5rem)]"><Script alone k="footer.script" className="translate-x-0 -translate-y-[0.3em]" /></p>
      </div>
    </footer>
  );
}
