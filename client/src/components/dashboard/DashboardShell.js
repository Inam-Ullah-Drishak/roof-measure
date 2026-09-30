"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/context/AuthContext";
import { customerNav } from "@/config/dashboardNav";

const ICONS = {
  home: "M3 12 12 4l9 8M5 10v10h5v-6h4v6h5V10",
  plus: "M12 5v14M5 12h14",
  list: "M4 6h16M4 12h16M4 18h10",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
  users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0M16 3.1a4 4 0 0 1 0 7.8M22 20a7 7 0 0 0-4-6.3",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
};

// badges: { "/admin/enquiries": 3 } shows a count next to that link
export default function DashboardShell({ nav = customerNav, badges = {}, label, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // "My orders" shouldn't light up on the "New order" page
  const isActive = (item) =>
    item.exact
      ? pathname === item.href
      : pathname === item.href ||
        (pathname.startsWith(`${item.href}/`) && !nav.some((n) => n !== item && n.href.startsWith(item.href) && pathname.startsWith(n.href)));

  const links = (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Dashboard">
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMenuOpen(false)}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive(item) ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
          aria-current={isActive(item) ? "page" : undefined}
        >
          <svg className="h-5 w-5 flex-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={ICONS[item.icon]} />
          </svg>
          <span className="flex-1">{item.label}</span>
          {badges[item.href] > 0 && (
            <span className="rounded-full bg-accent-500 px-2 py-0.5 text-xs font-bold text-brand-950">
              {badges[item.href]}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white px-4 py-5 lg:flex">
        <Logo className="px-2" />
        {label && <p className="mt-1 px-2 text-xs font-semibold uppercase tracking-wider text-accent-600">{label}</p>}
        <div className="mt-8 flex flex-1 flex-col">{links}</div>
        <UserMenu />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="rounded-md p-2 text-slate-700 hover:bg-slate-100"
          aria-label="Open menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white px-4 py-5 shadow-xl">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-md p-2 text-slate-700 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <div className="mt-8 flex flex-1 flex-col">{links}</div>
            <UserMenu />
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</div>
      </main>
    </div>
  );
}

function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const onLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <div className="border-t border-slate-200 pt-4">
      <div className="flex items-center gap-3 px-2">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
          {user?.name?.[0]?.toUpperCase()}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
        </div>
      </div>
      <div className="mt-3 flex gap-2 px-2 text-sm">
        <Link href="/" className="text-slate-500 hover:text-slate-800">Website</Link>
        <span className="text-slate-300">·</span>
        <button type="button" onClick={onLogout} className="font-medium text-slate-500 hover:text-red-600">
          Log out
        </button>
      </div>
    </div>
  );
}
