"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import Button, { Spinner } from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Alert from "@/components/ui/Alert";
import Field from "@/components/ui/Field";
import PageHeader from "@/components/dashboard/PageHeader";
import MarkdownContent from "@/components/blog/Markdown";
import { PostStatusBadge } from "@/components/admin/AdminPosts";
import { api } from "@/lib/api";
import { useApi } from "@/lib/useApi";
import { formatDate } from "@/lib/format";
import { site } from "@/config/site";

// Same rules as the server (server/src/models/Post.js)
const slugify = (text = "") =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");

const LIMITS = { title: 150, excerpt: 300, seoTitle: 70, seoDescription: 160 };

// Toolbar buttons: "block" starts a new block, "wrap" wraps the selected text
const TOOLS = [
  { label: "H2", title: "Heading", block: "## Heading\n\n" },
  { label: "H3", title: "Subheading", block: "### Subheading\n\n" },
  { label: "B", title: "Bold", className: "font-bold", wrap: ["**", "**", "bold text"] },
  { label: "I", title: "Italic", className: "italic", wrap: ["*", "*", "italic text"] },
  { label: "Link", title: "Link", wrap: ["[", "](https://)", "link text"] },
  { label: "• List", title: "Bullet list", block: "- First item\n- Second item\n\n" },
  { label: "1. List", title: "Numbered list", block: "1. First step\n2. Second step\n\n" },
  { label: "Tip", title: "Highlighted tip box", block: "> **Tip:** Your tip here\n\n" },
  { label: "Table", title: "Table", block: "| Column 1 | Column 2 |\n| --- | --- |\n| Value | Value |\n\n" },
];

const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";

const toForm = (post = {}) => ({
  title: post.title || "",
  slug: post.slug || "",
  excerpt: post.excerpt || "",
  content: post.content || "",
  category: post.category || "Guides",
  tags: (post.tags || []).join(", "),
  coverImage: post.coverImage || null,
  seoTitle: post.seoTitle || "",
  seoDescription: post.seoDescription || "",
});

// Loads the post (when editing) and then shows the form
export default function PostEditor({ id }) {
  const { data, error, loading } = useApi(id ? `/admin/posts/${id}` : "/admin/posts?limit=1");

  if (loading && !data) {
    return <div className="flex justify-center py-24 text-brand-600"><Spinner className="h-8 w-8" /></div>;
  }

  if (id && (error || !data?.post)) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <p className="mt-2 text-slate-600">{error?.message || "This post doesn't exist or was deleted."}</p>
        <Button href="/admin/blog" variant="outline" className="mt-6">Back to blog</Button>
      </div>
    );
  }

  return <EditorForm key={data?.post?._id || "new"} post={data?.post} categories={data?.categories || []} />;
}

