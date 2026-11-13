import { type ReactNode } from "react";
import { useTableQuery } from "../lib/table";

export interface FilterGroup {
  /** The record field it narrows by, and the name it takes in the address. */
  key: string;
  label: ReactNode;
  /** [value, label] — every value the list can be narrowed to. */
  options: readonly (readonly [string, ReactNode])[];
}

/**
 * What a catalogue is narrowed by, down the left of it: a group per question
 * — which kind, which size, which colour — each a list of boxes to tick.
 *
 * A catalogue of more than a screenful with nothing to narrow it by is a
 * list to scroll. The choices live in the address bar (src/lib/table.ts), so
 * "shirts in linen" is a link somebody can send and survives a refresh, and
 * the page reads them back with the same hook:
 *
 *   const t = useTableQuery({ size: 12 });
 *   const { items, total } = useCollection("products", {
 *     where: { category: t.list("category"), size: t.list("size") }, page: t.page, pageSize: t.size });
 *   <FilterRail groups={[{ key: "category", label: <T k="shop.filter.kind" />, options: kinds }]} />
 *
 * Below 1024px the groups fold behind their own headings, so a phone opens
 * on the goods and not on a screen of checkboxes.
 */
export default function FilterRail({ groups, clear = "Clear all", className = "" }: {
  groups: readonly FilterGroup[];
  clear?: ReactNode;
  className?: string;
}) {
  const t = useTableQuery();
  const shown = groups.filter((g) => g.options.length > 1);
  if (shown.length === 0) return null;
  return (
    <aside data-block="filters" className={`flex flex-col gap-6 text-sm ${className}`} aria-label="Filters">
      {shown.map((g) => {
        const on = t.list(g.key);
        const toggle = (v: string) => t.set(g.key, on.includes(v) ? on.filter((x) => x !== v) : [...on, v]);
        return (
          <details key={g.key} open className="group border-b border-line pb-5 lg:[&>summary]:pointer-events-none">
            <summary className="flex cursor-pointer list-none items-center justify-between pb-3 text-xs uppercase tracking-wider text-ink-soft">
              {g.label}
              {on.length > 0 && <span className="normal-case tracking-normal text-ink">{on.length}</span>}
            </summary>
            <ul className="flex flex-col gap-2.5">
              {g.options.map(([value, label]) => (
                <li key={value}>
                  <label className="flex cursor-pointer items-center gap-2.5 text-ink">
                    <input type="checkbox" checked={on.includes(value)} onChange={() => toggle(value)}
                      className="size-4 rounded-sm border border-field accent-[var(--accent)]" />
                    {label}
                  </label>
                </li>
              ))}
            </ul>
          </details>
        );
      })}
      {t.filtering && (
        <button type="button" onClick={t.clear} className="self-start text-ink-soft underline underline-offset-4 hover:text-ink">
          {clear}
        </button>
      )}
    </aside>
  );
}
