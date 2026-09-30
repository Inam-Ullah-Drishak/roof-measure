import express from "express";
import {
  getPublishedPosts,
  getPublishedPost,
  getBlogImage,
} from "../controllers/postController.js";

const router = express.Router();

// Public blog (published posts only). Admin routes are in adminRoutes.js.
router.get("/", getPublishedPosts);
router.get("/images/:file", getBlogImage);
router.get("/:slug", getPublishedPost);

export default router;
