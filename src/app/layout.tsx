import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { getSettings } from "@/lib/settings";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteUrl = getSiteUrl();
  return {
    title: {
      default: settings.siteTitle || "Tierytek Construction | Steel Construction & Engineering",
      template: "%s | Tierytek Construction",
    },
    description:
      settings.siteDescription ||
      "Tierytek Construction specializes in industrial steel framework, commercial roofing solutions, and architectural renovation across Nigeria.",
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: settings.siteTitle,
      description: settings.siteDescription,
      url: siteUrl,
      siteName: settings.companyName,
      type: "website",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-NG" suppressHydrationWarning>
      <head>
        {/*
          Fixed Problem 1:
          Instead of using raw <script dangerouslySetInnerHTML=...>, which triggers
          "Encountered a script tag while rendering React component" in React 19 / Turbopack,
          we use Next.js's official <Script> component with strategy="beforeInteractive".
        */}
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                document.documentElement.classList.add('js');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-amber-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
