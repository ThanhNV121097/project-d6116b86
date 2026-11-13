import { type ReactNode } from "react";

/**
 * What a thing is made of and comes in, as a short table rather than a
 * sentence: fabric, sizes, weight, origin, care.
 *
 * A description answers "what is it like"; this answers the questions a
 * buyer asks next and scans for. Written as prose they are a paragraph
 * nobody reads twice; as label and value they are found in a glance.
 *
 *   <SpecList items={[["Fabric", shirt.fabric], ["Sizes", shirt.sizes.join(", ")], ["Care", shirt.care]]} />
 *
 * A row whose value is empty is not drawn — the record's own fields decide
 * what is here, and a label with nothing beside it is a hole.
 */
export default function SpecList({ items, className = "" }: {
  items: readonly (readonly [ReactNode, ReactNode])[];
  className?: string;
}) {
  const rows = items.filter(([, value]) => value !== null && value !== undefined && value !== "" && value !== false);
  if (rows.length === 0) return null;
  return (
    <dl data-block="specification" className={`grid grid-cols-[minmax(7rem,auto)_1fr] text-sm ${className}`}>
      {rows.map(([label, value], i) => (
        <div key={i} className="contents">
          <dt className="border-t border-line py-3 pr-6 text-ink-soft">{label}</dt>
          <dd className="border-t border-line py-3 text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
