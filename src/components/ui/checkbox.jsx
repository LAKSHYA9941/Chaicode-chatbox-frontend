/**
 * Checkbox Component - Simple checkbox for Remember Me functionality
 * Built without external dependencies for better compatibility
 */
"use client";
import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef(({ 
  className, 
  checked = false, 
  onCheckedChange,
  id,
  ...props 
}, ref) => {
  const handleChange = (e) => {
    if (onCheckedChange) {
      onCheckedChange(e.target.checked);
    }
  };

  return (
    <div className="relative">
      <input
        type="checkbox"
        id={id}
        ref={ref}
        checked={checked}
        onChange={handleChange}
        className="sr-only"
        {...props}
      />
      <label
        htmlFor={id}
        className={cn(
          "peer inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-sm border border-white/20 bg-transparent shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-sky-400/80 text-black" : "bg-white/10",
          className
        )}
      >
        {checked && <Check className="h-3 w-3" />}
      </label>
    </div>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
