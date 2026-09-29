import Enquiry, { ENQUIRY_STATUSES } from "../models/Enquiry.js";
import asyncHandler from "../utils/asyncHandler.js";
import { notifyNewEnquiry } from "../utils/notifications.js";

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// @route   POST /api/contact
// @access  Public
// Body: { name, email, phone?, subject?, message, website? }
// "website" is a hidden honeypot field: real visitors leave it empty, bots fill it in.
export const createEnquiry = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message, website } = req.body || {};
  const successReply = {
    message: "Thanks for contacting us! We'll get back to you soon.",
  };

  // Pretend it worked so bots don't learn about the trap
  if (website) {
    return res.status(201).json(successReply);
  }

  const enquiry = await Enquiry.create({ name, email, phone, subject, message });

  notifyNewEnquiry(enquiry);

  res.status(201).json(successReply);
});

// @route   GET /api/admin/enquiries
// @access  Admin
// Query: ?status=new&search=john&page=1&limit=20
export const getEnquiries = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);

  const filter = {};

  if (ENQUIRY_STATUSES.includes(req.query.status)) {
    filter.status = req.query.status;
  }

  if (req.query.search) {
    const regex = new RegExp(escapeRegex(String(req.query.search).trim()), "i");
    filter.$or = [
      { name: regex },
      { email: regex },
      { phone: regex },
      { subject: regex },
      { message: regex },
    ];
  }

  const [enquiries, total, newCount] = await Promise.all([
    Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Enquiry.countDocuments(filter),
    Enquiry.countDocuments({ status: "new" }),
  ]);

  res.json({
    enquiries,
    newCount, // for an "unread" badge in the admin menu
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// @route   PATCH /api/admin/enquiries/:id
// @access  Admin
// Body: { "status": "read" }
export const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body || {};

  if (!ENQUIRY_STATUSES.includes(status)) {
    return res.status(400).json({
      message: `Status must be one of: ${ENQUIRY_STATUSES.join(", ")}`,
    });
  }

  const enquiry = await Enquiry.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!enquiry) {
    return res.status(404).json({ message: "Enquiry not found" });
  }

  res.json({ message: `Enquiry marked as ${status}`, enquiry });
});

// @route   DELETE /api/admin/enquiries/:id
// @access  Admin (e.g. to remove spam)
export const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

  if (!enquiry) {
    return res.status(404).json({ message: "Enquiry not found" });
  }

  res.json({ message: "Enquiry deleted" });
});
