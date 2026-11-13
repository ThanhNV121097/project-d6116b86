import { type ReactNode } from "react";
import Icon from "./Icon";
import Choice from "./admin/Choice";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

/**
 * The bar above a dashboard list: search, the filters, and a way out of them.
 *
 * Every list in a CMS is read through a question — "what is waiting for me",
 * "what did this supplier send last week", "which bookings are unpaid". A
 * table with no filters makes the person page through 137 rows to answer it.
 *
 *   <TableFilters onClear={t.filtering ? t.clear : undefined}>
 *     <SearchBox value={t.q} onChange={t.setQ} placeholder="Search products" />
 *     <FilterSelect label="Status" value={t.get("status")} onChange={(v) => t.set("status", v)}
 *       options={[["pending", "Awaiting review"], ["approved", "Approved"]]} />
 *     <DateRange label="Created" from={t.get("created_from")} to={t.get("created_to")}
 *       onChange={(from, to) => t.setRange("created", from, to)} />
 *   </TableFilters>
 *
 * The filters write themselves into the address bar (src/lib/table.ts), so
 * the question can be sent to somebody else as a link.
 */
export default function TableFilters({ children, onClear }: { children: ReactNode; onClear?: () => void }) {
  return (
    <div className="flex flex-wrap items-end gap-2" role="search">
      {children}
      {onClear && (
        <Button type="button" variant="ghost" size="sm" onClick={onClear} className="text-ink-soft">
          <Icon name="close" size={14} />
          Clear filters
        </Button>
      )}
    </div>
  );
}

/**
 * The controls of a filter bar, on the management kit (src/components/ui):
 * a search field with its glyph inside it, a list of choices whose "All" is
 * a real option, and a pair of date fields drawn by the kit rather than by
 * the operating system.
 */
export function SearchBox({ value, onChange, placeholder = "Search" }: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{placeholder}</span>
      <Icon name="search" size={16} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-soft" />
      <Input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-[16rem] max-w-full bg-surface pl-8"
      />
    </label>
  );
}

export function FilterSelect({ label, value, onChange, options, anyLabel }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** [value, label] pairs. */
  options: readonly (readonly [string, string])[];
  anyLabel?: string;
}) {
  return (
    <Choice
      size="sm"
      value={value}
      onChange={onChange}
      aria-label={label}
      // The filter says what it filters while nothing is chosen — "Status" —
      // and "All statuses" is the way back out of it.
      placeholder={label}
      none={anyLabel ?? `Any ${label.toLowerCase()}`}
      options={options.map(([v, text]) => ({ value: v, label: text }))}
      className="w-auto min-w-[9rem]"
    />
  );
}

export function DateRange({ label, from, to, onChange }: {
  label: string;
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
}) {
  return (
    <fieldset className="flex items-center gap-2 text-sm text-ink-soft">
      <legend className="sr-only">{label}</legend>
      <span aria-hidden="true">{label}</span>
      <Input type="date" value={from} onChange={(e) => onChange(e.target.value, to)} className="h-8 w-auto bg-surface" aria-label={`${label} from`} />
      <span aria-hidden="true">–</span>
      <Input type="date" value={to} onChange={(e) => onChange(from, e.target.value)} className="h-8 w-auto bg-surface" aria-label={`${label} to`} />
    </fieldset>
  );
}

/**
 * A record's state as a word with a mark beside it — awaiting review,
 * approved, rejected. The tone is the meaning, never the only carrier of it:
 * the word is always there, because a colour alone is unreadable to the
 * person who cannot see it and to the one printing the page.
 */
export function Badge({ tone = "neutral", children }: { tone?: "neutral" | "good" | "warn" | "bad"; children: ReactNode }) {
  const TONES = {
    neutral: "border-line text-ink-soft",
    good: "border-line text-ink",
    warn: "border-field text-ink",
    bad: "border-field text-ink-soft",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 rounded-[var(--radius-pill)] border px-2 py-0.5 text-xs ${TONES[tone]}`}>
      <span aria-hidden="true">{tone === "good" ? "●" : tone === "bad" ? "■" : tone === "warn" ? "◆" : "○"}</span>
      {children}
    </span>
  );
}
