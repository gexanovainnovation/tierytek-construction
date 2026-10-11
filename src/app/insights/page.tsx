import { db } from "@/db";
import { insights } from "@/db/schema";
import { getSettings } from "@/lib/settings";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { eq, desc } from "drizzle-orm";
import { Calendar, User, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { ensureAllTables } from "@/db/init";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "News & Construction Insights | Tierytek Construction",
  description:
    "Stay informed with technical construction updates, structural steel advancements, and project milestones from Tierytek Construction.",
};

export default async function InsightsPage() {
  await ensureAllTables();
  const settings = await getSettings();

  const allArticles = await db
    .select()
    .from(insights)
    .where(eq(insights.published, true))
    .orderBy(desc(insights.publishedAt));

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Navbar companyName={settings.companyName || "Tierytek Construction"} phone={settings.phone || ""} />

      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
              Technical Insights & Updates
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Construction News & Engineering Updates
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Official updates regarding Tierytek structural frameworks, roofing innovations, project milestones, and engineering best practices in Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Articles List */}
      <section className="py-20 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {allArticles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-16 text-center max-w-xl mx-auto space-y-3">
              <h3 className="text-lg font-bold text-white">No articles published yet</h3>
              <p className="text-xs text-slate-400">
                Company announcements and engineering insights will appear here soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {allArticles.map((article) => (
                <article
                  key={article.id}
                  className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-6 transition-all hover:border-slate-700 hover:bg-slate-900"
                >
                  <div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-3">
                      <span className="font-semibold text-amber-500 uppercase tracking-widest">
                        {article.category || "Update"}
                      </span>
                      {article.publishedAt && (
                        <span className="flex items-center gap-1 font-mono text-slate-500">
                          <Calendar className="h-3 w-3" />
                          {new Date(article.publishedAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                      <Link href={`/insights/${article.slug}`}>{article.title}</Link>
                    </h2>

                    <p className="mt-3 text-xs leading-relaxed text-slate-300 line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500">
                      {article.authorName || "Tierytek"}
                    </span>
                    <Link
                      href={`/insights/${article.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-400 group-hover:text-amber-300"
                    >
                      <span>Read</span>
                      <ArrowRight className="h-3 w-3" />
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
