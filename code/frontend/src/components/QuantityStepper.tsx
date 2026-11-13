import Icon from "./Icon";

/**
 * How many: a number between a minus and a plus, that cannot go below one or
 * above what there is.
 *
 *   <QuantityStepper value={qty} onChange={setQty} max={shirt.stock} />
 */
export default function QuantityStepper({ value, onChange, min = 1, max, className = "" }: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  const top = max ?? Number.POSITIVE_INFINITY;
  const step = (by: number) => onChange(Math.min(top, Math.max(min, value + by)));
  return (
    <div className={`inline-flex items-center rounded border border-line text-ink ${className}`} role="group" aria-label="Quantity">
      <button type="button" onClick={() => step(-1)} disabled={value <= min} aria-label="One fewer"
        className="p-2.5 disabled:text-ink-soft"><Icon name="minus" size={16} /></button>
      <span aria-live="polite" className="min-w-8 text-center text-sm tabular-nums">{value}</span>
      <button type="button" onClick={() => step(1)} disabled={value >= top} aria-label="One more"
        className="p-2.5 disabled:text-ink-soft"><Icon name="plus" size={16} /></button>
    </div>
  );
}
