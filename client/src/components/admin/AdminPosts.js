"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Button, { Spinner } from "@/components/ui/Button";
import Card, { EmptyState } from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import PageHeader from "@/components/dashboard/PageHeader";
import { FilterTabs, SearchBox, Pagination } from "@/components/ui/ListControls";
import { useApi } from "@/lib/useApi";
import { formatDate } from "@/lib/format";

export function PostStatusBadge({ status }) {
  return status === "published" ? (
    <Badge className="bg-green-50 text-green-800 ring-green-200">Published</Badge>
  ) : (
    <Badge className="bg-slate-100 text-slate-600 ring-slate-200">Draft</Badge>
  );
}

// Admin: list of all blog posts
export default function AdminPosts() {
  const searchParams = useSearchParams();
  const get = (k) => searchParams.get(k) || "";

  const query = new URLSearchParams({ limit: "20" });
  for (const k of ["status", "search", "page"]) if (get(k)) query.set(k, get(k));
  const { data, error, loading } = useApi(`/admin/posts?${query}`);
  const posts = data?.posts || [];
  const counts = data?.counts || {};

  const tabs = [
    { value: "", label: "All" },
    { value: "published", label: "Published", count: counts.published },
    { value: "draft", label: "Drafts", count: counts.draft },
  ];

  return (
    <>
      <PageHeader
        title="Blog"
        description="Write and publish articles for the website."
        actions={<Button href="/admin/blog/new">New post</Button>}
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <FilterTabs tabs={tabs} value={get("status")} />
        <SearchBox key={get("search")} value={get("search")} placeholder="Search title, category or tag" className="md:w-80" />
      </div>

      <Card className="mt-4">
        {loading && !data ? (
          <div className="flex justify-center py-10 text-brand-600"><Spinner className="h-6 w-6" /></div>
        ) : error ? (
          <Alert type="error">{error.message}</Alert>
        ) : posts.length === 0 ? (
          <EmptyState
            title={get("search") || get("status") ? "No posts match" : "No posts yet"}
            text="Articles help customers find you on Google."
            action={<Button href="/admin/blog/new">Write your first post</Button>}
          />
        ) : (
          <ul className={`divide-y divide-slate-100 ${loading ? "opacity-60" : ""}`}>
            {posts.map((p) => (
              <li key={p._id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center">
                {p.coverImage?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element -- served by our API
                  <img src={p.coverImage.url} alt="" className="hidden h-14 w-24 flex-none rounded-lg object-cover ring-1 ring-slate-200 sm:block" />
                ) : (
                  <span className="hidden h-14 w-24 flex-none items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400 sm:flex">No image</span>
                )}
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/blog/${p._id}`} className="block truncate font-semibold text-slate-900 hover:text-brand-700">
                    {p.title}
                  </Link>
                  <p className="truncate text-sm text-slate-500">
                    /blog/{p.slug}
                    {p.category && ` · ${p.category}`}
                    {` · ${p.readMinutes} min read`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <PostStatusBadge status={p.status} />
                  <span className="text-slate-500">
                    {p.status === "published" ? `Published ${formatDate(p.publishedAt)}` : `Edited ${formatDate(p.updatedAt)}`}
                  </span>
                  <Button href={`/admin/blog/${p._id}`} size="sm" variant="outline">Edit</Button>
                  {p.status === "published" && (
                    <a href={`/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-700 hover:text-brand-800">
                      View ↗
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        <Pagination pagination={data?.pagination} noun="posts" />
      </Card>
    </>
  );
}
