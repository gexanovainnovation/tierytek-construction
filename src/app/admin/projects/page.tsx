"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit, Trash2, ArrowUpRight, Upload, X } from "lucide-react";
import Link from "next/link";

type ProjectImage = { url: string; alt: string };

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    client: "",
    location: "",
    category: "Commercial",
    year: "2025",
    overview: "",
    scope: "",
    challenge: "",
    solution: "",
    results: "",
    images: [] as ProjectImage[],
    featured: false,
    published: true,
  });

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files?.length) return;

    setIsUploadingImages(true);
    setUploadError("");

    try {
      for (const file of Array.from(files)) {
        const body = new FormData();
        body.append("file", file);
        body.append("altText", file.name.replace(/\.[^/.]+$/, ""));

        const response = await fetch("/api/media", { method: "POST", body });
        const result = await response.json();
        if (!response.ok || !result.media?.url) {
          throw new Error(result.error || `Failed to upload ${file.name}`);
        }
        const image = { url: result.media.url, alt: file.name.replace(/\.[^/.]+$/, "") };
        setFormData((current) => ({ ...current, images: [...current.images, image] }));
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setIsUploadingImages(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUploadingImages) return;
    try {
      let response: Response;
      if (editingProject) {
        response = await fetch(`/api/projects/${editingProject.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      if (!response.ok) throw new Error("Failed to save project.");
      setIsCreating(false);
      setEditingProject(null);
      fetchProjects();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const startEdit = (p: any) => {
    setEditingProject(p);
    setIsCreating(true);
    setFormData({
      title: p.title,
      slug: p.slug,
      client: p.client || "",
      location: p.location || "",
      category: p.category || "Commercial",
      year: p.year || "2025",
      overview: p.overview || "",
      scope: p.scope || "",
      challenge: p.challenge || "",
      solution: p.solution || "",
      results: p.results || "",
      images: Array.isArray(p.images) ? p.images : [],
      featured: p.featured || false,
      published: p.published,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Project Case Studies
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">
            Manage comprehensive construction and structural case studies
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingProject(null);
            setIsCreating(true);
            setFormData({
              title: "",
              slug: "",
              client: "",
              location: "",
              category: "Commercial",
              year: new Date().getFullYear().toString(),
              overview: "",
              scope: "",
              challenge: "",
              solution: "",
              results: "",
              images: [],
              featured: false,
              published: true,
            });
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-amber-500 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </button>
      </div>

      {isCreating && (
        <div className="rounded-xl border border-amber-500/40 bg-slate-900/90 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-white mb-4">
            {editingProject ? "Edit Project Case Study" : "Create New Case Study"}
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Industrial Steel Warehouse Complex"
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
                  placeholder="e.g. industrial-steel-warehouse-complex"
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  placeholder="e.g. Confidential or Company Name"
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
                  placeholder="e.g. Ikeja, Lagos"
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Steel Construction"
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

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Project Photos
                </label>
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={isUploadingImages}
                  className="inline-flex items-center gap-2 rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-bold text-slate-200 hover:border-amber-500 hover:text-white disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  {isUploadingImages ? "Uploading..." : "Choose Photos"}
                </button>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                  multiple
                  className="hidden"
                  onChange={(event) => handleImageUpload(event.target.files)}
                />
              </div>
              <p className="mb-3 text-[11px] text-slate-500">Upload one or more JPG, PNG, WebP, GIF, or SVG files (15 MB max each).</p>
              {uploadError && <p role="alert" className="mb-3 text-xs text-rose-400">{uploadError}</p>}
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {formData.images.map((image, index) => (
                    <div key={`${image.url}-${index}`} className="group relative aspect-4/3 overflow-hidden rounded border border-slate-700 bg-slate-950">
                      <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData((current) => ({ ...current, images: current.images.filter((_, imageIndex) => imageIndex !== index) }))}
                        aria-label={`Remove ${image.alt || `project photo ${index + 1}`}`}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded bg-slate-950/85 text-white opacity-100 transition-opacity hover:bg-rose-600 sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                Project Overview & Summary
              </label>
              <textarea
                rows={3}
                required
                value={formData.overview}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Engineering Challenge
                </label>
                <textarea
                  rows={3}
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Delivered Solution
                </label>
                <textarea
                  rows={3}
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
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
                <span>Published on website</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-950 text-amber-600 focus:ring-amber-500"
                />
                <span>Feature on homepage</span>
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isUploadingImages}
                className="rounded bg-amber-600 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-amber-500 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save Project
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

      {/* Projects Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No projects added yet. Click &quot;Add Project&quot; above to create the first case study.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-5">Title</th>
                <th className="py-3 px-5">Client</th>
                <th className="py-3 px-5">Location</th>
                <th className="py-3 px-5">Year</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-5 font-bold text-white">
                    {p.title}
                    <span className="block text-[10px] text-slate-500 font-mono font-normal">
                      /projects/{p.slug}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-slate-400">{p.client || "—"}</td>
                  <td className="py-3 px-5 text-slate-400">{p.location || "—"}</td>
                  <td className="py-3 px-5 font-mono text-slate-400">{p.year || "—"}</td>
                  <td className="py-3 px-5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        p.published ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right space-x-2">
                    <Link
                      href={`/projects/${p.slug}`}
                      target="_blank"
                      className="inline-block p-1 text-slate-400 hover:text-white"
                      title="View case study"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="inline-block p-1 text-slate-400 hover:text-amber-400"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="inline-block p-1 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
