import Link from "next/link";
import { SiteSettings } from "@/lib/settings";
import { Phone, Mail, MapPin, Clock, ArrowUpRight } from "lucide-react";

interface FooterProps {
  settings: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const socialLinks = [
    { label: "TikTok", url: settings.socialTiktok },
    { label: "Instagram", url: settings.socialInstagram },
    { label: "Twitter / X", url: settings.socialTwitter },
    { label: "Facebook", url: settings.socialFacebook },
  ].filter(({ url }) => {
    if (!url?.trim()) return false;
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.pathname !== "/" && parsedUrl.pathname !== "";
    } catch {
      return false;
    }
  });

  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      {/* Top CTA Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
              Structural Precision & Engineering
            </span>
            <h3 className="mt-1 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to construct your next project with precision?
            </h3>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
              Discuss structural steel frameworks, commercial roofing, or full renovations with our qualified engineering team.
            </p>
          </div>
          <Link
            href="/request-a-quote"
            className="inline-flex items-center gap-2 rounded bg-amber-600 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-amber-600/20 hover:bg-amber-500 transition-all shrink-0"
          >
            <span>Request a Quote</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 shrink-0" aria-hidden="true" />
              <div>
                <span className="text-base font-bold text-white uppercase tracking-tight block">
                  {settings.companyName || "Tierytek Construction"}
                </span>
                <span className="text-[10px] text-amber-500 uppercase tracking-widest font-semibold block">
                  Steel & Construction Company
                </span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              {settings.footerText ||
                "Specializing in steel frameworks, commercial roofing, and renovation projects across Nigeria. We bring precision, safety, and innovation to every site."}
            </p>
            {socialLinks.length > 0 && (
              <nav aria-label="Social media" className="flex flex-wrap gap-x-4 gap-y-2 text-xs">
                {socialLinks.map(({ label, url }) => (
                  <a key={label} href={url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-amber-400 transition-colors">
                    {label}
                  </a>
                ))}
              </nav>
            )}
            <div className="pt-2">
              <Link
                href="/admin/login"
                className="text-[11px] text-slate-500 hover:text-slate-400 transition-colors"
              >
                Staff Portal
              </Link>
            </div>
          </div>

          {/* Core Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-slate-800 pb-2 mb-4">
              Core Capabilities
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/services/steel-construction" className="hover:text-amber-400 transition-colors">
                  Structural Steel Construction
                </Link>
              </li>
              <li>
                <Link href="/services/roofing-solutions" className="hover:text-amber-400 transition-colors">
                  Industrial & Commercial Roofing
                </Link>
              </li>
              <li>
                <Link href="/services/renovation" className="hover:text-amber-400 transition-colors">
                  Renovation & Structural Retrofitting
                </Link>
              </li>
              <li>
                <Link href="/services/structural-engineering" className="hover:text-amber-400 transition-colors">
                  Structural Engineering & Audits
                </Link>
              </li>
              <li>
                <Link href="/services/architectural-design" className="hover:text-amber-400 transition-colors">
                  Architectural & Structural Drafting
                </Link>
              </li>
              <li>
                <Link href="/services/logistics-supply" className="hover:text-amber-400 transition-colors">
                  Steel Logistics & Procurement
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-slate-800 pb-2 mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  About Tierytek
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-amber-400 transition-colors">
                  Projects & Case Studies
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-amber-400 transition-colors">
                  Workmanship Gallery
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-amber-400 transition-colors">
                  News & Construction Updates
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  Contact & Consultations
                </Link>
              </li>
              <li>
                <Link href="/request-a-quote" className="hover:text-amber-400 transition-colors">
                  Request a Formal Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-slate-800 pb-2 mb-4">
              Contact & Location
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{settings.address || "Lagos, Nigeria"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-amber-400 transition-colors">
                  {settings.phone || "+234 800 000 0000"}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-amber-500 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-amber-400 transition-colors">
                  {settings.email || "info@tierytek.com"}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{settings.businessHours || "Monday - Friday: 8:00 AM - 5:00 PM"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar with discrete credit */}
      <div className="border-t border-slate-900 bg-slate-950 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            © {currentYear} {settings.companyName || "Tierytek Construction"}. {settings.copyrightText || "All rights reserved."}
          </p>
          <a
            href="https://www.gexanova.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-slate-600 transition-colors hover:text-amber-400"
          >
            Built by GEXANOVA Innovation Limited
          </a>
        </div>
      </div>
    </footer>
  );
}
