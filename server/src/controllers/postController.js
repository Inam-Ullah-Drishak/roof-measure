import path from "path";
import Post, { POST_STATUSES, SLUG_PATTERN, slugify } from "../models/Post.js";
import asyncHandler from "../utils/asyncHandler.js";
import { saveFile, deleteFile, sendFile } from "../utils/storage.js";

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Blog images live in storage under "blog/" and are served by getBlogImage
const IMAGE_FOLDER = "blog";
const imageUrl = (key) => `/api/posts/images/${path.posix.basename(key)}`;

// Fields shown on blog cards (no article body)
const CARD_FIELDS = "title slug excerpt category tags coverImage publishedAt readMinutes";

// Makes the slug unique by adding -2, -3... if it's taken by another post
const uniqueSlug = async (base, excludeId) => {
  const root = base || "post";
  let slug = root;
  for (let n = 2; await Post.exists({ slug, _id: { $ne: excludeId } }); n++) {
    slug = `${root}-${n}`;
  }
  return slug;
};

// Copies allowed fields from the request body onto a post
const applyFields = (post, body) => {
  const fields = ["title", "excerpt", "content", "category", "seoTitle", "seoDescription"];
  for (const f of fields) if (body[f] !== undefined) post[f] = body[f];

  if (body.tags !== undefined) {
    const list = Array.isArray(body.tags) ? body.tags : String(body.tags).split(",");
    post.tags = [...new Set(list.map((t) => String(t).trim().toLowerCase()).filter(Boolean))].slice(0, 10);
  }

  if (body.status !== undefined) post.status = body.status;

  // Cover image: { key, url, alt } from the image upload, or null to remove it
  if (body.coverImage !== undefined) {
    post.coverImage = body.coverImage?.key
      ? { key: body.coverImage.key, url: imageUrl(body.coverImage.key), alt: body.coverImage.alt }
      : undefined;
  }
};

const validateStatusAndSlug = (body) => {
  if (body.status !== undefined && !POST_STATUSES.includes(body.status)) {
    return `Status must be one of: ${POST_STATUSES.join(", ")}`;
  }
  if (body.slug && !SLUG_PATTERN.test(body.slug)) {
    return "URL can only use lowercase letters, numbers and dashes";
  }
  if (body.coverImage?.key && !String(body.coverImage.key).startsWith(`${IMAGE_FOLDER}/`)) {
    return "Invalid cover image";
  }
  return null;
};

// ---------- Public ----------

// @route   GET /api/posts
// @access  Public
// Query: ?category=Guides&page=1&limit=12
export const getPublishedPosts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 50);

  const filter = { status: "published" };
  if (req.query.category) filter.category = String(req.query.category);

  const [posts, total, categories] = await Promise.all([
    Post.find(filter)
      .select(CARD_FIELDS)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
    Post.distinct("category", { status: "published" }),
  ]);

  res.json({
    posts,
    categories: categories.filter(Boolean).sort(),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @route   GET /api/posts/:slug
// @access  Public (published posts only)
export const getPublishedPost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug, status: "published" })
    .populate("author", "name")
    .lean();

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // Same category first, then the latest posts
  const related = await Post.find({ status: "published", _id: { $ne: post._id } })
    .select(CARD_FIELDS)
    .sort({ publishedAt: -1 })
    .limit(10)
    .lean();
  related.sort((a, b) => (b.category === post.category) - (a.category === post.category));

  res.json({ post, related: related.slice(0, 2) });
});

// @route   GET /api/posts/images/:file
// @access  Public (images used in blog posts)
export const getBlogImage = asyncHandler(async (req, res) => {
  await sendFile(res, `${IMAGE_FOLDER}/${req.params.file}`, req.params.file, { inline: true });
});

// ---------- Admin ----------

// @route   GET /api/admin/posts
// @access  Admin
// Query: ?status=draft&search=pitch&page=1&limit=20
export const getAllPosts = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);

  const filter = {};
  if (POST_STATUSES.includes(req.query.status)) filter.status = req.query.status;
  if (req.query.search) {
    const regex = new RegExp(escapeRegex(String(req.query.search).trim()), "i");
    filter.$or = [{ title: regex }, { excerpt: regex }, { category: regex }, { tags: regex }];
  }

  const [posts, total, counts] = await Promise.all([
    Post.find(filter)
      .select(`${CARD_FIELDS} status updatedAt createdAt author`)
      .populate("author", "name")
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
    Post.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  res.json({
    posts,
    counts: Object.fromEntries(counts.map((c) => [c._id, c.count])),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @route   GET /api/admin/posts/:id
// @access  Admin
export const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("author", "name")
    .populate("updatedBy", "name");

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const categories = await Post.distinct("category");
  res.json({ post, categories: categories.filter(Boolean).sort() });
});

// @route   POST /api/admin/posts
// @access  Admin
// Body: { title, slug?, excerpt, content, category, tags, coverImage, status, seoTitle, seoDescription }
export const createPost = asyncHandler(async (req, res) => {
  const body = req.body || {};

  if (!body.title?.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  const invalid = validateStatusAndSlug(body);
  if (invalid) return res.status(400).json({ message: invalid });

  const post = new Post({ author: req.user._id, updatedBy: req.user._id });
  applyFields(post, body);
  post.slug = await uniqueSlug(body.slug || slugify(body.title));
  await post.save();

  res.status(201).json({
    message: post.status === "published" ? "Post published" : "Draft saved",
    post,
  });
});

// @route   PATCH /api/admin/posts/:id
// @access  Admin
// Same body as create; only the fields sent are changed
export const updatePost = asyncHandler(async (req, res) => {
  const body = req.body || {};

  const invalid = validateStatusAndSlug(body);
  if (invalid) return res.status(400).json({ message: invalid });

  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (body.title !== undefined && !String(body.title).trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  const wasPublished = post.status === "published";
  const oldCoverKey = post.coverImage?.key;

  applyFields(post, body);

  if (body.slug !== undefined && body.slug !== post.slug) {
    if (await Post.exists({ slug: body.slug, _id: { $ne: post._id } })) {
      return res.status(409).json({ message: "Another post already uses this URL" });
    }
    post.slug = body.slug;
  }

  post.updatedBy = req.user._id;
  await post.save();

  // The old cover image is no longer used anywhere
  if (oldCoverKey && oldCoverKey !== post.coverImage?.key) {
    deleteFile(oldCoverKey).catch((err) => console.error(`Could not delete ${oldCoverKey}: ${err.message}`));
  }

  let message = "Changes saved";
  if (!wasPublished && post.status === "published") message = "Post published";
  if (wasPublished && post.status === "draft") message = "Post unpublished (moved to drafts)";

  res.json({ message, post });
});

// @route   DELETE /api/admin/posts/:id
// @access  Admin
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  if (post.coverImage?.key) {
    deleteFile(post.coverImage.key).catch((err) => console.error(`Could not delete ${post.coverImage.key}: ${err.message}`));
  }

  res.json({ message: `"${post.title}" was deleted` });
});

// @route   POST /api/admin/posts/images
// @access  Admin
// Form-data: image (one file). Returns { key, url } to use as a cover or inside the article.
export const uploadPostImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Please choose an image" });
  }

  const { key } = await saveFile(req.file.buffer, req.file.originalname, IMAGE_FOLDER);

  res.status(201).json({ message: "Image uploaded", key, url: imageUrl(key) });
});
