"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/context/AuthContext";
import { customerNav } from "@/config/dashboardNav";
import MenuButton from "@/components/ui/MenuButton";
import { useMobileMenu, staggerDelay } from "@/lib/useMobileMenu";

const ICONS = {
  home: "M3 12 12 4l9 8M5 10v10h5v-6h4v6h5V10",
  plus: "M12 5v14M5 12h14",
  list: "M4 6h16M4 12h16M4 18h10",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
  users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0M16 3.1a4 4 0 0 1 0 7.8M22 20a7 7 0 0 0-4-6.3",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  team: "M4 8h16v11H4zM9 8V5h6v3M4 13h16",
  pen: "M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Zm9.5-13.5 4 4",
  inbox: "M4 13h4l2 3h4l2-3h4M4 13l2-8h12l2 8v6H4v-6Z",
};

// badges: { "/admin/enquiries": 3 } shows a count next to that link
export default function DashboardShell({ nav = customerNav, badges = {}, label, children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const { buttonRef, panelRef } = useMobileMenu(menuOpen, closeMenu);
  const pathname = usePathname();

  // "My orders" shouldn't light up on the "New order" page
  const isActive = (item) =>
    item.exact
      ? pathname === item.href
      : pathname === item.href ||
        (pathname.startsWith(`${item.href}/`) && !nav.some((n) => n !== item && n.href.startsWith(item.href) && pathname.startsWith(n.href)));

  // animate: slide the links in one by one (mobile drawer only)
  const renderLinks = (animate = false) => (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Dashboard">
      {nav.map((item, i) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={closeMenu}
          style={animate ? staggerDelay(menuOpen, i) : undefined}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive(item) ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          } ${
            animate
              ? `transition-[opacity,transform,background-color,color] duration-300 ease-out motion-reduce:transition-none ${
                  menuOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                }`
              : ""
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
        <div className="mt-8 flex flex-1 flex-col">{renderLinks()}</div>
        <UserMenu />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <Logo />
        <MenuButton ref={buttonRef} open={menuOpen} onClick={() => setMenuOpen((v) => !v)} controls="dashboard-drawer" />
      </header>

      {/* Mobile drawer: always rendered so it can animate in and out */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div
          className={`absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ease-out motion-reduce:transition-none ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
        />
        <div
          id="dashboard-drawer"
          ref={panelRef}
          className={`absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-white px-4 py-5 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <Logo />
            <MenuButton open onClick={closeMenu} />
          </div>
          {label && <p className="mt-1 px-2 text-xs font-semibold uppercase tracking-wider text-accent-600">{label}</p>}
          <div className="mt-8 flex flex-1 flex-col">{renderLinks(true)}</div>
          <UserMenu />
        </div>
      </div>

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
