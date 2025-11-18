"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Headphones, Zap, Code2, Rocket, Brain, Target } from "lucide-react";

export default function EpicHeroSection({
  selectedCourse = {
    name: "React"
  },
  className,
}) {
  const containerRef = useRef(null);

  const floatingIcons = useMemo(() => {
    const iconSequence = [Code2, Zap, Brain, Rocket, Target];
    const GOLDEN_ANGLE = 137.5 * (Math.PI / 180);

    return iconSequence.map((Icon, index) => {
      const angle = GOLDEN_ANGLE * index;
      const radialBase = 28 + index * 8;
      const jitterX = (Math.random() - 0.5) * 6;
      const jitterY = (Math.random() - 0.5) * 6;

      const projectedLeft = 50 + Math.cos(angle) * radialBase + jitterX;
      const projectedTop = 50 + Math.sin(angle) * (radialBase * 0.65) + jitterY;

      return {
        Icon,
        delay: 0.4 * index,
        duration: 18 + index * 1.2,
        left: Math.max(6, Math.min(94, projectedLeft)),
        top: Math.max(8, Math.min(88, projectedTop)),
        scale: 0.7 + Math.random() * 0.6,
      };
    });
  }, [selectedCourse.name]);

  const renderLetters = (text, keyPrefix, variant = "plain") =>
    text.split("").map((char, index) => (
      <span
        key={`${keyPrefix}-${index}`}
        data-hero-letter
        {...(variant === "gradient" ? { "data-hero-letter-main": "true" } : {})}
        className={cn(
          "inline-block will-change-transform",
          variant === "gradient"
            ? "text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-indigo-100 to-cyan-200"
            : "text-slate-50"
        )}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const letters = gsap.utils.toArray("[data-hero-letter]");
      gsap.set(letters, { yPercent: 120, opacity: 0, rotateX: -80 });
      gsap.set("[data-hero-glow]", { opacity: 0, scale: 0.75 });
      gsap.set("[data-cta-button]", { opacity: 0, y: 32 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        "[data-hero-container]",
        { opacity: 0, y: 48, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.9 }
      )
        .to("[data-hero-glow]", {
          opacity: 0.85,
          scale: 1.05,
          filter: "blur(28px)",
          duration: 1,
          ease: "power2.out",
        }, "-=0.5")
        .to(
          letters,
          {
            opacity: 1,
            rotateX: 0,
            yPercent: 0,
            stagger: 0.035,
            duration: 0.85,
          },
          "-=0.55"
        )
        .to(
          "[data-cta-button]",
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.25"
        );

      gsap.to("[data-hero-glow]", {
        scale: 1.08,
        opacity: 0.7,
        duration: 4.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.utils.toArray("[data-hero-letter-main]").forEach((el, index) => {
        gsap.to(el, {
          duration: 2.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.1 + index * 0.08,
          color: "#e0f2fe",
          filter: "drop-shadow(0 0 18px rgba(165, 243, 252, 0.35))",
        });
      });

      gsap.utils.toArray("[data-floating-icon]").forEach((el, index) => {
        const iconData = floatingIcons[index];
        if (!iconData) return;

        gsap.fromTo(
          el,
          { opacity: 0, scale: 0.4, rotate: -30 },
          {
            opacity: 0.22,
            scale: iconData.scale,
            rotate: 0,
            duration: 1.2,
            delay: 0.4 + index * 0.15,
            ease: "power3.out",
          }
        );

        gsap.to(el, {
          y: `+=${22 + index * 8}`,
          x: `+=${12 + index * 6}`,
          rotate: "+=14",
          duration: iconData.duration,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: iconData.delay,
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [floatingIcons, selectedCourse.name]);

  return (
    <>
      <div
        ref={containerRef}
        data-hero-container
        className={cn(
          "relative mx-auto h-full w-full overflow-hidden",
          "flex flex-col items-center gap-8 md:gap-10 px-4 py-8 sm:px-6 lg:py-12",
          className
        )}
      >


        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingIcons.map(({ Icon, left, top, scale }, idx) => (
            <div
              key={`hero-floating-icon-${idx}`}
              data-floating-icon
              className="absolute opacity-0"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Icon
                className="text-cyan-400/40"
                style={{
                  width: `${110 * scale}px`,
                  height: `${110 * scale}px`,
                }}
              />
            </div>
          ))}
        </div>



        {/* Main Headline */}
        <div className="relative max-w-4xl space-y-5 text-center">
          <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-black leading-[0.95] tracking-tight">
            <span className="block mb-2">
              {renderLetters("Master", "hero-top")}
            </span>
            <span className="relative inline-flex justify-center">
              <span
                data-hero-glow
                className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/40 via-indigo-400/30 to-cyan-400/40 blur-3xl"
                aria-hidden="true"
              />
              <span className="relative inline-flex flex-wrap justify-center gap-[0.05em]">
                {renderLetters(selectedCourse.name, "hero-course", "gradient")}
              </span>
            </span>
            <span className="block mt-2">
              {renderLetters("Like Never Before", "hero-bottom")}
            </span>
          </h1>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 z-10">
          <Button
            variant="outline"
            className="group relative px-6 py-4 text-base border border-cyan-500/40 bg-transparent hover:bg-cyan-500/10 rounded-2xl overflow-hidden"
            data-cta-button
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <span className="relative flex items-center gap-2 text-cyan-100">
              <Headphones className="h-5 w-5" />
              Ask questions using Voice Assistant
            </span>
          </Button>
        </div>
      </div>
    </>
  );
}