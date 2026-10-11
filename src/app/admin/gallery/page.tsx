"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Image as ImageIcon, CheckCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function AdminGalleryPage() {
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    client: "",
    project: "",
    location: "",
    category: "Steel Construction",
    description: "",
    caption: "",
    altText: "",
    year: "2025",
    imageUrl: "",
    featured: false,
    orderIndex: 0,
    published: true,
  });

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (Array.isArray(data)) setGalleryItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        client: formData.client,
        project: formData.project,
        location: formData.location,
        category: formData.category,
        description: formData.description,
        caption: formData.caption,
        altText: formData.altText,
        year: formData.year,
        images: formData.imageUrl ? [{ url: formData.imageUrl, alt: formData.altText || formData.title }] : [],
        featured: formData.featured,
        orderIndex: Number(formData.orderIndex) || 0,
        published: formData.published,
      };

      if (editingItem) {
        await fetch(`/api/gallery/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setIsCreating(false);
      setEditingItem(null);
      fetchGallery();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;
    try {
      await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      setGalleryItems((prev) => prev.filter((i) => i.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    setIsCreating(true);
    setFormData({
      title: item.title,
      client: item.client || "",
      project: item.project || "",
      location: item.location || "",
      category: item.category || "Steel Construction",
      description: item.description || "",
      caption: item.caption || "",
      altText: item.altText || "",
      year: item.year || "2025",
      imageUrl: item.images?.[0]?.url || "",
      featured: item.featured || false,
      orderIndex: item.orderIndex || 0,
      published: item.published,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Workmanship Gallery
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">
            Visual showcase of verified structural steel and construction workmanship
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setIsCreating(true);
            setFormData({
              title: "",
              client: "",
              project: "",
              location: "",
              category: "Steel Construction",
              description: "",
              caption: "",
              altText: "",
              year: new Date().getFullYear().toString(),
              imageUrl: "",
              featured: false,
              orderIndex: galleryItems.length + 1,
              published: true,
            });
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-amber-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Gallery Photo</span>
        </button>
      </div>

      {isCreating && (
        <div className="rounded-xl border border-amber-500/40 bg-slate-900/90 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white mb-4">
            {editingItem ? "Edit Workmanship Item" : "Add Workmanship Photograph"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Item Title <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Heavy Truss Steel Erection"
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Steel Construction">Steel Construction</option>
                  <option value="Roofing Solutions">Roofing Solutions</option>
                  <option value="Renovation">Renovation</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Residential">Residential</option>
                  <option value="Structural Work">Structural Work</option>
                  <option value="Architectural">Architectural</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://... or /uploads/..."
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Lekki, Lagos"
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Year
                </label>
                <input
                  type="text"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="2025"
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Short Caption / Technical Note
                </label>
                <input
                  type="text"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  placeholder="e.g. 35-meter span pre-engineered steel truss with anti-corrosion coating"
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Image Alt Text (SEO & Accessibility)
                </label>
                <input
                  type="text"
                  value={formData.altText}
                  onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                  placeholder="e.g. Steel structural beam alignment on industrial site"
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-amber-600 focus:ring-amber-500"
                />
                <span>Published on Gallery page</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-amber-600 focus:ring-amber-500"
                />
                <span>Feature on Homepage Preview</span>
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="rounded bg-amber-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-amber-500 transition-colors"
              >
                Save Gallery Item
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

      {/* Gallery Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                {item.images?.[0]?.url ? (
                  <img
                    src={item.images[0].url}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-8 w-8 text-slate-700" />
                )}
                <div className="absolute top-2 right-2">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      item.published ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {item.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                  {item.category}
                </span>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                {item.caption && (
                  <p className="text-xs text-slate-400 line-clamp-2">{item.caption}</p>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-mono text-[11px]">{item.year}</span>
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => startEdit(item)}
                  className="text-slate-400 hover:text-amber-400"
                >
                  <Edit className="h-4 w-4 inline" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-slate-400 hover:text-rose-400"
                >
                  <Trash2 className="h-4 w-4 inline" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
