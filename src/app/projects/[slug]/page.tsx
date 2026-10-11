import { db } from "@/db";
import { projects } from "@/db/schema";
import { getSettings } from "@/lib/settings";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { ArrowLeft, MapPin, Calendar, Building, CheckCircle2, ArrowRight } from "lucide-react";
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
  const rows = await db.select().from(projects).where(and(eq(projects.slug, slug), eq(projects.published, true))).limit(1);
  if (rows.length === 0) return { title: "Project Not Found" };
  const project = rows[0];

  return {
    title: `${project.title} | Tierytek Construction`,
    description: project.overview?.slice(0, 160) || "Construction case study by Tierytek Construction",
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await ensureAllTables();
  const settings = await getSettings();

  const rows = await db.select().from(projects).where(and(eq(projects.slug, slug), eq(projects.published, true))).limit(1);
  if (rows.length === 0) {
    notFound();
  }

  const project = rows[0];

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Navbar companyName={settings.companyName || "Tierytek Construction"} phone={settings.phone || ""} />

      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500 hover:text-amber-400 mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to all projects</span>
          </Link>
          <div className="max-w-3xl">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-800 px-2.5 py-1 rounded">
              {project.category || "Case Study"}
            </span>
            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {project.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-400">
              {project.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  <span>{project.location}</span>
                </div>
              )}
              {project.client && (
                <div className="flex items-center gap-1.5">
                  <Building className="h-4 w-4 text-amber-500" />
                  <span>Client: {project.client}</span>
                </div>
              )}
              {project.year && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  <span>Year: {project.year}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-10">
              {project.images?.length > 0 && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Project photos">
                  {project.images.map((image, index) => (
                    <div key={`${image.url}-${index}`} className="relative aspect-4/3 overflow-hidden rounded-lg border border-slate-800 bg-slate-900">
                      <Image
                        src={image.url}
                        alt={image.alt || `${project.title} photo ${index + 1}`}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Project Overview */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-4">
                <h2 className="text-xl font-bold text-white tracking-tight">Project Overview</h2>
                <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                  {project.overview}
                </p>
              </div>

              {/* Scope of Work */}
              {project.scope && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-4">
                  <h2 className="text-xl font-bold text-white tracking-tight">Scope of Work</h2>
                  <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                    {project.scope}
                  </p>
                </div>
              )}

              {/* Challenge & Solution */}
              {(project.challenge || project.solution) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {project.challenge && (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
                      <h3 className="text-base font-bold text-white">Engineering Challenge</h3>
                      <p className="text-xs leading-relaxed text-slate-400 whitespace-pre-line">
                        {project.challenge}
                      </p>
                    </div>
                  )}
                  {project.solution && (
                    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
                      <h3 className="text-base font-bold text-white">Delivered Solution</h3>
                      <p className="text-xs leading-relaxed text-slate-400 whitespace-pre-line">
                        {project.solution}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Results */}
              {project.results && (
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 space-y-4">
                  <h2 className="text-xl font-bold text-white tracking-tight">Outcome & Performance</h2>
                  <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                    {project.results}
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6 sticky top-24">
                <h3 className="text-lg font-bold text-white">Project Inquiries</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Interested in similar structural specifications or steel fabrication capabilities for your site?
                </p>
                <Link
                  href="/request-a-quote"
                  className="w-full inline-flex items-center justify-center gap-2 rounded bg-amber-600 py-3 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-amber-500 transition-colors"
                >
                  <span>Request Project Estimate</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/gallery"
                  className="w-full inline-flex items-center justify-center gap-2 rounded border border-slate-700 bg-slate-800 py-3 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
                >
                  <span>View Workmanship Gallery</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}
