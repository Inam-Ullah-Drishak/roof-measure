import express from "express";
import { createEnquiry } from "../controllers/enquiryController.js";

const router = express.Router();

// Public contact form
router.post("/", createEnquiry);

export default router;
