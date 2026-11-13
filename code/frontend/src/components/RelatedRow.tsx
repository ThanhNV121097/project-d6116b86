import { type ReactNode } from "react";
import Grid, { type Columns } from "./Grid";
import { useCollection, type Filter } from "../data";

/**
 * The way on from one record to the next: others like it, in a row.
 *
 * A record's page that ends at its own button is a dead end — the visitor
 * who did not want THIS shirt has to go back and start again. Every such
 * page ends with the nearest things to it.
 *
 *   <RelatedRow collection="products" exclude={shirt.id} where={{ category: shirt.category }}
 *     title={<T k="pages.product.related" as="h2" />}>
 *     {(p) => <ProductCard product={p} />}
 *   </RelatedRow>
 *
 * A FULL ROW, WHEN THE SHOP HAS ONE. `where` says what "like it" means — the
 * same kind — and a kind with three things in it gives two neighbours, which
 * a four-across grid then centres as two tiles in the middle of the page.
 * The rest of the row is topped up from the whole collection, nearest first,
 * so the row is full wherever there are enough records to fill it.
 *
 * It draws nothing at all when there is nothing else — no heading over an
 * empty row — and never the record itself.
 */
export default function RelatedRow<T extends { id: string }>({ collection, exclude, where, max = 4, title, children, className = "" }: {
  collection: string;
  /** The record whose page this is. */
  exclude?: string;
  where?: Record<string, Filter | undefined>;
  max?: Columns;
  title?: ReactNode;
  children: (row: T) => ReactNode;
  className?: string;
}) {
  const near = useCollection<T>(collection, { where, pageSize: max + 1 }).items;
  const any = useCollection<T>(collection, { pageSize: max * 2 + 1 }).items;
  const rows: T[] = [];
  for (const r of [...near, ...any]) {
    if (r.id !== exclude && rows.length < max && !rows.some((x) => x.id === r.id)) rows.push(r);
  }
  if (rows.length === 0) return null;
  return (
    <section data-block="related" className={`flex flex-col gap-[var(--space-8)] ${className}`}>
      {title}
      <Grid max={max}>
        {rows.map((row) => <div key={row.id}>{children(row)}</div>)}
      </Grid>
    </section>
  );
}
