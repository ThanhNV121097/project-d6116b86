import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";

/**
 * THE HEAD OF EVERY ROW: a bold title at the left and a small "View all ›" at
 * the right, on one line, with no rule under it. It is the landmark a page of
 * sixty names is scanned by, which is why the title is the heaviest type on
 * the page after the banners.
 */
export default function SectionHead({ title, to, more, testid }: {
  title: ReactNode;
  /** Where "View all" goes. No link is drawn without it. */
  to?: string;
  more?: ReactNode;
  testid?: string;
}) {
  return (
    <div className="mb-6 flex items-baseline justify-between gap-6">
      <h2 className="text-[length:var(--size-h2)] leading-tight text-ink">{title}</h2>
      {to && (
        <Link to={to} data-testid={testid}
          className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent hover:underline">
          {more}<Icon name="next" size={16} />
        </Link>
      )}
    </div>
  );
}
