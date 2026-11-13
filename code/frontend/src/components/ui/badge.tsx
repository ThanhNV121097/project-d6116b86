// VENDORED from shadcn/ui (new-york-v4) by scripts/vendor-shadcn.py — MIT, see
// LICENSE.md beside this file. Do not edit by hand: change the script and run
// it again, or the next update silently undoes the edit. What the script
// changes is in its own header: this scaffold's token names, no second mode,
// and the dashboard scope on everything Radix portals.
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/cn"
import { Slot } from "radix-ui"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-accent focus-visible:ring-[3px] focus-visible:ring-accent/50 aria-invalid:border-danger aria-invalid:ring-danger/20 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-ink [a&]:hover:bg-accent/90",
        secondary:
          "bg-wash text-ink [a&]:hover:bg-wash/90",
        destructive:
          "bg-danger text-white focus-visible:ring-danger/20 [a&]:hover:bg-danger/90",
        outline:
          "border-line text-ink [a&]:hover:bg-wash [a&]:hover:text-ink",
        ghost: "[a&]:hover:bg-wash [a&]:hover:text-ink",
        link: "text-accent underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
