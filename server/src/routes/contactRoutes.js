import express from "express";
import { createEnquiry } from "../controllers/enquiryController.js";
import { contactLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

// Public contact form
router.post("/", contactLimiter, createEnquiry);

export default router;
