"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Runtime application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-slate-100">
      <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-6">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-rose-400">
        Site Notice
      </span>

      <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
        Engineering System Temporarily Unavailable
      </h1>

      <p className="mt-4 max-w-md text-xs sm:text-sm text-slate-400 leading-relaxed">
        An unexpected error occurred while loading this page. Our technical team has been notified.
      </p>

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded bg-amber-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-amber-500 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Try Again</span>
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded border border-slate-700 bg-slate-900 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
        >
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
