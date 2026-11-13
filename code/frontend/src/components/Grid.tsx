import { Children, isValidElement, type ReactNode } from "react";

/**
 * A grid of like things — products, categories, branches, the team — that
 * never leaves a hole in its last row.
 *
 * Five cards in three columns left one row of three and one of two with a
 * gap where the sixth would be. <Grid> picks the column count from how many
 * items there are (`columnsFor`: a count that fills every row if one fits,
 * else the one whose last row is fullest) and centres whatever last row is
 * left, so it reads as intended:
 *
 *   <Grid max={4}>{items.map((p) => <ProductCard key={p.id} … />)}</Grid>
 *
 * The count is the children shown (items.length, not the total); pass
 * `count` only when it differs.
 * Phones get `phone` columns (2 for products, 1 for wider cards), tablets
 * from 640px at most 3. `max` goes to 6 for a dense catalogue row. One card
 * size and one picture ratio per grid.
 */
export default function Grid({ count, max = 4, phone = 2, className = "", children }: {
  count?: number;
  /** How many across at most: 5 and 6 are a dense catalogue row, desktop only. */
  max?: 2 | 3 | 4 | 5 | 6;
  phone?: 1 | 2;
  className?: string;
  children: ReactNode;
}) {
  const cells = Children.toArray(children);
  const n = count ?? cells.length;
  const desk = columnsFor(n, max);
  const tablet = columnsFor(n, Math.min(max, 3) as 2 | 3) as 1 | 2 | 3;
  return (
    <div className={`flex flex-wrap justify-center gap-[var(--space-6)] ${className}`}>
      {/* Each child is wrapped so its width is the grid's, whatever it renders. */}
      {cells.map((child, i) => (
        <div key={isValidElement(child) && child.key != null ? child.key : i} className={cell(phone, tablet, desk)}>{child}</div>
      ))}
    </div>
  );
}

/**
 * The columns for `count` items, at most `max`: few items take `max` columns
 * and are centred; otherwise the count from `max` down to `max - 1` that fills
 * every row, or else the one whose last row is fullest. 5 → 3 (3 + 2),
 * 6 → 3, 7 → 4 (4 + 3), 8 → 4, 9 → 3; with max 5, ten make two rows of five
 * and twelve make three of four. For a CSS grid of your own, use it with the
 * classes in COLS.
 */
export function columnsFor(count: number, max: Columns = 4): 1 | Columns {
  if (count <= max) return max;
  const options = max > 2 ? [max, max - 1] : [max];
  const fills = options.find((c) => count % c === 0);
  if (fills) return fills as Columns;
  return options.reduce((best, c) => (count % c > count % best ? c : best)) as Columns;
}

/**
 * How many across at most. Five and six are for a DENSE catalogue — a
 * marketplace row read by name and price — and only from 1024px: a tablet
 * still gets three and a phone two, because a card a sixth of a phone wide is
 * a thumbnail with no room for its name.
 */
export type Columns = 2 | 3 | 4 | 5 | 6;

// Written out whole so Tailwind finds every class in the source.
const PHONE = { 1: "basis-full", 2: "basis-[calc((100%_-_var(--space-6))/2)]" } as const;
const TABLET = {
  1: "sm:basis-full",
  2: "sm:basis-[calc((100%_-_var(--space-6))/2)]",
  3: "sm:basis-[calc((100%_-_2*var(--space-6))/3)]",
  4: "sm:basis-[calc((100%_-_3*var(--space-6))/4)]",
} as const;
const DESK = {
  1: "lg:basis-full",
  2: "lg:basis-[calc((100%_-_var(--space-6))/2)]",
  3: "lg:basis-[calc((100%_-_2*var(--space-6))/3)]",
  4: "lg:basis-[calc((100%_-_3*var(--space-6))/4)]",
  5: "lg:basis-[calc((100%_-_4*var(--space-6))/5)]",
  6: "lg:basis-[calc((100%_-_5*var(--space-6))/6)]",
} as const;

/** Grid columns by count, for a CSS grid you write yourself: COLS[columnsFor(n, 4)]. */
export const COLS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
} as const;

function cell(phone: 1 | 2, tablet: 1 | 2 | 3, desk: 1 | Columns): string {
  return `min-w-0 grow-0 shrink-0 ${PHONE[phone]} ${TABLET[tablet]} ${DESK[desk]}`;
}
