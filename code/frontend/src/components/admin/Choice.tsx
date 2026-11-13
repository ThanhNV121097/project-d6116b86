import { cn } from "../../lib/cn";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

/**
 * ONE CHOICE FROM A LIST, in the management area.
 *
 * shadcn/ui's Select (Radix) with the one thing a list of records needs that
 * Radix refuses: an option that means NOTHING CHOSEN. Radix reserves the
 * empty string for "show the placeholder", so a filter's "All" and a form's
 * "None" cannot be an item whose value is "". They are carried as a sentinel
 * here and turned back into "" on the way out, so every caller keeps the
 * plain rule the rest of this scaffold uses — an empty value filters nothing.
 *
 * The public site's own <Select> (src/components/Select.tsx) is a different
 * component on purpose: it takes the SITE's palette and never portals. This
 * one is the management area's, and its list is rendered through a portal
 * that carries [data-dashboard] with it.
 */
const NONE = "__none__";

export default function Choice({ value, onChange, options, none, placeholder = "Choose", className, size, ...rest }: {
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  /** The label of "nothing chosen" — "All", "None". Left out, there is none. */
  none?: string;
  placeholder?: string;
  className?: string;
  size?: "sm" | "default";
  "aria-label"?: string;
}) {
  return (
    <Select value={value === "" ? (none ? NONE : "") : value} onValueChange={(v) => onChange(v === NONE ? "" : v)}>
      <SelectTrigger size={size} aria-label={rest["aria-label"]} className={cn("w-full bg-surface font-normal", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {none && <SelectItem value={NONE}>{none}</SelectItem>}
        {options.filter((o) => o.value !== "").map((o) => (
          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
