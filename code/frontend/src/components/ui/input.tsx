// VENDORED from shadcn/ui (new-york-v4) by scripts/vendor-shadcn.py — MIT, see
// LICENSE.md beside this file. Do not edit by hand: change the script and run
// it again, or the next update silently undoes the edit. What the script
// changes is in its own header: this scaffold's token names, no second mode,
// and the dashboard scope on everything Radix portals.
import * as React from "react"
import { cn } from "../../lib/cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-md border border-field bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-accent selection:text-accent-ink file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-ink placeholder:text-ink-soft disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent/50",
        "aria-invalid:border-danger aria-invalid:ring-danger/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
