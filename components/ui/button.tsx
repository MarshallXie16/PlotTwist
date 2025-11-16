import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] text-[var(--text-inverse)] shadow hover:opacity-90 hover:shadow-lg transition-all hover:-translate-y-0.5",
        secondary:
          "bg-transparent text-[var(--brand-primary)] border-2 border-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-[var(--text-inverse)] transition-all",
        ghost:
          "text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-all",
        destructive:
          "bg-[var(--color-error)] text-[var(--text-inverse)] shadow-sm hover:opacity-90",
        outline:
          "border border-[var(--border-secondary)] bg-transparent shadow-sm hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]",
        link:
          "text-[var(--brand-primary)] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
