/**
 * Floating Navbar - Aceternity UI floating navigation component
 * Modern glassmorphism navbar with smooth animations
 */
"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const FloatingNav = ({
  navItems,
  className,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4 transition-all duration-200",
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full",
        className
      )}
    >
      {navItems?.map((navItem, idx) => (
        <Link
          key={`link=${idx}`}
          href={navItem.link}
          className={cn(
            "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
          )}
        >
          <span className="block sm:hidden">{navItem.icon}</span>
          <span className="hidden sm:block text-sm">{navItem.name}</span>
        </Link>
      ))}
    </div>
  );
};
