"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

// Goes back to the previous page (keeping its filters, search and page number).
// If there's nothing to go back to on this site, e.g. the page was opened from an
// email link, it goes to `href` instead. Still a real link, so "open in new tab" works.
// alwaysLink: skip history (e.g. just returned from Stripe, where "back" would reopen checkout)
export default function BackButton({ href, children = "Back", alwaysLink = false, className = "" }) {
  const router = useRouter();

  const onClick = (e) => {
    if (alwaysLink || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // normal link behavior

    const cameFromThisSite =
      window.history.length > 1 &&
      (!document.referrer || new URL(document.referrer).origin === window.location.origin);

    if (cameFromThisSite) {
      e.preventDefault();
      router.back();
    }
  };

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group mb-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white py-1.5 pl-2.5 pr-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 ${className}`}
    >
      <svg
        className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transition-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M19 12H5M11 18l-6-6 6-6" />
      </svg>
      {children}
    </Link>
  );
}
