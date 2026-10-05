"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export function QuoteForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectType: "Steel Construction",
    location: "",
    budget: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit quote request");
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectType: "Steel Construction",
        location: "",
        budget: "",
        message: "",
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-10 shadow-2xl backdrop-blur">
      {status === "success" ? (
        <div className="py-12 text-center space-y-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-2 border border-emerald-500/20">
            <CheckCircle className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Quotation Request Received
          </h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Thank you for reaching out to Tierytek Construction. Your enquiry has been registered in our engineering system. Our technical team will review your project parameters and contact you promptly.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="mt-6 rounded bg-slate-800 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-slate-700 transition-colors"
          >
            Submit Another Request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {status === "error" && (
            <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-start gap-3">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Full Name <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Engr. Adeola Adeleke"
                className="w-full rounded border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Work Email <span className="text-amber-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@company.com"
                className="w-full rounded border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+234 ..."
                className="w-full rounded border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Company / Organization
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Apex Logistics Ltd"
                className="w-full rounded border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Service Category <span className="text-amber-500">*</span>
              </label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
              >
                <option value="Steel Construction">Steel Construction & Framework</option>
                <option value="Roofing Solutions">Industrial & Commercial Roofing</option>
                <option value="House / Commercial Renovation">Renovation & Structural Works</option>
                <option value="Structural Engineering">Structural Engineering Analysis</option>
                <option value="Architectural Design">Architectural & Drafting Design</option>
                <option value="Logistics & Supply">Steel Logistics & Materials Supply</option>
                <option value="General Construction">General Construction</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Site Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Ikeja, Lagos"
                className="w-full rounded border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Estimated Budget Range
              </label>
              <input
                type="text"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="Optional (NGN)"
                className="w-full rounded border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Project Description & Specifications <span className="text-amber-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Please provide details regarding building dimensions, steel specifications, timeline, site accessibility, or structural requirements..."
              className="w-full rounded border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded bg-amber-600 px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-amber-600/20 hover:bg-amber-500 transition-all disabled:opacity-50"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting Request...</span>
              </>
            ) : (
              <>
                <span>Submit Quotation Request</span>
                <Send className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
