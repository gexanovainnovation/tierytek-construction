"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Save } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    companyName: "",
    siteTitle: "",
    siteDescription: "",
    phone: "",
    email: "",
    address: "",
    whatsapp: "",
    businessHours: "",
    footerText: "",
    copyrightText: "",
    socialTiktok: "",
    socialInstagram: "",
    socialTwitter: "",
    socialFacebook: "",
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((e) => console.error(e));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Settings updated successfully! Public website updated.");
      } else {
        setError(data.error || "Failed to update settings");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
          Website & Business Settings
        </h1>
        <p className="text-xs uppercase tracking-widest text-slate-400 mt-1">
          Manage brand identity, contact numbers, official address, and global SEO meta
        </p>
      </div>

      {message && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Business Identity */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-500 border-b border-slate-800 pb-2">
            1. Business Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Official Company Name
              </label>
              <input
                type="text"
                value={settings.companyName || ""}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Primary Phone Number
              </label>
              <input
                type="text"
                value={settings.phone || ""}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Official Inquiries Email
              </label>
              <input
                type="email"
                value={settings.email || ""}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                WhatsApp Hotline
              </label>
              <input
                type="text"
                value={settings.whatsapp || ""}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Physical Office Address
              </label>
              <input
                type="text"
                value={settings.address || ""}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Operational Working Hours
              </label>
              <input
                type="text"
                value={settings.businessHours || ""}
                onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })}
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Global SEO Metadata */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-500 border-b border-slate-800 pb-2">
            2. Global Search Engine Optimization (SEO)
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Default Site Title
            </label>
            <input
              type="text"
              value={settings.siteTitle || ""}
              onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Default Meta Description
            </label>
            <textarea
              rows={3}
              value={settings.siteDescription || ""}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Footer Configuration */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-5">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-500 border-b border-slate-800 pb-2">
            3. Footer Text
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Footer Description
            </label>
            <textarea
              rows={2}
              value={settings.footerText || ""}
              onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Copyright Note
            </label>
            <input
              type="text"
              value={settings.copyrightText || ""}
              onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {([
              ["socialTiktok", "TikTok URL"],
              ["socialInstagram", "Instagram URL"],
              ["socialTwitter", "Twitter / X URL"],
              ["socialFacebook", "Facebook URL"],
            ] as const).map(([key, label]) => (
              <div key={key}>
                <label htmlFor={key} className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  {label}
                </label>
                <input
                  id={key}
                  type="url"
                  value={settings[key] || ""}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                  placeholder="https://"
                  className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-amber-600/30 hover:bg-amber-500 transition-all disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{saving ? "Saving Changes..." : "Save All Settings"}</span>
        </button>
      </form>
    </div>
  );
}
