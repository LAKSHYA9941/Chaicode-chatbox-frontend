/**
 * Input Components - Base Input + Floating Input
 * - Floating labels with animation
 * - Supports validation, errors, accessibility
 * - Clean Tailwind styling with shadcn style conventions
 */

"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-xl border border-white/15 bg-white/5 px-4 text-sm text-white/90 shadow-sm transition-all duration-200",
        "placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:border-cyan-300/40",
        "disabled:cursor-not-allowed disabled:opacity-60",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

// Floating Label Input
const FloatingInput = React.forwardRef(({ 
  className,
  type = "text",
  label,
  id,
  error,
  containerClassName,
  labelClassName,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  const placeholderText = props.placeholder ?? label ?? "";

  return (
    <div className={cn("flex flex-col gap-2", containerClassName)}>
      <Input
        type={type}
        id={inputId}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        placeholder={placeholderText}
        className={cn(
          "shadow-[0_12px_35px_-20px_rgba(34,211,238,0.55)] focus-visible:shadow-[0_16px_40px_-16px_rgba(34,211,238,0.65)]",
          error && "border-destructive/70 bg-destructive/10 focus-visible:ring-destructive focus-visible:border-destructive/60 focus-visible:shadow-none",
          className
        )}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
});
FloatingInput.displayName = "FloatingInput";

export { Input, FloatingInput };
