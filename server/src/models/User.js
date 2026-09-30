import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const RESET_TOKEN_MINUTES = 15;
// Link emailed to a new team member to set their first password
export const INVITE_TOKEN_MINUTES = 7 * 24 * 60;

// Roles that can log into the admin panel. Employees only see orders assigned to them.
export const STAFF_ROLES = ["admin", "employee"];

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["customer", ...STAFF_ROLES],
      default: "customer",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Team member added by an admin who hasn't set their password yet
    invitePending: { type: Boolean, default: false },
    // Used to log out old sessions after a password change
    passwordChangedAt: { type: Date, select: false },
    // Only the SHA-256 hash is stored, the real token is sent by email
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // 1 second back, so the login token issued right after is still valid
  if (!this.isNew) this.passwordChangedAt = new Date(Date.now() - 1000);
});

// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// True if the password was changed after this JWT was issued
userSchema.methods.changedPasswordAfter = function (jwtIssuedAt) {
  if (!this.passwordChangedAt) return false;
  return jwtIssuedAt * 1000 < this.passwordChangedAt.getTime();
};

// Creates a reset token, stores its hash, and returns the plain token for the email
userSchema.methods.createPasswordResetToken = function (minutes = RESET_TOKEN_MINUTES) {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = hashToken(resetToken);
  this.passwordResetExpires = new Date(Date.now() + minutes * 60 * 1000);
  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;