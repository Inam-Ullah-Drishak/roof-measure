import mongoose from "mongoose";

const ENQUIRY_STATUSES = ["new", "read", "replied"];

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name is too long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    phone: { type: String, trim: true, maxlength: [30, "Phone is too long"] },
    subject: { type: String, trim: true, maxlength: [150, "Subject is too long"] },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: [5000, "Message is too long (max 5000 characters)"],
    },
    status: {
      type: String,
      enum: ENQUIRY_STATUSES,
      default: "new",
      index: true,
    },
  },
  { timestamps: true }
);

enquirySchema.index({ createdAt: -1 });

export { ENQUIRY_STATUSES };

const Enquiry = mongoose.model("Enquiry", enquirySchema);

export default Enquiry;
