import { db } from "@/db";
import { projects } from "@/db/schema";
import { getSettings } from "@/lib/settings";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { eq, asc } from "drizzle-orm";
import { Building2, MapPin, Calendar, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { ensureAllTables } from "@/db/init";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects & Case Studies | Tierytek Construction",
  description:
    "Explore engineering case studies, structural steel projects, and commercial construction completed by Tierytek Construction.",
};

export default async function ProjectsPage() {
  await ensureAllTables();
  const settings = await getSettings();

  const allProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.orderIndex));

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Navbar companyName={settings.companyName || "Tierytek Construction"} phone={settings.phone || ""} />

      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
              Case Studies
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Projects & Engineering Deliverables
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Documented structural milestones, steel framework fabrications, and construction case studies undertaken by Tierytek Construction.
            </p>
          </div>
        </div>
      </section>

      {/* Project Grid / Empty State */}
      <section className="py-20 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {allProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-16 text-center max-w-2xl mx-auto space-y-4">
              <div className="h-14 w-14 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Building2 className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-bold text-white">
                Project Showcases Under Compilation
              </h2>
              <p className="text-xs leading-relaxed text-slate-400">
                Our project portfolio is being updated. Get in touch with our team to discuss our construction experience.
              </p>
              <div className="pt-4">
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-2 rounded bg-amber-600 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-amber-500 transition-colors"
                >
                  <span>View Workmanship Gallery</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProjects.map((project) => (
                <article
                  key={project.id}
                  className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-slate-700 hover:bg-slate-900"
                >
                  <div>
                    {project.images?.[0]?.url && (
                      <div className="relative mb-5 aspect-video overflow-hidden rounded-lg bg-slate-950">
                        <Image
                          src={project.images[0].url}
                          alt={project.images[0].alt || project.title}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
                      <span className="font-semibold text-amber-500 uppercase tracking-widest">
                        {project.category || "Project"}
                      </span>
                      {project.year && (
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="h-3 w-3" />
                          {project.year}
                        </span>
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                      <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                    </h2>

                    {project.location && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        <span>{project.location}</span>
                      </p>
                    )}

                    <p className="mt-4 text-xs leading-relaxed text-slate-300 line-clamp-3">
                      {project.overview}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <span>Read Case Study</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}
