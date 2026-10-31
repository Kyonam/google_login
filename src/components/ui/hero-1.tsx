"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function Hero({
  eyebrow = "NEXT-GEN PRODUCTIVITY",
  title = "Build smarter tools\nfor modern teams",
  subtitle = "Streamline your workflow and boost productivity with intuitive solutions. Security, speed, and simplicity—all in one platform.",
  ctaLabel = "Get Started",
  ctaHref = "#",
}: HeroProps) {
  return (
    <section
      id="hero"
      className="relative mx-auto w-full min-h-screen pt-28 sm:pt-36 md:pt-40 pb-48 px-6 text-center md:px-8 overflow-hidden bg-white select-none"
    >
      {/* Background Subtle Grid with Radial Fade */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none opacity-50 h-[680px] w-full 
        bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] 
        bg-[size:5.5rem_4.5rem] 
        [mask-image:radial-gradient(ellipse_75%_50%_at_50%_20%,#000_50%,transparent_100%)]"
      />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Eyebrow Pill */}
        {eyebrow && (
          <a
            href={ctaHref}
            className="group mb-6 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-gray-200/90 bg-white/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-sm text-xs font-medium tracking-wider text-slate-600 uppercase transition-all hover:bg-white hover:border-gray-300"
          >
            <span>{eyebrow}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        )}

        {/* Title */}
        <h1 className="animate-fade-in font-bold tracking-[-0.035em] text-center leading-[1.06] text-5xl sm:text-6xl md:text-7xl lg:text-[5.6rem] max-w-5xl mx-auto py-2 text-black">
          {title.includes("\n") ? (
            title.split("\n").map((line, idx) => (
              <span key={idx} className="block">
                {line}
              </span>
            ))
          ) : (
            title
          )}
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in mt-6 mb-8 text-balance text-base sm:text-lg md:text-xl font-normal leading-relaxed text-slate-500 max-w-2xl mx-auto">
          {subtitle}
        </p>

        {/* CTA Button */}
        {ctaLabel && (
          <div className="flex justify-center z-30">
            <Button
              asChild
              className="h-11 px-8 rounded-lg bg-zinc-900 text-white font-medium text-sm sm:text-base hover:bg-zinc-800 shadow-[0_4px_12px_rgba(0,0,0,0.12)] border border-zinc-800 transition-all active:scale-95 cursor-pointer"
            >
              <a href={ctaHref}>{ctaLabel}</a>
            </Button>
          </div>
        )}
      </div>

      {/* Horizon Earth/Moon Curve Arc at Bottom */}
      <div
        className="pointer-events-none absolute left-1/2 bottom-[-320px] sm:bottom-[-380px] md:bottom-[-440px] lg:bottom-[-500px] 
        h-[520px] sm:h-[620px] md:h-[720px] lg:h-[820px] 
        w-[140%] sm:w-[130%] md:w-[120%] lg:w-[112%] 
        -translate-x-1/2 rounded-[100%] 
        bg-[radial-gradient(closest-side_at_50%_45%,#ffffff_76%,#18181b_93%,#000000_100%)] 
        shadow-[0_-25px_60px_rgba(0,0,0,0.38)] 
        animate-fade-up"
      />
    </section>
  );
}

export default Hero;
