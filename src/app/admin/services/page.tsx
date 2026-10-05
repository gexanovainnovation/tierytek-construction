"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, CheckCircle, XCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    content: "",
    category: "Engineering",
    orderIndex: 0,
    published: true,
  });

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      if (Array.isArray(data)) setServices(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingService) {
        await fetch(`/api/services/${editingService.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      setIsCreating(false);
      setEditingService(null);
      setFormData({
        title: "",
        slug: "",
        shortDescription: "",
        content: "",
        category: "Engineering",
        orderIndex: 0,
        published: true,
      });
      fetchServices();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await fetch(`/api/services/${id}`, { method: "DELETE" });
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (service: any) => {
    setEditingService(service);
    setIsCreating(true);
    setFormData({
      title: service.title,
      slug: service.slug,
      shortDescription: service.shortDescription,
      content: service.content,
      category: service.category || "Engineering",
      orderIndex: service.orderIndex || 0,
      published: service.published,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Services & Capabilities
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">
            Manage company construction capabilities and individual service pages
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingService(null);
            setIsCreating(true);
            setFormData({
              title: "",
              slug: "",
              shortDescription: "",
              content: "",
              category: "Engineering",
              orderIndex: services.length + 1,
              published: true,
            });
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-amber-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Service</span>
        </button>
      </div>

      {isCreating && (
        <div className="rounded-xl border border-amber-500/40 bg-slate-900/90 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white mb-4">
            {editingService ? "Edit Service" : "Add New Capability"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Service Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Pre-Engineered Steel Buildings"
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. pre-engineered-steel-buildings"
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Engineering, Construction"
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Order Index
                </label>
                <input
                  type="number"
                  value={formData.orderIndex}
                  onChange={(e) => setFormData({ ...formData, orderIndex: Number(e.target.value) })}
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Short Summary (Card view)
              </label>
              <textarea
                rows={2}
                required
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Comprehensive Technical Scope & Content
              </label>
              <textarea
                rows={6}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="published" className="text-xs text-slate-300">
                Publish on public website
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="rounded bg-amber-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-amber-500 transition-colors"
              >
                Save Service
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="rounded bg-slate-800 px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-5">Order</th>
              <th className="py-3 px-5">Title</th>
              <th className="py-3 px-5">Category</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-slate-800/30">
                <td className="py-3 px-5 font-mono text-slate-500">{s.orderIndex}</td>
                <td className="py-3 px-5 font-bold text-white">
                  {s.title}
                  <span className="block text-[10px] text-slate-500 font-mono font-normal">
                    /services/{s.slug}
                  </span>
                </td>
                <td className="py-3 px-5 text-slate-400">{s.category}</td>
                <td className="py-3 px-5">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      s.published
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {s.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="py-3 px-5 text-right space-x-2">
                  <Link
                    href={`/services/${s.slug}`}
                    target="_blank"
                    className="inline-block p-1 text-slate-400 hover:text-white"
                    title="View live page"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => startEdit(s)}
                    className="inline-block p-1 text-slate-400 hover:text-amber-400"
                    title="Edit service"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(s.id)}
                    className="inline-block p-1 text-slate-400 hover:text-rose-400"
                    title="Delete service"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
