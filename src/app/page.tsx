import { db } from "@/db";
import { services, projects, gallery, insights } from "@/db/schema";
import { getSettings } from "@/lib/settings";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { QuoteForm } from "@/components/QuoteForm";
import Link from "next/link";
import { eq, desc, asc } from "drizzle-orm";
import {
  ShieldCheck,
  HardHat,
  Compass,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Building2,
  Maximize2,
  Layers,
} from "lucide-react";
import { ensureAllTables } from "@/db/init";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureAllTables();
  const settings = await getSettings();

  // Load published services
  const publishedServices = await db
    .select()
    .from(services)
    .where(eq(services.published, true))
    .orderBy(asc(services.orderIndex));

  // Load published projects
  const publishedProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.orderIndex))
    .limit(3);

  // Load published gallery items
  const publishedGallery = await db
    .select()
    .from(gallery)
    .where(eq(gallery.published, true))
    .orderBy(asc(gallery.orderIndex))
    .limit(6);

  // Load latest insights
  const latestInsights = await db
    .select()
    .from(insights)
    .where(eq(insights.published, true))
    .orderBy(desc(insights.publishedAt))
    .limit(3);

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Navbar companyName={settings.companyName || "Tierytek Construction"} phone={settings.phone || ""} />

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/10 via-slate-950 to-slate-950" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Structural Steel & Architectural Engineering Across Nigeria
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-6xl text-white leading-[1.1]">
              Industrial Steel Frameworks & Precision Construction.
            </h1>

            <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-300">
              At Tierytek Construction, we specialize in high-strength steel frameworks, durable roofing solutions, and commercial renovation projects. We bring engineering rigor, structural safety, and innovation to every site.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/request-a-quote"
                className="inline-flex items-center gap-2 rounded bg-amber-600 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-amber-600/25 hover:bg-amber-500 transition-all hover:translate-y-[-1px]"
              >
                <span>Request a Quote</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded border border-slate-700 bg-slate-900/90 px-6 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200 hover:bg-slate-800 hover:text-white transition-all"
              >
                <span>Explore Capabilities</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Overview Section */}
      <section className="py-20 border-b border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                Company Introduction
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Built with precision, delivered with integrity.
              </h2>
              <p className="text-sm leading-relaxed text-slate-400">
                From industrial-grade steel warehouses and logistics hubs to commercial roofing and residential transformations, Tierytek Construction delivers engineered solutions tailored to withstand Nigeria&apos;s toughest operational and environmental conditions.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-3">
                <div className="h-10 w-10 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">Quality & Safety First</h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  Strict adherence to structural load standards, weld integrity verification, and comprehensive on-site safety protocols.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-3">
                <div className="h-10 w-10 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <HardHat className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">Qualified Engineering Team</h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  Experienced civil engineers, steel fabricators, and architects committed to professional project management.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-3">
                <div className="h-10 w-10 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Compass className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">Precision Design & Detailing</h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  Accurate structural member drafting, joint detailing, and pre-engineered building (PEB) solutions.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 space-y-3">
                <div className="h-10 w-10 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white">On-Time Project Delivery</h3>
                <p className="text-xs leading-relaxed text-slate-400">
                  Systematic milestone tracking, material procurement management, and timely structural commissioning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities / Services Section */}
      <section className="py-20 border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                Core Capabilities
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Construction & Engineering Services
              </h2>
            </div>
            <Link
              href="/services"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>View All Services</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedServices.map((service, index) => (
              <div
                key={service.id}
                className="group relative flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-8 transition-all hover:border-slate-700 hover:bg-slate-900"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs text-amber-500 font-bold">
                      0{index + 1}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">
                      {service.category || "Service"}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-slate-400">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800/80">
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 group-hover:text-amber-400 transition-colors"
                  >
                    <span>Read Details</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-20 border-b border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                Case Studies
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Featured Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>Browse All Projects</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {publishedProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950 p-12 text-center">
              <Building2 className="mx-auto h-10 w-10 text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-white">
                Project Showcases Under Assembly
              </h3>
              <p className="mt-2 text-xs text-slate-400 max-w-md mx-auto">
                Real project case studies and engineering milestones are being documented and will be published via the CMS.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {publishedProjects.map((project) => (
                <div
                  key={project.id}
                  className="group rounded-xl border border-slate-800 bg-slate-950 p-6 flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                      {project.category || "Construction"}
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {project.overview}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400"
                    >
                      <span>View Case Study</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="py-20 border-b border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                Visual Workmanship
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Workmanship Gallery
              </h2>
            </div>
            <Link
              href="/gallery"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>Explore Full Gallery</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {publishedGallery.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-12 text-center">
              <Maximize2 className="mx-auto h-10 w-10 text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-white">
                Workmanship Gallery
              </h3>
              <p className="mt-2 text-xs text-slate-400 max-w-md mx-auto">
                Verified high-resolution photographs of steel framing, roof installations, and structural site works can be uploaded directly via the Media CMS.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {publishedGallery.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-slate-800 bg-slate-900"
                >
                  {item.images?.[0]?.url ? (
                    <img
                      src={item.images[0].url}
                      alt={item.altText || item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center p-3 text-center text-[10px] text-slate-500">
                      {item.title}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                    <p className="text-[11px] font-bold text-white truncate">{item.title}</p>
                    <p className="text-[9px] text-amber-400 uppercase">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Latest Insights / News Section */}
      <section className="py-20 border-b border-slate-800 bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                Industry Updates
              </span>
              <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Construction News & Insights
              </h2>
            </div>
            <Link
              href="/insights"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>All Articles</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestInsights.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950 p-6 transition-all hover:border-slate-700"
              >
                <div>
                  <div className="flex items-center gap-2 text-[10px] text-amber-500 uppercase tracking-widest font-semibold mb-3">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Recent"}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                    <Link href={`/insights/${article.slug}`}>{article.title}</Link>
                  </h3>

                  <p className="mt-3 text-xs leading-relaxed text-slate-400 line-clamp-3">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <Link
                    href={`/insights/${article.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-300 group-hover:text-amber-400 transition-colors"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Quotation Request Section */}
      <section id="quote" className="py-20 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
                Direct Engineering Engagement
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Request a formal construction or steel quotation.
              </h2>
              <p className="text-sm leading-relaxed text-slate-300">
                Submit your project drawings, site parameters, or structural specifications. Our engineers will review your requirements and provide a detailed technical and cost proposal.
              </p>

              <div className="space-y-4 pt-4 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Licensed structural engineering review</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Transparent material specification breakdown</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>Commitment to safety standards & timely completion</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}
