"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Phone, ArrowRight } from "lucide-react";

interface NavbarProps {
  companyName: string;
  phone: string;
}

export function Navbar({ companyName, phone }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Projects", href: "/projects" },
    { name: "Gallery", href: "/gallery" },
    { name: "Insights", href: "/insights" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-800 bg-slate-950/95 backdrop-blur shadow-lg shadow-black/20"
          : "border-b border-slate-800/80 bg-slate-950/90 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-3.5">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/images/Logo-transparent.png"
            alt={`${companyName || "Tierytek"} logo`}
            unoptimized
            width={40}
            height={40}
            className="h-10 w-10 shrink-0 object-contain"
          />
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black tracking-tight text-white uppercase leading-tight group-hover:text-amber-400 transition-colors">
              {companyName || "Tierytek"}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-amber-500 font-semibold leading-none mt-0.5">
              Steel & Construction
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 text-xs xl:text-sm font-semibold tracking-wide uppercase transition-colors rounded ${
                  isActive
                    ? "text-amber-400 bg-slate-900 border border-slate-800"
                    : "text-slate-300 hover:text-white hover:bg-slate-900/60"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="hidden sm:flex items-center gap-4">
          {phone && (
            <a
              href={`tel:${phone}`}
              className="hidden xl:flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-amber-400 transition-colors border-r border-slate-800 pr-4"
            >
              <Phone className="h-3.5 w-3.5 text-amber-500" />
              <span>{phone}</span>
            </a>
          )}
          <Link
            href="/request-a-quote"
            className="inline-flex items-center gap-1.5 rounded bg-amber-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-amber-600/20 hover:bg-amber-500 transition-all hover:-translate-y-px"
          >
            <span>Request Quote</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            href="/request-a-quote"
            className="sm:hidden rounded bg-amber-600 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white"
          >
            Quote
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 py-6 shadow-2xl animate-in slide-in-from-top-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-semibold uppercase tracking-wider rounded ${
                    isActive
                      ? "bg-amber-500/10 text-amber-400 border-l-2 border-amber-500"
                      : "text-slate-300 hover:bg-slate-900 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 mt-2 border-t border-slate-800 flex flex-col gap-3">
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-amber-400"
                >
                  <Phone className="h-3.5 w-3.5 text-amber-500" />
                  <span>{phone}</span>
                </a>
              )}
              <Link
                href="/request-a-quote"
                className="w-full text-center rounded bg-amber-600 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-amber-500 transition-colors"
              >
                Request a Formal Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
