import { db } from "@/db";
import { services } from "@/db/schema";
import { getSettings } from "@/lib/settings";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { eq, asc } from "drizzle-orm";
import { ArrowRight, Wrench, Shield, CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import { ensureAllTables } from "@/db/init";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services & Capabilities | Tierytek Construction",
  description:
    "Explore our full range of structural steel construction, roofing systems, commercial renovation, structural engineering, and architectural drafting services across Nigeria.",
};

export default async function ServicesPage() {
  await ensureAllTables();
  const settings = await getSettings();

  const allServices = await db
    .select()
    .from(services)
    .where(eq(services.published, true))
    .orderBy(asc(services.orderIndex));

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Navbar companyName={settings.companyName || "Tierytek Construction"} phone={settings.phone || ""} />

      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
              Our Capabilities
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Engineering & Construction Capabilities
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Tierytek Construction delivers comprehensive structural engineering, steel fabrication, industrial roofing, and precision renovation services across Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
          {allServices.map((service, idx) => (
            <div
              key={service.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 sm:p-12 transition-all hover:border-slate-700 hover:bg-slate-900/80"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-amber-500">
                      0{idx + 1}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded">
                      {service.category || "Specialization"}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {service.title}
                  </h2>

                  <p className="text-sm font-medium text-slate-300 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {service.content}
                  </p>

                  <div className="pt-4 flex flex-wrap gap-4">
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-2 rounded bg-amber-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-amber-500 transition-colors"
                    >
                      <span>Explore Service</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href="/request-a-quote"
                      className="inline-flex items-center gap-2 rounded border border-slate-700 bg-slate-800/60 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <span>Get a Quote</span>
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-4 rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-white border-b border-slate-800 pb-2">
                    Service Standards
                  </h4>
                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Certified Engineering Standards</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Precision Fabrication & Fitting</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Quality Assured Materials</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Complete Site Safety Management</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}
