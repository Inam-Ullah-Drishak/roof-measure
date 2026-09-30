import Link from "next/link";
import { site } from "@/config/site";

// Placeholder logo: a roof outline with a measurement line.
export default function Logo({ light = false, className = "" }) {
  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 font-display text-lg font-bold ${
        light ? "text-white" : "text-slate-900"
      } ${className}`}
      aria-label={`${site.name} home`}
    >
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
        <rect width="40" height="40" rx="9" className="fill-brand-600" />
        <path d="M8 22 20 11l12 11" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 20v9h16v-9" fill="none" stroke="white" strokeWidth="3" strokeLinejoin="round" />
        <path d="M9 33h22" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
      </svg>
      {site.name}
    </Link>
  );
}
