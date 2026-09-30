import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import PostCard from "@/components/blog/PostCard";
import MarkdownContent from "@/components/blog/Markdown";
import { orderHref } from "@/components/marketing/PricingCards";
import { fetchApi } from "@/lib/serverApi";
import { formatDate } from "@/lib/format";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

// Posts are rendered the first time someone opens them, then cached and
// refreshed at most once a minute (see lib/serverApi.js)
export function generateStaticParams() {
  return [];
}

const loadPost = async (slug) => {
  const data = await fetchApi(`/posts/${encodeURIComponent(slug)}`);
  if (data === null) notFound();
  if (data === undefined) throw new Error("The blog is temporarily unavailable");
  return data;
};

export async function generateMetadata({ params }) {
  const { post } = await loadPost((await params).slug);
  const meta = pageMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    shareTitle: post.seoTitle || post.title,
  });

  // Use the cover image when sharing, otherwise the site-wide image
  const image = post.coverImage?.url && { url: post.coverImage.url, alt: post.coverImage.alt || post.title };
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      ...(image && { images: [image] }),
    },
    twitter: { ...meta.twitter, ...(image && { images: [image.url] }) },
  };
}

export default async function BlogPostPage({ params }) {
  const { post, related } = await loadPost((await params).slug);
  const url = `${site.url}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        url,
        ...(post.coverImage?.url && { image: new URL(post.coverImage.url, site.url).toString() }),
        author: { "@type": "Organization", name: site.name, url: site.url },
        publisher: { "@type": "Organization", name: site.name, url: site.url },
        keywords: post.tags?.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article>
        <header className="relative overflow-hidden bg-brand-950">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,111,246,0.35),transparent_60%)]" />
          <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
            <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
              <Link href="/blog" className="hover:text-white">Blog</Link>
              {post.category && (
                <>
                  <span className="mx-2" aria-hidden="true">/</span>
                  <Link href={`/blog?category=${encodeURIComponent(post.category)}`} className="text-accent-400 hover:text-accent-500">
                    {post.category}
                  </Link>
                </>
              )}
            </nav>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white sm:text-5xl">{post.title}</h1>
            {post.excerpt && <p className="mt-5 text-lg leading-8 text-slate-300">{post.excerpt}</p>}
            <p className="mt-6 text-sm text-slate-400">
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {post.readMinutes} min read · By the {site.name} team
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
          {post.coverImage?.url && (
            <div className="relative -mt-2 mb-10 aspect-video overflow-hidden rounded-2xl shadow-lg ring-1 ring-slate-200">
              <Image src={post.coverImage.url} alt={post.coverImage.alt || ""} fill priority sizes="(min-width: 768px) 720px, 100vw" className="object-cover" />
            </div>
          )}

          <MarkdownContent>{post.content}</MarkdownContent>

          {post.tags?.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-2 border-t border-slate-200 pt-8" aria-label="Tags">
              {post.tags.map((t) => (
                <li key={t} className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">#{t}</li>
              ))}
            </ul>
          )}
        </div>
      </article>

      <section className="border-t border-slate-200 bg-slate-50 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-brand-600 px-6 py-10 text-center sm:px-12">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Get accurate roof measurements without the ladder</h2>
            <p className="mx-auto mt-3 max-w-2xl text-brand-100">Order a report online and download it from your dashboard.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href={orderHref()} variant="accent" size="lg">Order a report</Button>
              <Button href="/sample-reports" variant="light" size="lg">See a sample</Button>
            </div>
          </div>

          {related.length > 0 && (
            <>
              <h2 className="mt-16 text-2xl font-bold">Keep reading</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {related.map((p) => (
                  <PostCard key={p.slug} post={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
