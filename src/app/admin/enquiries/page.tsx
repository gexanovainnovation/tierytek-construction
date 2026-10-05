"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Building, Calendar, Trash2, CheckCircle, Clock } from "lucide-react";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch("/api/enquiries");
      const data = await res.json();
      if (Array.isArray(data)) {
        setEnquiries(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setEnquiries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry((prev: any) => ({ ...prev, status }));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this enquiry?")) return;
    try {
      await fetch(`/api/enquiries/${id}`, { method: "DELETE" });
      setEnquiries((prev) => prev.filter((item) => item.id !== id));
      if (selectedEnquiry?.id === id) {
        setSelectedEnquiry(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          Quotation Enquiries
        </h1>
        <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">
          Review client project briefs, manage follow-up states, and update pipeline status
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enquiries List */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              All Submissions ({enquiries.length})
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500">Loading enquiries...</div>
          ) : enquiries.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">No enquiries submitted yet.</div>
          ) : (
            <div className="divide-y divide-slate-800 max-h-[70vh] overflow-y-auto">
              {enquiries.map((enq) => (
                <div
                  key={enq.id}
                  onClick={() => setSelectedEnquiry(enq)}
                  className={`p-4 cursor-pointer transition-colors ${
                    selectedEnquiry?.id === enq.id
                      ? "bg-amber-600/10 border-l-4 border-amber-500"
                      : "hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{enq.name}</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${
                        enq.status === "new"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : enq.status === "won"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-xs text-amber-500 font-medium mt-1">
                    {enq.projectType || "General Enquiry"}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-1">{enq.message}</p>
                  <div className="mt-2 text-[10px] text-slate-500 font-mono">
                    {new Date(enq.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Enquiry Detail Panel */}
        <div className="lg:col-span-7">
          {selectedEnquiry ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedEnquiry.name}</h2>
                  {selectedEnquiry.company && (
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-amber-500" />
                      <span>{selectedEnquiry.company}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedEnquiry.status}
                    onChange={(e) => updateStatus(selectedEnquiry.id, e.target.value)}
                    className="rounded border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs text-white uppercase font-bold tracking-wider focus:outline-none focus:border-amber-500"
                  >
                    <option value="new">Status: New</option>
                    <option value="contacted">Status: Contacted</option>
                    <option value="in_progress">Status: In Progress</option>
                    <option value="quoted">Status: Quoted</option>
                    <option value="won">Status: Won</option>
                    <option value="closed">Status: Closed</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => deleteEnquiry(selectedEnquiry.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                    title="Delete enquiry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-lg border border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-amber-500" />
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-amber-400 hover:underline">
                    {selectedEnquiry.email}
                  </a>
                </div>
                {selectedEnquiry.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-amber-500" />
                    <a href={`tel:${selectedEnquiry.phone}`} className="text-amber-400 hover:underline">
                      {selectedEnquiry.phone}
                    </a>
                  </div>
                )}
                {selectedEnquiry.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-amber-500" />
                    <span>Location: {selectedEnquiry.location}</span>
                  </div>
                )}
                {selectedEnquiry.budget && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-amber-500">Budget:</span>
                    <span>{selectedEnquiry.budget}</span>
                  </div>
                )}
              </div>

              {/* Message Scope */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Project Description & Specifications
                </h3>
                <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-xs leading-relaxed text-slate-200 whitespace-pre-line">
                  {selectedEnquiry.message}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 p-16 text-center text-xs text-slate-500">
              Select an enquiry from the list to view specifications and update its pipeline status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
