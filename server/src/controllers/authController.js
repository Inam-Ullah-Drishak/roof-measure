import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";

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