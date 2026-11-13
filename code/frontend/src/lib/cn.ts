import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Class names, with the LAST word winning where two say the same thing.
 *
 * The management kit in src/components/ui is shadcn/ui, and every part of it
 * takes a `className` that has to be able to override its own defaults:
 * `<Button className="px-6">` must end with px-6, not with both paddings and
 * the stylesheet's order deciding. tailwind-merge is what resolves that.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
