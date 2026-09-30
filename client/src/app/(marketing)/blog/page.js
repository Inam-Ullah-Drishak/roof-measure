import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import PostCard from "@/components/blog/PostCard";
import { EmptyState } from "@/components/ui/Card";
import { fetchApi } from "@/lib/serverApi";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Guides and advice for roofing contractors, insurance adjusters and solar installers: roof measurement, pitch, squares, estimating and more.",
  path: "/blog",
  shareTitle: `Roofing Guides & Advice | ${site.name} Blog`,
});

const PER_PAGE = 12;

// ?category=Guides&page=2
export default async function BlogPage({ searchParams }) {
  const { category = "", page = "1" } = await searchParams;
  const query = new URLSearchParams({ limit: String(PER_PAGE), page });
  if (category) query.set("category", category);

  const data = await fetchApi(`/posts?${query}`);
  const posts = data?.posts || [];
  const categories = data?.categories || [];
  const pagination = data?.pagination;

  const href = (changes) => {
    const q = new URLSearchParams({ ...(category && { category }), ...changes });
    for (const [k, v] of [...q]) if (!v || (k === "page" && v === "1")) q.delete(k);
    return q.size ? `/blog?${q}` : "/blog";
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${site.name} Blog`,
    url: `${site.url}/blog`,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.excerpt,
      datePublished: p.publishedAt,
      url: `${site.url}/blog/${p.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero
        eyebrow="Blog"
        title="Roofing guides & advice"
        text="Practical articles on measuring roofs, estimating jobs and getting more from your roof reports."
      />

      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {categories.length > 1 && (
            <nav aria-label="Categories" className="mb-10 flex flex-wrap gap-2">
              {["", ...categories].map((c) => (
                <Link
                  key={c || "all"}
                  href={href({ category: c, page: "" })}
                  aria-current={c === category ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors ${
                    c === category ? "bg-brand-600 text-white ring-brand-600" : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {c || "All articles"}
                </Link>
              ))}
            </nav>
          )}

          {posts.length === 0 ? (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200">
              <EmptyState
                title={data === undefined ? "Articles couldn't be loaded" : "No articles yet"}
                text={data === undefined ? "Please try again in a moment." : "Check back soon for guides and tips."}
              />
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {pagination?.pages > 1 && (
            <nav aria-label="Pages" className="mt-12 flex items-center justify-center gap-4 text-sm font-semibold">
              {pagination.page > 1 && (
                <Link href={href({ page: String(pagination.page - 1) })} className="text-brand-700 hover:text-brand-800">&larr; Newer</Link>
              )}
              <span className="text-slate-500">Page {pagination.page} of {pagination.pages}</span>
              {pagination.page < pagination.pages && (
                <Link href={href({ page: String(pagination.page + 1) })} className="text-brand-700 hover:text-brand-800">Older &rarr;</Link>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  );
}
