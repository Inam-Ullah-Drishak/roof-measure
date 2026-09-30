import rateLimit from "express-rate-limit";

const MINUTE = 60 * 1000;

// Same JSON shape as every other error in the API
const limiter = ({ windowMinutes, limit, message, ...options }) =>
  rateLimit({
    windowMs: windowMinutes * MINUTE,
    limit,
    standardHeaders: "draft-8", // sends RateLimit headers so the frontend can show "try again in X"
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json({ message }),
    ...options,
  });

// Whole API: generous, just stops floods and scrapers
export const apiLimiter = limiter({
  windowMinutes: 15,
  limit: 300,
  message: "Too many requests, please slow down and try again shortly.",
});

// Login: only FAILED attempts count, so real users are never blocked
export const loginLimiter = limiter({
  windowMinutes: 15,
  limit: 10,
  skipSuccessfulRequests: true,
  message: "Too many failed login attempts. Please try again in 15 minutes.",
});

export const registerLimiter = limiter({
  windowMinutes: 60,
  limit: 10,
  message: "Too many accounts created from this network. Please try again later.",
});

// Also protects customers' inboxes from being spammed with reset emails
export const passwordResetLimiter = limiter({
  windowMinutes: 60,
  limit: 5,
  message: "Too many password reset requests. Please try again in an hour.",
});

export const contactLimiter = limiter({
  windowMinutes: 60,
  limit: 5,
  message: "Too many messages sent. Please try again later or call us directly.",
});

export const newsletterLimiter = limiter({
  windowMinutes: 60,
  limit: 10,
  message: "Too many signups from this network. Please try again later.",
});
