import { db } from "@/db";
import { enquiries, services, projects, gallery, media, insights } from "@/db/schema";
import Link from "next/link";
import { desc, eq, count } from "drizzle-orm";
import {
  Inbox,
  Layers,
  Building2,
  Image,
  FolderOpen,
  FileText,
  ArrowRight,
  PlusCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { ensureAllTables } from "@/db/init";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await ensureAllTables();

  // Fetch counts
  const enquiriesTotal = await db.select({ count: count() }).from(enquiries);
  const newEnquiries = await db
    .select({ count: count() })
    .from(enquiries)
    .where(eq(enquiries.status, "new"));
  const servicesTotal = await db.select({ count: count() }).from(services);
  const projectsTotal = await db.select({ count: count() }).from(projects);
  const galleryTotal = await db.select({ count: count() }).from(gallery);
  const mediaTotal = await db.select({ count: count() }).from(media);
  const insightsTotal = await db.select({ count: count() }).from(insights);

  // Fetch recent enquiries
  const recentEnquiries = await db
    .select()
    .from(enquiries)
    .orderBy(desc(enquiries.createdAt))
    .limit(5);

  const metrics = [
    {
      title: "New Enquiries",
      value: newEnquiries[0]?.count ?? 0,
      total: enquiriesTotal[0]?.count ?? 0,
      icon: Inbox,
      href: "/admin/enquiries",
      highlight: true,
    },
    {
      title: "Active Services",
      value: servicesTotal[0]?.count ?? 0,
      icon: Layers,
      href: "/admin/services",
    },
    {
      title: "Projects",
      value: projectsTotal[0]?.count ?? 0,
      icon: Building2,
      href: "/admin/projects",
    },
    {
      title: "Gallery Items",
      value: galleryTotal[0]?.count ?? 0,
      icon: Image,
      href: "/admin/gallery",
    },
    {
      title: "Media Assets",
      value: mediaTotal[0]?.count ?? 0,
      icon: FolderOpen,
      href: "/admin/media",
    },
    {
      title: "Articles / News",
      value: insightsTotal[0]?.count ?? 0,
      icon: FileText,
      href: "/admin/insights",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          System Overview
        </h1>
        <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">
          Real-time metrics from PostgreSQL database
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Link
              key={metric.title}
              href={metric.href}
              className={`rounded-xl border p-5 transition-all hover:translate-y-[-2px] ${
                metric.highlight
                  ? "border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-slate-900"
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {metric.title}
                </span>
                <div className="h-8 w-8 rounded bg-slate-800 flex items-center justify-center text-amber-500">
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">
                  {metric.value}
                </span>
                {metric.total !== undefined && (
                  <span className="text-xs text-slate-500">
                    / {metric.total} total
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
          Quick Management Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-amber-500 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Workmanship Photo</span>
          </Link>
          <Link
            href="/admin/services"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Manage Services</span>
          </Link>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Project Case Study</span>
          </Link>
          <Link
            href="/admin/media"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <FolderOpen className="h-4 w-4" />
            <span>Upload R2 / Media</span>
          </Link>
        </div>
      </div>

      {/* Recent Enquiries Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 p-5">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Recent Quotation Enquiries
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct inquiries submitted from website visitors
            </p>
          </div>
          <Link
            href="/admin/enquiries"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-amber-500 hover:text-amber-400"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentEnquiries.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No inquiries received yet. They will appear here immediately upon submission.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-5">Client Name</th>
                  <th className="py-3 px-5">Project Scope</th>
                  <th className="py-3 px-5">Contact</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Date</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-800/30">
                    <td className="py-3.5 px-5 font-semibold text-white">
                      {enq.name}
                      {enq.company && (
                        <span className="block text-[10px] text-slate-500 font-normal">
                          {enq.company}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-slate-300">
                      {enq.projectType || "General"}
                    </td>
                    <td className="py-3.5 px-5 text-slate-400 font-mono text-[11px]">
                      {enq.email}
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          enq.status === "new"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : enq.status === "won"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 font-mono text-[11px]">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        href={`/admin/enquiries`}
                        className="text-amber-500 hover:text-amber-400 font-semibold"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
