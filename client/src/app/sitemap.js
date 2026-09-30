import { site } from "@/config/site";
import { fetchApi } from "@/lib/serverApi";

// Public pages Google should index. Add new public pages here.
// (Set NEXT_PUBLIC_SITE_URL to the real domain in production.)
const pages = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/how-it-works", priority: 0.8, changeFrequency: "monthly" },
  { path: "/sample-reports", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/register", priority: 0.5, changeFrequency: "yearly" },
  { path: "/login", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
];

// Published blog posts, added automatically (50 per API page)
async function blogPosts() {
  const all = [];
  for (let page = 1; page <= 20; page++) {
    const data = await fetchApi(`/posts?limit=50&page=${page}`, { revalidate: 3600 });
    all.push(...(data?.posts || []));
    if (!data || page >= data.pagination.pages) break;
  }
  return all.map((p) => ({
    url: new URL(`/blog/${p.slug}`, site.url).toString(),
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));
}

export default async function sitemap() {
  const lastModified = new Date();
  const staticPages = pages.map((p) => ({
    url: new URL(p.path, site.url).toString(),
    lastModified,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
  return [...staticPages, ...(await blogPosts())];
}
