import { getSettings } from "@/lib/settings";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { QuoteForm } from "@/components/QuoteForm";
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Tierytek Construction",
  description:
    "Contact Tierytek Construction for structural steel inquiries, commercial roofing assessments, site surveys, and construction project consultations.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Navbar companyName={settings.companyName || "Tierytek Construction"} phone={settings.phone || ""} />

      {/* Header */}
      <section className="border-b border-slate-800 bg-slate-900/40 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
              Direct Inquiries
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Contact Tierytek Construction
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Reach out to our engineering office regarding upcoming commercial or industrial developments, structural consultations, or quotation requests.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-5 space-y-8">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 space-y-6">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  Office & Operations
                </h2>

                <div className="space-y-5 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white font-semibold">Location:</strong>
                      <p className="text-xs text-slate-400 mt-0.5">{settings.address || "Lagos, Nigeria"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white font-semibold">Phone Inquiries:</strong>
                      <a
                        href={`tel:${settings.phone}`}
                        className="text-xs text-amber-400 hover:underline block mt-0.5"
                      >
                        {settings.phone || "+234 800 000 0000"}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white font-semibold">Email:</strong>
                      <a
                        href={`mailto:${settings.email}`}
                        className="text-xs text-amber-400 hover:underline block mt-0.5"
                      >
                        {settings.email || "info@tierytek.com"}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-white font-semibold">Working Hours:</strong>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {settings.businessHours || "Monday - Friday: 8:00 AM - 5:00 PM"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <QuoteForm />
            </div>
          </div>
        </div>
      </section>

      <Footer settings={settings} />
    </div>
  );
}
