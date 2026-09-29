import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// Allows only logged-in users
export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, please log in" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Session expired or invalid, please log in again" });
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    return res.status(401).json({ message: "User no longer exists" });
  }

  if (!user.isActive) {
    return res.status(403).json({
      message: "Your account has been deactivated. Please contact support.",
    });
  }

  req.user = user;
  next();
});

// Allows only specific roles, e.g. authorize("admin")
export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res
      .status(403)
      .json({ message: "You do not have permission to do this" });
  }
  next();
};