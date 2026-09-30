"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button";

// Builds a URL for the current page with some query params changed.
// Changing a filter resets to page 1 unless a page is given.
export function useQueryHref() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (changes) => {
    const q = new URLSearchParams(searchParams);
    if (!("page" in changes)) q.delete("page");
    for (const [key, value] of Object.entries(changes)) {
      if (value === "" || value == null || (key === "page" && Number(value) <= 1)) q.delete(key);
      else q.set(key, String(value));
    }
    const qs = q.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };
}

export function FilterTabs({ param = "status", tabs, value }) {
  const hrefFor = useQueryHref();
  return (
    <div className="flex gap-1 overflow-x-auto rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
      {tabs.map((t) => (
        <Link
          key={t.value}
          href={hrefFor({ [param]: t.value })}
          className={`whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ${
            value === t.value ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"
          }`}
          aria-current={value === t.value ? "page" : undefined}
        >
          {t.label}
          {t.count > 0 && (
            <span className={`ml-2 rounded-full px-1.5 text-xs ${value === t.value ? "bg-white/20" : "bg-accent-500 text-brand-950"}`}>
              {t.count}
            </span>
          )}
        </Link>
      ))}
    </div>
  );
}

// Search box that updates ?search= in the URL after typing stops.
// Render it with key={currentSearch} so it resets when the URL changes elsewhere.
export function SearchBox({ value = "", placeholder = "Search…", className = "" }) {
  const router = useRouter();
  const hrefFor = useQueryHref();
  const [text, setText] = useState(value);
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const onChange = (e) => {
    const next = e.target.value;
    setText(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => router.replace(hrefFor({ search: next.trim() })), 350);
  };

  return (
    <div className={`relative ${className}`}>
      <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="search"
        value={text}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={placeholder}
        className="block w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
    </div>
  );
}

export function Pagination({ pagination, noun = "results" }) {
  const router = useRouter();
  const hrefFor = useQueryHref();
  if (!pagination || pagination.pages <= 1) return null;
  const { page, pages, total } = pagination;

  return (
    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
      <p className="text-slate-500">
        Page {page} of {pages} · {total} {noun}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => router.push(hrefFor({ page: page - 1 }))}>
          Previous
        </Button>
        <Button variant="outline" size="sm" disabled={page >= pages} onClick={() => router.push(hrefFor({ page: page + 1 }))}>
          Next
        </Button>
      </div>
    </div>
  );
}
