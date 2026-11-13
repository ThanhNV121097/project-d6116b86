import { type ReactNode } from "react";

export interface Variant {
  value: string;
  label?: ReactNode;
  /** Shown and not choosable: a size that is sold out. */
  unavailable?: boolean;
}

/**
 * One choice among a record's variants — a size, a colour, a weight — as a
 * row of chips that behaves as the radio group it is.
 *
 * Sizes drawn as four decorative chips that select nothing are a picture of
 * a control. This one holds the choice, says which is chosen to a screen
 * reader, and shows what cannot be had rather than hiding it: a size that is
 * sold out is information.
 *
 *   const [size, setSize] = useState("");
 *   <VariantPicker label={<T k="pages.product.size" />} options={shirt.sizes} value={size} onChange={setSize} />
 */
export default function VariantPicker({ label, options, value, onChange, className = "" }: {
  label: ReactNode;
  options: readonly (string | Variant)[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const list = options.map((o) => (typeof o === "string" ? { value: o } : o));
  if (list.length === 0) return null;
  return (
    <fieldset data-block="variants" className={`flex flex-col gap-2 ${className}`}>
      <legend className="mb-2 text-xs uppercase tracking-wider text-ink-soft">{label}</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup">
        {list.map((o) => {
          const on = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={on}
              disabled={o.unavailable}
              onClick={() => onChange(o.value)}
              className={`min-w-11 rounded border px-3 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:text-ink-soft disabled:line-through ${on ? "border-ink bg-ink text-ground" : "border-line text-ink hover:border-ink"}`}
            >
              {o.label ?? o.value}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
