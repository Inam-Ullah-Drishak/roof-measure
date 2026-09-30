"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import MenuButton from "@/components/ui/MenuButton";
import { mainNav } from "@/config/site";
import { useAuth, homeFor } from "@/context/AuthContext";
import { useMobileMenu, staggerDelay } from "@/lib/useMobileMenu";

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const { buttonRef, panelRef } = useMobileMenu(open, close);
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const isActive = (href) => pathname === href || pathname.startsWith(`${href}/`);

  const authButtons = loading ? (
    <div className="h-10 w-40" aria-hidden="true" />
  ) : user ? (
    <Button href={homeFor(user)} size="md" onClick={close}>
      {user.role === "admin" ? "Admin panel" : "My dashboard"}
    </Button>
  ) : (
    <>
      <Button href="/login" variant="ghost" onClick={close}>Log in</Button>
      <Button href="/register" onClick={close}>Order a report</Button>
    </>
  );

  // Mobile items slide in one after another
  const itemMotion = `transition-all duration-300 ease-out motion-reduce:transition-none ${
    open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
  }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(item.href) ? "text-brand-700" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">{authButtons}</div>

        <MenuButton ref={buttonRef} open={open} onClick={() => setOpen((v) => !v)} controls="mobile-menu" className="lg:hidden" />
      </div>

      {/* Dimmed page behind the menu */}
      <div
        className={`fixed inset-x-0 bottom-0 top-16 bg-slate-900/30 backdrop-blur-[2px] transition-opacity duration-300 motion-reduce:transition-none lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Menu panel: expands from 0 to full height (grid-rows trick animates height smoothly) */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className={`absolute inset-x-0 top-full grid border-slate-200 bg-white shadow-xl transition-[grid-template-rows,border-width] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none lg:hidden ${
          open ? "grid-rows-[1fr] border-t" : "grid-rows-[0fr]"
        }`}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="overflow-hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3 sm:px-6" aria-label="Mobile">
            {mainNav.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                style={staggerDelay(open, i)}
                className={`rounded-md px-3 py-2.5 font-medium ${itemMotion} ${
                  isActive(item.href) ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div
              style={staggerDelay(open, mainNav.length)}
              className={`mt-3 flex flex-col gap-2 border-t border-slate-200 pt-3 ${itemMotion}`}
            >
              {authButtons}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
