"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const slides = [
  {
    title: "HOUSE RENOVATION",
    description: "Reliable steel, modern design, expert finishing.",
    action: "View Projects",
    href: "/projects",
    image: "/images/hero1.png",
    imageAlt: "Steel construction workers assembling a roof frame",
    style: "primary",
  },
  {
    title: "STEEL CONSTRUCTION EXPERTS",
    description: "Industrial-grade frameworks built to last.",
    action: "Our Services",
    href: "/services",
    image: "/images/hero2.png",
    imageAlt: "Construction workers fitting a structural steel frame",
    style: "outline",
  },
  {
    title: "QUALITY, SAFETY & DELIVERY.",
    description: "We build with precision and deliver on time, always.",
    action: "Get a Quote",
    href: "/request-a-quote",
    image: "/images/hero3.png",
    imageAlt: "Completed modern house renovation",
    style: "primary",
  },
];

export function HomeHeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 3500);
    return () => window.clearInterval(interval);
  }, [reducedMotion]);

  const goToSlide = (offset: number) => {
    setActiveSlide((current) => (current + offset + slides.length) % slides.length);
  };

  return (
    <section
      aria-label="Featured construction services"
      aria-roledescription="carousel"
      className="relative isolate h-[80svh] min-h-[480px] overflow-hidden border-b border-slate-800 md:h-[calc(100svh-4.25rem)] md:min-h-[560px]"
    >
      {slides.map((slide, index) => {
        const isActive = index === activeSlide;
        return (
          <div
            key={slide.title}
            aria-hidden={!isActive}
            className={`absolute inset-0 transition-opacity duration-800 ease-in-out motion-reduce:transition-none ${isActive ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <Image
              src={slide.image}
              alt={slide.imageAlt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/45" />
            <div className="absolute inset-0 flex items-center justify-center px-6 pb-10 text-center text-white sm:px-12">
              <div className={`max-w-[800px] transition-opacity duration-800 ease-in-out motion-reduce:transition-none ${isActive ? "opacity-100" : "opacity-0"}`}>
                <h1 className="text-[34px] font-extrabold leading-tight text-white sm:text-[42px] md:text-5xl">
                  {slide.title}
                </h1>
                <p className="mx-auto mt-4 max-w-[700px] text-base leading-relaxed text-white sm:text-lg">
                  {slide.description}
                </p>
                <Link
                  href={slide.href}
                  tabIndex={isActive ? 0 : -1}
                  className={`mt-6 inline-flex min-h-11 items-center justify-center rounded-md px-6 py-3 text-sm font-semibold text-white transition-colors ${slide.style === "outline" ? "border-2 border-white bg-transparent hover:bg-white hover:text-slate-950" : "bg-[#007bff] hover:bg-[#0069d9]"}`}
                >
                  {slide.action}
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => goToSlide(-1)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white transition-colors hover:bg-black/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-6"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => goToSlide(1)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white transition-colors hover:bg-black/65 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6"
      >
        <ArrowRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2" aria-label="Choose a slide">
        {slides.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            onClick={() => setActiveSlide(index)}
            aria-label={`Show slide ${index + 1}: ${slide.title}`}
            aria-current={index === activeSlide ? "true" : undefined}
            className={`h-2.5 rounded-full bg-white transition-[width,opacity] duration-300 ${index === activeSlide ? "w-7 opacity-100" : "w-2.5 opacity-70 hover:opacity-100"}`}
          />
        ))}
      </div>
    </section>
  );
}