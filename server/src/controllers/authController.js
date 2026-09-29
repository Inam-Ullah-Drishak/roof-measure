import User, { hashToken, RESET_TOKEN_MINUTES } from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";
import sendEmail from "../utils/sendEmail.js";
import { escapeHtml, button, layout } from "../utils/emailTemplates.js";

// Remove sensitive fields before sending user data
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  companyName: user.companyName,
  role: user.role,
  createdAt: user.createdAt,
});

// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, companyName } = req.body || {};

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res
      .status(409)
      .json({ message: "An account with this email already exists" });
  }

  // role is NOT taken from req.body, so nobody can register as admin
  const user = await User.create({
    name,
    email,
    password,
    phone,
    companyName,
  });

  generateToken(res, user._id, user.role);

  res.status(201).json({
    message: "Account created successfully",
    user: sanitizeUser(user),
  });
});

// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (!user.isActive) {
    return res.status(403).json({
      message: "Your account has been deactivated. Please contact support.",
    });
  }

  generateToken(res, user._id, user.role);

  res.json({
    message: "Logged in successfully",
    user: sanitizeUser(user),
  });
});

// @route   POST /api/auth/logout
// @access  Public
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.json({ message: "Logged out successfully" });
});

// @route   GET /api/auth/me
// @access  Private (logged-in users)
export const getMe = asyncHandler(async (req, res) => {
  // req.user will be set by the auth middleware (next step)
  res.json({ user: sanitizeUser(req.user) });
});

// @route   POST /api/auth/forgot-password
// @access  Public
// Body: { "email": "user@example.com" }
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body || {};

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Email is required" });
  }

  // Same reply whether or not the account exists, so emails can't be probed
  const genericReply = {
    message:
      "If an account exists for this email, a password reset link has been sent.",
  };

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user || !user.isActive) {
    return res.json(genericReply);
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      text:
        `Hi ${user.name},\n\n` +
        `We received a request to reset your password. Open the link below to choose a new one:\n\n` +
        `${resetUrl}\n\n` +
        `This link expires in ${RESET_TOKEN_MINUTES} minutes. ` +
        `If you didn't request this, you can ignore this email.`,
      html: layout(
        "Reset your password",
        `<p>Hi ${escapeHtml(user.name)},</p>` +
          `<p>We received a request to reset your password. Click the button below to choose a new one:</p>` +
          button(resetUrl, "Reset password") +
          `<p>Or copy this link: <br>${resetUrl}</p>` +
          `<p>This link expires in ${RESET_TOKEN_MINUTES} minutes. If you didn't request this, you can ignore this email.</p>`
      ),
    });
  } catch (err) {
    // Remove the unused token so it can't linger
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.error(`Reset email failed for ${user.email}: ${err.message}`);
    return res
      .status(500)
      .json({ message: "Could not send the email. Please try again later." });
  }

  res.json(genericReply);
});

// @route   POST /api/auth/reset-password/:token
// @access  Public (token from the email)
// Body: { "password": "newPassword123" }
export const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body || {};

  if (!password || typeof password !== "string") {
    return res.status(400).json({ message: "New password is required" });
  }

  const user = await User.findOne({
    passwordResetToken: hashToken(req.params.token),
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) {
    return res
      .status(400)
      .json({ message: "Reset link is invalid or has expired" });
  }

  if (!user.isActive) {
    return res.status(403).json({
      message: "Your account has been deactivated. Please contact support.",
    });
  }

  // pre("save") hashes it and sets passwordChangedAt (logs out other sessions)
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  generateToken(res, user._id, user.role);

  res.json({
    message: "Password reset successfully",
    user: sanitizeUser(user),
  });
});

// @route   PATCH /api/auth/me
// @access  Private (logged-in users)
// Body: { "name": "...", "phone": "...", "companyName": "..." }  (all optional)
// Email and role can't be changed here.
export const updateMe = asyncHandler(async (req, res) => {
  const { name, phone, companyName } = req.body || {};

  if (name === undefined && phone === undefined && companyName === undefined) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  const user = req.user;

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (companyName !== undefined) user.companyName = companyName;

  await user.save();

  res.json({ message: "Profile updated", user: sanitizeUser(user) });
});

// @route   PATCH /api/auth/change-password
// @access  Private (logged-in users)
// Body: { "currentPassword": "...", "newPassword": "..." }
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};

  if (
    typeof currentPassword !== "string" ||
    typeof newPassword !== "string" ||
    !currentPassword ||
    !newPassword
  ) {
    return res
      .status(400)
      .json({ message: "Current password and new password are required" });
  }

  const user = await User.findById(req.user._id).select("+password");

  // 400, not 401: a 401 would make the frontend think the session expired
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  if (currentPassword === newPassword) {
    return res
      .status(400)
      .json({ message: "New password must be different from the current one" });
  }

  // pre("save") hashes it and sets passwordChangedAt (logs out other devices)
  user.password = newPassword;
  await user.save();

  // Give this device a fresh token so the user stays logged in here
  generateToken(res, user._id, user.role);

  res.json({ message: "Password changed successfully" });
});
