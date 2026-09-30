import Link from "next/link";
import { formatDate } from "@/lib/format";

// Blog post card (post comes from GET /api/posts)
export default function PostCard({ post }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-lg">
      {post.coverImage?.url && (
        // eslint-disable-next-line @next/next/no-img-element -- served by our API
        <img src={post.coverImage.url} alt={post.coverImage.alt || ""} loading="lazy" className="aspect-video w-full object-cover" />
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-3 text-xs">
          {post.category && <span className="rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-700">{post.category}</span>}
          <span className="text-slate-500">{post.readMinutes} min read</span>
        </div>
        <h3 className="mt-4 text-lg font-semibold leading-snug text-slate-900 group-hover:text-brand-700">
          <Link href={`/blog/${post.slug}`}>
            <span className="absolute inset-0" aria-hidden="true" />
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{post.excerpt}</p>}
        <time dateTime={post.publishedAt} className="mt-5 text-xs text-slate-500">{formatDate(post.publishedAt)}</time>
      </div>
    </article>
  );
}
