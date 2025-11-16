import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-md border border-[var(--border-primary)] bg-[var(--bg-input)] px-3 py-2 text-base shadow-sm transition-colors",
          "placeholder:text-[var(--text-tertiary)]",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--border-focus)] focus-visible:border-[var(--border-focus)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "resize-vertical",
          "md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
