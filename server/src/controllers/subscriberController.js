import Subscriber from "../models/Subscriber.js";
import asyncHandler from "../utils/asyncHandler.js";

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @route   POST /api/newsletter
// @access  Public
// Body: { email, source?, website? }  ("website" is a honeypot, like the contact form)
export const subscribe = asyncHandler(async (req, res) => {
  const { email, source, website } = req.body || {};
  const successReply = { message: "Thanks for subscribing! Watch your inbox for roofing tips and news." };

  if (website) return res.status(201).json(successReply);

  const clean = typeof email === "string" ? email.toLowerCase().trim() : "";
  if (!/^\S+@\S+\.\S+$/.test(clean) || clean.length > 200) {
    return res.status(400).json({ message: "Please enter a valid email" });
  }

  // Already subscribed: same friendly reply, so emails can't be probed
  await Subscriber.updateOne(
    { email: clean },
    { $setOnInsert: { email: clean, source: String(source || "website").slice(0, 50) } },
    { upsert: true }
  );

  res.status(201).json(successReply);
});

const buildFilter = (query) => {
  if (!query.search) return {};
  return { email: new RegExp(escapeRegex(String(query.search).trim()), "i") };
};

// @route   GET /api/admin/subscribers
// @access  Admin
// Query: ?search=gmail&page=1&limit=20
export const getSubscribers = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);
  const filter = buildFilter(req.query);

  const [subscribers, total] = await Promise.all([
    Subscriber.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Subscriber.countDocuments(filter),
  ]);

  res.json({ subscribers, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
});

// @route   GET /api/admin/subscribers/export
// @access  Admin
// CSV file to import into an email tool (Mailchimp, Brevo, etc.)
export const exportSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await Subscriber.find(buildFilter(req.query)).sort({ createdAt: -1 }).lean();

  // Quote every value; a leading = + - @ is prefixed so spreadsheets don't run it as a formula
  const cell = (v = "") => `"${String(v).replace(/^([=+\-@])/, "'$1").replace(/"/g, '""')}"`;
  const rows = [
    ["email", "source", "subscribed_at"],
    ...subscribers.map((s) => [s.email, s.source, s.createdAt.toISOString()]),
  ];

  res.attachment(`subscribers-${new Date().toISOString().slice(0, 10)}.csv`);
  res.type("text/csv");
  res.send(rows.map((r) => r.map(cell).join(",")).join("\n"));
});

// @route   DELETE /api/admin/subscribers/:id
// @access  Admin (e.g. when someone asks to be removed)
export const deleteSubscriber = asyncHandler(async (req, res) => {
  const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
  if (!subscriber) {
    return res.status(404).json({ message: "Subscriber not found" });
  }
  res.json({ message: `${subscriber.email} was removed` });
});
