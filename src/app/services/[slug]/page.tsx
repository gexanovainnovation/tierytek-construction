import { db } from "@/db";
import { services } from "@/db/schema";
import { getSettings } from "@/lib/settings";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { QuoteForm } from "@/components/QuoteForm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft, CheckCircle2, Phone, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { ensureAllTables } from "@/db/init";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  await ensureAllTables();
  const rows = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  if (rows.length === 0) return { title: "Service Not Found" };
  const service = rows[0];

  return {
    title: `${service.title} | Tierytek Construction`,
    description: service.shortDescription || service.content.slice(0, 160),
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await ensureAllTables();
  const settings = await getSettings();

  const rows = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  if (rows.length === 0) {
    notFound();
  }

  const service = rows[0];

  // Get other services for navigation
  const otherServices = await db
    .select()
    .from(services)
    .where(eq(services.published, true))
    .limit(4);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Navbar companyName={settings.companyName || "Tierytek Construction"} phone={settings.phone || ""} />

      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500 hover:text-amber-400 mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to all services</span>
          </Link>
          <div className="max-w-3xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-800 px-2.5 py-1 rounded">
              {service.category || "Service Detail"}
            </span>
            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {service.title}
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              {service.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Service Content */}
      <section className="py-20 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 sm:p-10 space-y-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Scope & Engineering Approach
                </h2>
                <div className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                  {service.content}
                </div>
              </div>

              {/* Related Services */}
              <div className="pt-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-4">
                  Explore Related Capabilities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {otherServices
                    .filter((s) => s.id !== service.id)
                    .slice(0, 2)
                    .map((item) => (
                      <Link
                        key={item.id}
                        href={`/services/${item.slug}`}
                        className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-slate-700 transition-colors group block"
                      >
                        <h4 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                          {item.title}
                        </h4>
                        <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                          {item.shortDescription}
                        </p>
                      </Link>
                    ))}
                </div>
              </div>
            </div>

            {/* Sidebar CTA */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6 sticky top-24">
                <h3 className="text-lg font-bold text-white">
                  Engage for this Service
                </h3>
                <p className="text-xs leading-relaxed text-slate-300">
                  Discuss structural steel drawings, load requirements, or site specifications with our engineering team.
                </p>

                <div className="space-y-3 pt-2">
                  <Link
                    href="/request-a-quote"
                    className="w-full inline-flex items-center justify-center gap-2 rounded bg-amber-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-amber-500 transition-colors text-center"
                  >
                    <span>Request Quotation</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  {settings.phone && (
                    <a
                      href={`tel:${settings.phone}`}
                      className="w-full inline-flex items-center justify-center gap-2 rounded border border-slate-700 bg-slate-800 py-3 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors text-center"
                    >
                      <Phone className="h-3.5 w-3.5 text-amber-500" />
                      <span>Call Engineering Desk</span>
                    </a>
                  )}
                </div>

                <div className="border-t border-slate-800 pt-4 space-y-2 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Compliant with Structural Codes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Rigorous Site Quality Control</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}
