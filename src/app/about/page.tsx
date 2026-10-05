import { getSettings } from "@/lib/settings";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { ShieldCheck, HardHat, Compass, Layers, CheckCircle2, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Tierytek Construction",
  description:
    "Learn about Tierytek Construction, our precision engineering philosophy, commitment to structural safety, and verified construction capabilities in Nigeria.",
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Navbar companyName={settings.companyName || "Tierytek Construction"} phone={settings.phone || ""} />

      {/* Page Header */}
      <section className="border-b border-slate-800 bg-slate-900/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
              Company Overview
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Engineering Precision. Structural Durability.
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              At Tierytek Construction, we are passionate about building structures that stand the test of time. With verified expertise in steel construction, roofing, and renovation, we deliver projects that combine durability, safety, and modern design.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 sm:p-10 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                Our Mission
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Transforming Ideas Through Precision Engineering
              </h2>
              <p className="text-sm leading-relaxed text-slate-300">
                Our mission is simple: to transform ideas into reality through precision engineering, innovative solutions, and an unwavering commitment to excellence. From residential projects to large-scale commercial developments, we bring integrity and professionalism to every site.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 sm:p-10 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                Core Approach
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Engineered for Longevity & Structural Safety
              </h2>
              <p className="text-sm leading-relaxed text-slate-300">
                We believe that great construction begins with meticulous calculations, superior materials, and strict adherence to structural engineering standards. We do not cut corners, and we build every framework to withstand heavy operational demands and environmental stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Pillars */}
      <section className="py-20 border-b border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
              Why Tierytek
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
              The Foundations of Our Construction Practice
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-3">
              <div className="h-10 w-10 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <HardHat className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Experienced Engineers & Architects</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Qualified technical personnel supervising every phase from initial load calculations to final assembly.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-3">
              <div className="h-10 w-10 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Modern Equipment & Techniques</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Utilization of advanced steel fabrication techniques, laser alignment, and modern roofing solutions.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-3">
              <div className="h-10 w-10 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">Commitment to Safety & Quality</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero-compromise site safety standards protecting our workers, partners, and client investments.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-3">
              <div className="h-10 w-10 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white">On-Time Project Delivery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Transparent project scheduling, reliable procurement logistics, and proactive site supervision.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Work with a Professional Construction Team
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Whether you are planning a new industrial steel structure, commercial roofing installation, or property renovation, we are ready to assist.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <Link
                href="/request-a-quote"
                className="inline-flex items-center gap-2 rounded bg-amber-600 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:bg-amber-500 transition-all"
              >
                <span>Request a Quote</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded border border-slate-700 bg-slate-900 px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
              >
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}
