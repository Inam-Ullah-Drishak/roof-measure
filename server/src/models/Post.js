import mongoose from "mongoose";

export const POST_STATUSES = ["draft", "published"];

// Lowercase words joined by dashes, e.g. "roof-pitch-explained"
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugify = (text = "") =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");

const imageSchema = new mongoose.Schema(
  {
    key: { type: String, required: true }, // storage key, used to delete the file
    url: { type: String, required: true },
    alt: { type: String, trim: true, maxlength: 200 },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title is too long (max 150 characters)"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 80,
      match: [SLUG_PATTERN, "URL can only use lowercase letters, numbers and dashes"],
    },
    // Short summary for blog cards and Google
    excerpt: {
      type: String,
      trim: true,
      maxlength: [300, "Summary is too long (max 300 characters)"],
    },
    // Article body in Markdown
    content: {
      type: String,
      default: "",
      maxlength: [100000, "Article is too long"],
    },
    category: { type: String, trim: true, maxlength: 50, default: "Guides" },
    tags: [{ type: String, trim: true, lowercase: true, maxlength: 30 }],
    coverImage: imageSchema,
    status: { type: String, enum: POST_STATUSES, default: "draft" },
    publishedAt: Date,
    readMinutes: { type: Number, default: 1 },
    // Optional overrides for Google; the title/excerpt are used when empty
    seoTitle: { type: String, trim: true, maxlength: [70, "SEO title is too long (max 70 characters)"] },
    seoDescription: { type: String, trim: true, maxlength: [160, "SEO description is too long (max 160 characters)"] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

postSchema.pre("save", function () {
  if (this.isModified("content")) {
    const words = this.content.trim().split(/\s+/).filter(Boolean).length;
    this.readMinutes = Math.max(1, Math.round(words / 200));
  }
  // First time it goes live: stamp the publish date
  if (this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
});

postSchema.index({ status: 1, publishedAt: -1 });

const Post = mongoose.model("Post", postSchema);

export default Post;
