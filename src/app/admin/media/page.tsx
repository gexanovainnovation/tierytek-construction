"use client";

import { useState, useEffect } from "react";
import { Upload, Trash2, Copy, Check, FolderOpen, Cloud, HardDrive } from "lucide-react";

export default function AdminMediaPage() {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [storageType, setStorageType] = useState<string>("local-disk");
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");

  const fetchMedia = async () => {
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (data.items) {
        setMediaItems(data.items);
        setStorageType(data.storageType);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", altText || file.name);
    formData.append("caption", caption);

    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setAltText("");
        setCaption("");
        fetchMedia();
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err: any) {
      alert(err.message || "Upload error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const copyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this media asset?")) return;
    try {
      await fetch(`/api/media/${id}`, { method: "DELETE" });
      setMediaItems((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Media & Asset Library
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">
            Store, preview, and manage construction photographs for Gallery and Case Studies
          </p>
        </div>

        {/* Storage status */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs">
          {storageType === "cloudflare-r2" ? (
            <>
              <Cloud className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400 font-bold uppercase tracking-wider">
                Remote Storage Active
              </span>
            </>
          ) : (
            <>
              <HardDrive className="h-4 w-4 text-amber-500" />
              <span className="text-slate-300 font-medium">
                Local Storage Active
              </span>
            </>
          )}
        </div>
      </div>

      {/* Upload Zone */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-300 mb-4">
          Upload Construction Photograph / Drawing
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            placeholder="Image Alt Text (e.g. Steel column joint weld inspection)"
            className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Optional caption / structural description"
            className="rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 hover:border-amber-500/60 bg-slate-950/40 p-8 cursor-pointer transition-colors">
          <Upload className="h-8 w-8 text-amber-500 mb-2" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            {uploading ? "Uploading to Storage..." : "Click to select or drop photograph"}
          </span>
          <span className="text-[11px] text-slate-500 mt-1">
            PNG, JPG, WebP, GIF, SVG up to 15MB
          </span>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {mediaItems.map((item) => (
          <div
            key={item.id}
            className="group rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative aspect-square bg-slate-950 overflow-hidden">
              <img
                src={item.url}
                alt={item.altText || item.originalName}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>

            <div className="p-3 bg-slate-950/80 border-t border-slate-800 space-y-1">
              <p className="text-[11px] font-bold text-white truncate" title={item.originalName}>
                {item.originalName}
              </p>
              <p className="text-[9px] text-slate-500 font-mono">
                {(item.size / 1024).toFixed(0)} KB • {item.mimeType}
              </p>
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => copyUrl(item.url, item.id)}
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-500 hover:text-amber-400"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-slate-500 hover:text-rose-400"
                  title="Delete media"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
