"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Layers,
  Building2,
  Image,
  FileText,
  Inbox,
  Settings,
  LogOut,
  FolderOpen,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user && pathname !== "/admin/login") {
          router.push("/admin/login");
        } else {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {
        if (pathname !== "/admin/login") {
          router.push("/admin/login");
        }
      });
  }, [pathname, router]);

  const handleLogout = async () => {
    await fetch("/api/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const navLinks = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Enquiries", href: "/admin/enquiries", icon: Inbox },
    { name: "Services", href: "/admin/services", icon: Layers },
    { name: "Projects", href: "/admin/projects", icon: Building2 },
    { name: "Gallery", href: "/admin/gallery", icon: Image },
    { name: "Media Library", href: "/admin/media", icon: FolderOpen },
    { name: "Insights / News", href: "/admin/insights", icon: FileText },
    { name: "Site Settings", href: "/admin/settings", icon: Settings },
  ];

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-800 bg-slate-900/90 shrink-0">
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
          <Link href="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-600 font-extrabold text-white text-sm">
              T
            </div>
            <div>
              <span className="text-sm font-black uppercase tracking-tight text-white block">
                Tierytek
              </span>
              <span className="text-[9px] uppercase tracking-widest text-amber-500 font-semibold block leading-none">
                Admin CMS
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isActive
                    ? "bg-amber-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-slate-800 p-4 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <span>Live Website</span>
            <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/50 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-400 hover:text-white md:hidden"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
              Engineering CMS Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            {currentUser && (
              <span className="text-xs text-slate-400">
                Logged in as <strong className="text-white">{currentUser.name}</strong>
              </span>
            )}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider ${
                    isActive ? "bg-amber-600 text-white" : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Child Pages */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
}
