import { db } from "@/db";
import { gallery } from "@/db/schema";
import { getSettings } from "@/lib/settings";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GalleryView } from "@/components/GalleryView";
import { eq, asc } from "drizzle-orm";
import type { Metadata } from "next";
import { ensureAllTables } from "@/db/init";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Workmanship Gallery | Tierytek Construction",
  description:
    "Visual portfolio and photographical documentation of completed structural steel projects, roofing, and renovation works across Nigeria.",
};

export default async function GalleryPage() {
  await ensureAllTables();
  const settings = await getSettings();

  const items = await db
    .select()
    .from(gallery)
    .where(eq(gallery.published, true))
    .orderBy(asc(gallery.orderIndex));

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Navbar companyName={settings.companyName || "Tierytek Construction"} phone={settings.phone || ""} />

      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
              Project Gallery
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Construction In Focus
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Explore construction imagery across structural steel, roofing systems, and on-site assembly.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-16 sm:py-20 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <GalleryView items={items} />
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}
