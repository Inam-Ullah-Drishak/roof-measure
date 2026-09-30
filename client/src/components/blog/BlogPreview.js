import Link from "next/link";
import SectionHeading from "@/components/marketing/SectionHeading";
import PostCard from "@/components/blog/PostCard";
import { fetchApi } from "@/lib/serverApi";

// Latest 3 published articles, shown on the Home page (hidden if there are none)
export default async function BlogPreview({ className = "" }) {
  const data = await fetchApi("/posts?limit=3");
  const posts = data?.posts || [];
  if (posts.length === 0) return null;

  return (
    <section className={`py-20 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="From the blog"
          title="Guides for roofing professionals"
          text="Practical advice on measuring, estimating and running a roofing business."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/blog" className="font-semibold text-brand-700 hover:text-brand-800">Read all articles &rarr;</Link>
        </div>
      </div>
    </section>
  );
}
