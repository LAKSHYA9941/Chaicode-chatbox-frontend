/**
 * AppShell - Main application layout wrapper
 * Provides consistent layout structure across all pages
 * Handles responsive design and theme management
 */
"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { BackgroundBeams } from "../aceternity/background-beams";

export const AppShell = ({ 
  children, 
  className,
  showBackground = true,
  ...props 
}) => {
  return (
    <div 
      className={cn(
        "min-h-screen bg-background text-foreground relative overflow-hidden",
        "before:absolute before:inset-0 before:-z-10 before:bg-[radial-gradient(circle_at_25%_20%,rgba(56,189,248,0.22),transparent_55%),radial-gradient(circle_at_80%_-10%,rgba(14,165,233,0.18),transparent_45%)]",
        "after:absolute after:inset-10 after:-z-20 after:rounded-[3rem] after:border after:border-cyan-500/10 after:bg-slate-950/40 after:blur-[120px]",
        className
      )}
      {...props}
    >
      {/* Animated Background */}
      {showBackground && <BackgroundBeams />}
      
      {/* Main Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

/**
 * Container - Responsive container component
 * Provides consistent max-width and padding across breakpoints
 */
export const Container = ({ 
  children, 
  className,
  size = "default",
  ...props 
}) => {
  const sizeClasses = {
    sm: "max-w-3xl",
    default: "max-w-7xl",
    lg: "max-w-[1400px]",
    full: "max-w-full"
  };

  return (
    <div 
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
