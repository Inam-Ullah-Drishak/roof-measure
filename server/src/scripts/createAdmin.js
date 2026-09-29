import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/User.js";

let exitCode = 0;

const createAdmin = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Missing ADMIN_NAME, ADMIN_EMAIL or ADMIN_PASSWORD in .env");
    process.exit(1);
  }

  await connectDB();

  try {
    const existing = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (existing) {
      if (existing.role === "admin") {
        console.log(`Admin already exists: ${existing.email}`);
      } else {
        existing.role = "admin";
        await existing.save();
        console.log(`Existing user promoted to admin: ${existing.email}`);
      }
    } else {
      const admin = await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
      });
      console.log(`Admin created successfully: ${admin.email}`);
    }
  } catch (err) {
    console.error(`Failed to create admin: ${err.message}`);
    exitCode = 1;
  } finally {
    await mongoose.disconnect();
    process.exit(exitCode);
  }
};

createAdmin();