"use client";

import { useState } from "react";
import { GalleryItem } from "@/db/schema";
import { X, ZoomIn, MapPin, Calendar, Building, Layers } from "lucide-react";

interface GalleryViewProps {
  items: GalleryItem[];
}

export function GalleryView({ items }: GalleryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(items.map((i) => i.category || "General")))];

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((i) => (i.category || "General") === selectedCategory);

  return (
    <div>
      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-slate-800">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              selectedCategory === cat
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-16 text-center max-w-xl mx-auto space-y-3">
          <Layers className="mx-auto h-10 w-10 text-slate-600 mb-2" />
          <h3 className="text-lg font-bold text-white">No gallery items published yet</h3>
          <p className="text-xs text-slate-400">
            Photographs of our construction and engineering work will appear here soon.
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredItems.map((item) => {
            const firstImage = item.images?.[0];
            return (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                className="group relative cursor-pointer break-inside-avoid overflow-hidden rounded-xl border border-slate-800 bg-slate-900 transition-all hover:border-amber-500/50 hover:shadow-xl hover:shadow-black/50"
              >
                {firstImage?.url ? (
                  <div className="relative overflow-hidden bg-slate-950">
                    <img
                      src={firstImage.url}
                      alt={item.altText || item.title}
                      loading="lazy"
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-5 flex flex-col justify-end">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                        {item.category || "General"}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">
                        {item.title}
                      </h4>
                      {item.caption && (
                        <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                          {item.caption}
                        </p>
                      )}
                      <div className="mt-3 flex items-center gap-2 text-[10px] text-amber-500 font-semibold uppercase tracking-wider">
                        <ZoomIn className="h-3.5 w-3.5" />
                        <span>Enlarge Photograph</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-900">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                      {item.category}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-2">{item.title}</h4>
                    {item.description && (
                      <p className="text-xs text-slate-400 mt-2">{item.description}</p>
                    )}
                  </div>
                )}

                <div className="p-4 border-t border-slate-800/80 bg-slate-950/60">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-white truncate mr-2">{item.title}</span>
                    <span className="shrink-0 text-amber-500 font-mono">{item.year}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 sm:p-6 backdrop-blur-md animate-in fade-in"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">
                  {activeItem.category || "Workmanship Detail"}
                </span>
                <h3 className="text-lg font-bold text-white">{activeItem.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="max-h-[60vh] overflow-hidden bg-black flex items-center justify-center">
              {activeItem.images?.[0]?.url ? (
                <img
                  src={activeItem.images[0].url}
                  alt={activeItem.altText || activeItem.title}
                  className="max-h-[60vh] w-auto max-w-full object-contain"
                />
              ) : (
                <div className="p-12 text-slate-500">No Image Asset</div>
              )}
            </div>

            {/* Modal Details */}
            <div className="p-6 bg-slate-950 border-t border-slate-800 text-xs text-slate-300 space-y-3">
              {activeItem.caption && (
                <p className="text-sm font-medium text-white">{activeItem.caption}</p>
              )}
              {activeItem.description && (
                <p className="text-slate-400 leading-relaxed">{activeItem.description}</p>
              )}
              <div className="flex flex-wrap gap-4 pt-2 text-[11px] text-slate-400 border-t border-slate-900">
                {activeItem.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-amber-500" />
                    <span>Location: {activeItem.location}</span>
                  </div>
                )}
                {activeItem.client && (
                  <div className="flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-amber-500" />
                    <span>Client: {activeItem.client}</span>
                  </div>
                )}
                {activeItem.year && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-amber-500" />
                    <span>Year: {activeItem.year}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
