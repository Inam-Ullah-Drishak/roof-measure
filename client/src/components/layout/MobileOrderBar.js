"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import { orderHref } from "@/components/marketing/PricingCards";
import { useAuth, isStaff } from "@/context/AuthContext";
import { pricing } from "@/config/site";

const fromPrice = Math.min(...pricing.reportTypes.map((r) => r.price));

// Sticky "Order a report" bar on phones and tablets, shown after scrolling past the hero
export default function MobileOrderBar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Staff don't order; the contact page has its own form
  if (isStaff(user) || pathname === "/contact") return null;

  const href = user ? "/dashboard/orders/new" : orderHref();

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur transition-transform duration-300 motion-reduce:transition-none lg:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">Roof reports from ${fromPrice}</p>
          <p className="truncate text-xs text-slate-500">No subscription · order in minutes</p>
        </div>
        <Button href={href} variant="accent" className="flex-none">Order now</Button>
      </div>
    </div>
  );
}
