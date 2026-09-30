import crypto from "crypto";
import User, { STAFF_ROLES, INVITE_TOKEN_MINUTES } from "../models/User.js";
import Order from "../models/Order.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendTeamInvite } from "../utils/notifications.js";

const INVITE_DAYS = INVITE_TOKEN_MINUTES / (24 * 60);
const OPEN_STATUSES = ["pending", "in_progress"];

// Never send the password hash or invite token back
const publicMember = (m) => ({
  _id: m._id,
  name: m.name,
  email: m.email,
  phone: m.phone,
  role: m.role,
  isActive: m.isActive,
  invitePending: m.invitePending,
  createdAt: m.createdAt,
});

// Creates a fresh invite link and emails it. Returns false if the email failed.
const invite = async (member, invitedBy) => {
  const token = member.createPasswordResetToken(INVITE_TOKEN_MINUTES);
  await member.save({ validateBeforeSave: false });

  try {
    await sendTeamInvite(member, invitedBy, token, INVITE_DAYS);
    return true;
  } catch (err) {
    console.error(`Team invite to ${member.email} failed: ${err.message}`);
    return false;
  }
};

// True if another active admin exists, so the team is never left without one
const hasOtherActiveAdmin = async (id) =>
  Boolean(await User.exists({ _id: { $ne: id }, role: "admin", isActive: true }));

// @route   GET /api/admin/team
// @access  Admin
// Query: ?status=active|inactive
// Admins and employees, with how many open and completed orders each one has
export const getTeam = asyncHandler(async (req, res) => {
  const filter = { role: { $in: STAFF_ROLES } };
  if (req.query.status === "active") filter.isActive = true;
  if (req.query.status === "inactive") filter.isActive = false;

  const members = await User.find(filter).sort({ isActive: -1, role: 1, name: 1 }).lean();

  const workload = await Order.aggregate([
    { $match: { assignedTo: { $in: members.map((m) => m._id) } } },
    {
      $group: {
        _id: "$assignedTo",
        openOrders: { $sum: { $cond: [{ $in: ["$status", OPEN_STATUSES] }, 1, 0] } },
        completedOrders: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
      },
    },
  ]);
  const byId = Object.fromEntries(workload.map((w) => [w._id.toString(), w]));

  res.json({
    members: members.map((m) => ({
      ...m,
      openOrders: byId[m._id.toString()]?.openOrders || 0,
      completedOrders: byId[m._id.toString()]?.completedOrders || 0,
    })),
  });
});

// @route   POST /api/admin/team
// @access  Admin
// Body: { "name": "...", "email": "...", "phone": "...", "role": "employee" | "admin" }
// The new member gets an email with a link to set their own password.
export const addTeamMember = asyncHandler(async (req, res) => {
  const { name, email, phone, role = "employee" } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  if (!STAFF_ROLES.includes(role)) {
    return res
      .status(400)
      .json({ message: `Role must be one of: ${STAFF_ROLES.join(", ")}` });
  }

  const existing = await User.exists({ email: String(email).toLowerCase().trim() });
  if (existing) {
    return res
      .status(409)
      .json({ message: "An account with this email already exists" });
  }

  // Random password nobody knows; the member sets their own from the invite link
  const member = await User.create({
    name,
    email,
    phone,
    role,
    password: crypto.randomBytes(24).toString("hex"),
    invitePending: true,
  });

  const sent = await invite(member, req.user);

  res.status(201).json({
    message: sent
      ? `${member.name} was added and an invite email was sent`
      : `${member.name} was added, but the invite email could not be sent. Try "Resend invite".`,
    emailSent: sent,
    member: publicMember(member),
  });
});

// @route   PATCH /api/admin/team/:id
// @access  Admin
// Body: { "name", "phone", "role", "isActive" }  (all optional)
// Deactivating someone moves their open orders back to "unassigned".
export const updateTeamMember = asyncHandler(async (req, res) => {
  const { name, phone, role, isActive } = req.body || {};

  const member = await User.findOne({ _id: req.params.id, role: { $in: STAFF_ROLES } });

  if (!member) {
    return res.status(404).json({ message: "Team member not found" });
  }

  const isSelf = member._id.equals(req.user._id);

  if (role !== undefined && !STAFF_ROLES.includes(role)) {
    return res
      .status(400)
      .json({ message: `Role must be one of: ${STAFF_ROLES.join(", ")}` });
  }

  if (isActive !== undefined && typeof isActive !== "boolean") {
    return res.status(400).json({ message: "isActive must be true or false" });
  }

  const demoting = role !== undefined && role !== member.role && member.role === "admin";
  const deactivating = isActive === false && member.isActive;

  if (isSelf && (demoting || deactivating)) {
    return res
      .status(400)
      .json({ message: "You can't change your own role or deactivate yourself" });
  }

  if (member.role === "admin" && (demoting || deactivating) && !(await hasOtherActiveAdmin(member._id))) {
    return res
      .status(400)
      .json({ message: "There must always be at least one active admin" });
  }

  if (name !== undefined) member.name = name;
  if (phone !== undefined) member.phone = phone;
  if (role !== undefined) member.role = role;
  if (isActive !== undefined) member.isActive = isActive;

  await member.save();

  let unassigned = 0;
  if (deactivating) {
    const result = await Order.updateMany(
      { assignedTo: member._id, status: { $in: OPEN_STATUSES } },
      { assignedTo: null }
    );
    unassigned = result.modifiedCount;
  }

  res.json({
    message: deactivating
      ? `${member.name} was deactivated${unassigned ? ` and ${unassigned} open order(s) were unassigned` : ""}`
      : "Team member updated",
    unassigned,
    member: publicMember(member),
  });
});

// @route   POST /api/admin/team/:id/invite
// @access  Admin
// Sends a new "set your password" link (the old one stops working)
export const resendInvite = asyncHandler(async (req, res) => {
  const member = await User.findOne({ _id: req.params.id, role: { $in: STAFF_ROLES } });

  if (!member) {
    return res.status(404).json({ message: "Team member not found" });
  }

  if (!member.isActive) {
    return res
      .status(400)
      .json({ message: "Reactivate this team member before sending an invite" });
  }

  if (!(await invite(member, req.user))) {
    return res
      .status(500)
      .json({ message: "Could not send the email. Please try again later." });
  }

  res.json({ message: `Invite sent to ${member.email}` });
});
