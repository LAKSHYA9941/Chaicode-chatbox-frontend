/**
 * Background Beams - Aceternity UI animated background component
 * Creates beautiful animated beam effects for modern UI
 */
"use client";
import { cn } from "@/lib/utils";
import React from "react";

export const BackgroundBeams = ({ className }) => {
  const paths = [
    "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
    "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
    "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
    "M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851",
    "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
    "M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835",
  ];
  
  return (
    <div
      className={cn(
        "absolute inset-0 h-full w-full bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900",
        className
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        width="100%"
        height="100%"
        viewBox="-1200 -1200 3600 3600"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <g clipPath="url(#clip)" transform="scale(1.8)">
          {paths.map((path, index) => (
            <path
              key={index}
              d={path}
              stroke={`url(#gradient-${index})`}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              className="animate-pulse"
              style={{
                // deterministic values to avoid SSR hydration mismatches
                animationDelay: `${index * 0.7 + 1}s`,
                animationDuration: `${index * 2 + 12}s`
              }}
            />
          ))}
        </g>
        <defs>
          {paths.map((_, index) => (
            <linearGradient
              key={index}
              id={`gradient-${index}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#FF6500" stopOpacity="0" />
              <stop offset="50%" stopColor="#FF6500" stopOpacity="1" />
              <stop offset="100%" stopColor="#1E3E62" stopOpacity="0" />
            </linearGradient>
          ))}
          <clipPath id="clip">
            <rect x="-1200" y="-1200" width="3600" height="3600" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};
