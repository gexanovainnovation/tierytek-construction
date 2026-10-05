import { db } from "@/db";
import { insights } from "@/db/schema";
import { getSettings } from "@/lib/settings";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
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
  const rows = await db.select().from(insights).where(eq(insights.slug, slug)).limit(1);
  if (rows.length === 0) return { title: "Article Not Found" };
  const article = rows[0];

  return {
    title: `${article.title} | Tierytek Construction`,
    description: article.excerpt || article.content.slice(0, 160),
  };
}

export default async function InsightDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await ensureAllTables();
  const settings = await getSettings();

  const rows = await db.select().from(insights).where(eq(insights.slug, slug)).limit(1);
  if (rows.length === 0) {
    notFound();
  }

  const article = rows[0];

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Navbar companyName={settings.companyName || "Tierytek Construction"} phone={settings.phone || ""} />

      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/40 py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link
            href="/insights"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500 hover:text-amber-400 mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to all updates</span>
          </Link>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 bg-slate-800 px-2.5 py-1 rounded">
              {article.category || "Update"}
            </span>
            <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {article.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
              {article.publishedAt && (
                <div className="flex items-center gap-1.5 font-mono">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  <span>
                    {new Date(article.publishedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              {article.authorName && (
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-amber-500" />
                  <span>{article.authorName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-20 bg-slate-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 sm:p-12 space-y-6">
            <p className="text-base sm:text-lg font-medium text-slate-200 leading-relaxed border-l-2 border-amber-500 pl-4">
              {article.excerpt}
            </p>
            <div className="border-t border-slate-800 pt-6 text-sm leading-relaxed text-slate-300 whitespace-pre-line space-y-4">
              {article.content}
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}
