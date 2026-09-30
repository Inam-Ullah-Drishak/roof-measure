import express from "express";
import { subscribe } from "../controllers/subscriberController.js";
import { newsletterLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

// Public newsletter signup (footer form)
router.post("/", newsletterLimiter, subscribe);

export default router;