function EditorForm({ post, categories }) {
  const router = useRouter();
  const isNew = !post;

  const [saved, setSaved] = useState(post);
  const [form, setForm] = useState(() => toForm(post));
  const [initial, setInitial] = useState(() => JSON.stringify(toForm(post)));
  const [slugEdited, setSlugEdited] = useState(Boolean(post));
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState({ type: "", message: "" });

  const dirty = JSON.stringify(form) !== initial;
  const published = saved?.status === "published";

  // Warn before closing the tab with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const set = (field, value) => {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (field === "title" && !slugEdited) next.slug = slugify(value);
      return next;
    });
    setNotice({ type: "", message: "" });
  };

  const save = async (status) => {
    if (!form.title.trim()) {
      setNotice({ type: "error", message: "Please add a title first." });
      return;
    }
    if (status === "published" && !form.content.trim()) {
      setNotice({ type: "error", message: "Write the article before publishing it." });
      return;
    }

    setBusy(status || "save");
    setNotice({ type: "", message: "" });
    const body = { ...form, slug: form.slug || undefined, ...(status && { status }) };

    try {
      const res = isNew
        ? await api("/admin/posts", { method: "POST", body })
        : await api(`/admin/posts/${saved._id}`, { method: "PATCH", body });

      const fresh = toForm(res.post);
      setSaved(res.post);
      setForm(fresh);
      setInitial(JSON.stringify(fresh));
      setSlugEdited(true);
      setNotice({
        type: "success",
        message: res.post.status === "published" ? `${res.message}. It's live on the website within about a minute.` : res.message,
      });
      if (isNew) router.replace(`/admin/blog/${res.post._id}`);
    } catch (err) {
      setNotice({ type: "error", message: err.message });
    } finally {
      setBusy("");
    }
  };

  const remove = async () => {
    if (!window.confirm(`Delete "${saved.title}"? This can't be undone.`)) return;
    setBusy("delete");
    try {
      await api(`/admin/posts/${saved._id}`, { method: "DELETE" });
      setInitial(JSON.stringify(form)); // don't warn about unsaved changes
      router.replace("/admin/blog");
    } catch (err) {
      setNotice({ type: "error", message: err.message });
      setBusy("");
    }
  };

  return (
    <>
      <PageHeader
        title={isNew ? "New post" : "Edit post"}
        description={
          saved
            ? `${published ? `Published ${formatDate(saved.publishedAt)}` : "Draft"} · last saved ${formatDate(saved.updatedAt, { time: true })}`
            : "Write in the editor, then save a draft or publish."
        }
        actions={saved && <PostStatusBadge status={saved.status} />}
      >
        <BackButton href="/admin/blog">Back to blog</BackButton>
      </PageHeader>

      <Alert type={notice.type || "info"} className="mb-6">{notice.message}</Alert>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <label htmlFor="post-title" className="mb-1.5 block text-sm font-medium text-slate-800">Title <span className="text-red-500">*</span></label>
            <input
              id="post-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              maxLength={LIMITS.title}
              placeholder="e.g. How to Calculate Roofing Squares"
              className={`${inputClass} text-lg font-semibold`}
            />

            <label htmlFor="post-slug" className="mb-1.5 mt-5 block text-sm font-medium text-slate-800">URL</label>
            <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200">
              <span className="hidden flex-none pl-3.5 text-sm text-slate-500 sm:inline">{site.url.replace(/^https?:\/\//, "")}/blog/</span>
              <input
                id="post-slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugEdited(true);
                  set("slug", slugify(e.target.value.replace(/\s/g, "-")) + (e.target.value.endsWith("-") ? "-" : ""));
                }}
                onBlur={() => set("slug", slugify(form.slug))}
                className="min-w-0 flex-1 rounded-r-lg bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none sm:rounded-l-none"
              />
            </div>
            {published && form.slug !== saved.slug && (
              <p className="mt-1.5 text-sm text-amber-700">Changing the URL of a published post breaks links that people already shared.</p>
            )}

            <label htmlFor="post-excerpt" className="mb-1.5 mt-5 block text-sm font-medium text-slate-800">Summary</label>
            <textarea
              id="post-excerpt"
              rows={2}
              value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              maxLength={LIMITS.excerpt}
              placeholder="One or two sentences shown on the blog page and in Google results."
              className={inputClass}
            />
            <Counter value={form.excerpt} max={LIMITS.excerpt} />
          </Card>

          <ContentEditor value={form.content} onChange={(v) => set("content", v)} />
        </div>

        <div className="space-y-6">
          <Card title={published ? "Published" : "Publish"}>
            <div className="flex flex-col gap-2">
              {published ? (
                <>
                  <Button onClick={() => save()} loading={busy === "save"} disabled={Boolean(busy) || !dirty}>Update post</Button>
                  <Button variant="outline" onClick={() => save("draft")} loading={busy === "draft"} disabled={Boolean(busy)}>Unpublish</Button>
                  <a
                    href={`/blog/${saved.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-center text-sm font-semibold text-brand-700 hover:text-brand-800"
                  >
                    View on website ↗
                  </a>
                </>
              ) : (
                <>
                  <Button onClick={() => save("published")} loading={busy === "published"} disabled={Boolean(busy)}>Publish</Button>
                  <Button variant="outline" onClick={() => save("draft")} loading={busy === "draft"} disabled={Boolean(busy) || (!dirty && !isNew)}>
                    Save draft
                  </Button>
                </>
              )}
            </div>
            {dirty && <p className="mt-3 text-center text-xs text-amber-700">You have unsaved changes.</p>}
            {saved && (
              <button
                type="button"
                onClick={remove}
                disabled={Boolean(busy)}
                className="mt-4 w-full border-t border-slate-100 pt-4 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
              >
                {busy === "delete" ? "Deleting…" : "Delete post"}
              </button>
            )}
          </Card>

          <CoverImage value={form.coverImage} onChange={(v) => set("coverImage", v)} />

          <Card title="Category & tags">
            <label htmlFor="post-category" className="mb-1.5 block text-sm font-medium text-slate-800">Category</label>
            <input
              id="post-category"
              list="post-categories"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              maxLength={50}
              className={inputClass}
            />
            <datalist id="post-categories">
              {[...new Set(["Guides", "Business", "News", ...categories])].map((c) => <option key={c} value={c} />)}
            </datalist>
            <Field
              className="mt-4"
              label="Tags"
              name="tags"
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              placeholder="roof pitch, estimating"
              hint="Separate with commas (up to 10)."
            />
          </Card>

          <SeoPanel form={form} set={set} />
        </div>
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Need help with formatting? The toolbar adds the formatting for you. <Link href="/blog" target="_blank" className="font-semibold text-brand-700">See the live blog ↗</Link>
      </p>
    </>
  );
}

function Counter({ value, max }) {
  const n = value.length;
  return <p className={`mt-1 text-right text-xs ${n > max * 0.9 ? "text-amber-700" : "text-slate-400"}`}>{n}/{max}</p>;
}

// Markdown editor with a formatting toolbar, image upload and live preview
function ContentEditor({ value, onChange }) {
  const ref = useRef(null);
  const fileRef = useRef(null);
  const [tab, setTab] = useState("write");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Wraps the selected text (or a placeholder) and keeps the cursor in place
  const wrap = (before, after = "", placeholder = "text") => {
    const el = ref.current;
    const { selectionStart: s, selectionEnd: e } = el;
    const selected = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + selected + after + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + selected.length);
    });
  };

  // Starts a new block (heading, list...) on its own line
  const block = (text) => {
    const el = ref.current;
    const s = el.selectionStart;
    const needsBreak = s > 0 && value[s - 1] !== "\n" ? "\n\n" : "";
    const next = value.slice(0, s) + needsBreak + text + value.slice(el.selectionEnd);
    onChange(next);
    const pos = s + needsBreak.length + text.length;
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  };

  const uploadImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("image", file);
      const res = await api("/admin/posts/images", { method: "POST", body });
      const alt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      block(`![${alt}](${res.url})\n\n`);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const applyTool = (t) => (t.wrap ? wrap(...t.wrap) : block(t.block));

  return (
    <Card>
      <div className="-mx-5 -mt-5 mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3 sm:-mx-6 sm:px-6">
        <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-sm font-medium" role="tablist">
          {["write", "preview"].map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1.5 capitalize ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "write" && (
          <div className="flex flex-wrap gap-1">
            {TOOLS.map((t) => (
              <button
                key={t.label}
                type="button"
                title={t.title}
                onClick={() => applyTool(t)}
                className={`rounded-md px-2.5 py-1.5 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 ${t.className || ""}`}
              >
                {t.label}
              </button>
            ))}
            <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.webp,.gif" onChange={uploadImage} className="sr-only" id="content-image" />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="rounded-md bg-brand-50 px-2.5 py-1.5 text-sm font-medium text-brand-700 ring-1 ring-brand-100 hover:bg-brand-100 disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "Image"}
            </button>
          </div>
        )}
      </div>

      <Alert type="error" className="mb-3">{error}</Alert>

      {tab === "write" ? (
        <>
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={24}
            aria-label="Article content"
            placeholder={"Start writing your article…\n\nUse the toolbar to add headings, lists, tips, tables and images."}
            className={`${inputClass} font-mono text-sm leading-6`}
          />
          <p className="mt-2 text-xs text-slate-500">
            Formatting uses Markdown: <code>## Heading</code>, <code>**bold**</code>, <code>- list item</code>, <code>[link](https://…)</code>. Switch to Preview to see how it looks.
          </p>
        </>
      ) : value.trim() ? (
        <div className="min-h-96 rounded-lg bg-white">
          <MarkdownContent>{value}</MarkdownContent>
        </div>
      ) : (
        <p className="py-16 text-center text-sm text-slate-500">Nothing to preview yet.</p>
      )}
    </Card>
  );
}

function CoverImage({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("image", file);
      const res = await api("/admin/posts/images", { method: "POST", body });
      onChange({ key: res.key, url: res.url, alt: value?.alt || "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card title="Cover image" description="Shown on blog cards and when the post is shared.">
      <Alert type="error" className="mb-3">{error}</Alert>
      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.webp,.gif" onChange={upload} className="sr-only" id="cover-image" />

      {value?.url ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- served by our API */}
          <img src={value.url} alt={value.alt || ""} className="aspect-video w-full rounded-lg object-cover ring-1 ring-slate-200" />
          <Field
            className="mt-4"
            label="Image description"
            name="coverAlt"
            value={value.alt || ""}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            maxLength={200}
            hint="Describe the image for screen readers and Google."
          />
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline" loading={uploading} onClick={() => inputRef.current?.click()}>Replace</Button>
            <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" disabled={uploading} onClick={() => onChange(null)}>Remove</Button>
          </div>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-video w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 text-sm text-slate-500 hover:border-brand-400 hover:text-brand-700 disabled:opacity-60"
        >
          {uploading ? <Spinner className="h-6 w-6" /> : (
            <>
              <span className="font-semibold text-brand-700">Upload image</span>
              <span className="mt-1 text-xs">JPG, PNG, WebP or GIF · up to 5 MB · 1200×675 works best</span>
            </>
          )}
        </button>
      )}
    </Card>
  );
}

function SeoPanel({ form, set }) {
  const title = form.seoTitle || form.title || "Post title";
  const description = form.seoDescription || form.excerpt || "The summary of your post appears here.";
  const url = `${site.url.replace(/^https?:\/\//, "")} › blog › ${form.slug || "post-url"}`;

  return (
    <Card title="Google search" description="Optional. Leave empty to use the title and summary.">
      <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-200" aria-label="Google result preview">
        <p className="truncate text-xs text-slate-600">{url}</p>
        <p className="mt-1 line-clamp-2 text-lg leading-snug text-[#1a0dab]">{title} | {site.name}</p>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{description}</p>
      </div>

      <label htmlFor="seo-title" className="mb-1.5 mt-4 block text-sm font-medium text-slate-800">SEO title</label>
      <input id="seo-title" value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} maxLength={LIMITS.seoTitle} className={inputClass} />
      <Counter value={form.seoTitle} max={LIMITS.seoTitle} />

      <label htmlFor="seo-description" className="mb-1.5 mt-2 block text-sm font-medium text-slate-800">SEO description</label>
      <textarea
        id="seo-description"
        rows={3}
        value={form.seoDescription}
        onChange={(e) => set("seoDescription", e.target.value)}
        maxLength={LIMITS.seoDescription}
        className={inputClass}
      />
      <Counter value={form.seoDescription} max={LIMITS.seoDescription} />
    </Card>
  );
}
