import Link from "next/link";
import { ArrowLeft, HardHat } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-slate-100">
      <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
        <HardHat className="h-8 w-8" />
      </div>

      <span className="text-xs font-bold uppercase tracking-widest text-amber-500">
        Error 404
      </span>

      <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
        Construction Zone: Page Not Found
      </h1>

      <p className="mt-4 max-w-md text-xs sm:text-sm text-slate-400 leading-relaxed">
        The drawing or page you are looking for does not exist or has been relocated.
      </p>

      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded bg-amber-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-amber-500 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
}
