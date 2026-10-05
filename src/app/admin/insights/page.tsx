"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AdminInsightsPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Steel Construction",
    authorName: "Tierytek Engineering Team",
    published: true,
  });

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/insights");
      const data = await res.json();
      if (Array.isArray(data)) setArticles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingArticle) {
        await fetch(`/api/insights/${editingArticle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("/api/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      setIsCreating(false);
      setEditingArticle(null);
      fetchArticles();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await fetch(`/api/insights/${id}`, { method: "DELETE" });
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (a: any) => {
    setEditingArticle(a);
    setIsCreating(true);
    setFormData({
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      content: a.content,
      category: a.category || "Steel Construction",
      authorName: a.authorName || "Tierytek Engineering Team",
      published: a.published,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            News & Construction Insights
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">
            Publish technical articles, site milestones, and engineering announcements
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingArticle(null);
            setIsCreating(true);
            setFormData({
              title: "",
              slug: "",
              excerpt: "",
              content: "",
              category: "Steel Construction",
              authorName: "Tierytek Engineering Team",
              published: true,
            });
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-amber-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Write New Article</span>
        </button>
      </div>

      {isCreating && (
        <div className="rounded-xl border border-amber-500/40 bg-slate-900/90 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white mb-4">
            {editingArticle ? "Edit Article" : "Create Technical Announcement"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Article Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Expansion of Structural Framework Capabilities"
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
                  placeholder="e.g. expansion-of-structural-framework"
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
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Author Byline
                </label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Excerpt (Lead paragraph)
              </label>
              <textarea
                rows={2}
                required
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Full Article Content
              </label>
              <textarea
                rows={8}
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="artPublished"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-amber-600 focus:ring-amber-500"
              />
              <label htmlFor="artPublished" className="text-xs text-slate-300">
                Publish immediately on public website
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="rounded bg-amber-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-amber-500 transition-colors"
              >
                Save Article
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

      {/* Articles Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-5">Title</th>
              <th className="py-3 px-5">Category</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300">
            {articles.map((art) => (
              <tr key={art.id} className="hover:bg-slate-800/30">
                <td className="py-3 px-5 font-bold text-white">
                  {art.title}
                  <span className="block text-[10px] text-slate-500 font-mono font-normal">
                    /insights/{art.slug}
                  </span>
                </td>
                <td className="py-3 px-5 text-slate-400">{art.category}</td>
                <td className="py-3 px-5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      art.published ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"
                    }`}
                  >
                    {art.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="py-3 px-5 text-right space-x-2">
                  <Link
                    href={`/insights/${art.slug}`}
                    target="_blank"
                    className="inline-block p-1 text-slate-400 hover:text-white"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => startEdit(art)}
                    className="inline-block p-1 text-slate-400 hover:text-amber-400"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(art.id)}
                    className="inline-block p-1 text-slate-400 hover:text-rose-400"
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
