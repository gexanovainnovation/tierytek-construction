import { getSettings } from "@/lib/settings";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { QuoteForm } from "@/components/QuoteForm";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a Quote | Tierytek Construction",
  description:
    "Request a detailed technical and cost proposal for steel construction, roofing systems, or structural renovations across Nigeria.",
};

export default async function RequestQuotePage() {
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Navbar companyName={settings.companyName || "Tierytek Construction"} phone={settings.phone || ""} />

      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
              Technical Proposal
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Request a Project Quotation
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Submit your structural specifications, building dimensions, or architectural scope. Our engineering estimating team will prepare a formal schedule of materials and cost breakdown.
            </p>
          </div>
        </div>
      </section>

      {/* Quote Form Section */}
      <section className="py-20 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
                <h3 className="text-lg font-bold text-white">Quotation Process</h3>
                <div className="space-y-4 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                      1
                    </span>
                    <div>
                      <strong className="text-white block font-semibold">Scope Submission</strong>
                      <p className="text-slate-400 mt-0.5">Provide project location, type, and brief specs.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                      2
                    </span>
                    <div>
                      <strong className="text-white block font-semibold">Engineering Review</strong>
                      <p className="text-slate-400 mt-0.5">Structural feasibility and load checks.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20">
                      3
                    </span>
                    <div>
                      <strong className="text-white block font-semibold">Formal Proposal</strong>
                      <p className="text-slate-400 mt-0.5">Delivered with pricing, delivery schedules, and scope.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>No obligation project estimates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Confidentiality guaranteed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}
