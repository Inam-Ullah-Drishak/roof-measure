import mongoose from "mongoose";

// Newsletter signups from the website footer
const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 200,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    // Where they signed up, e.g. "footer"
    source: { type: String, trim: true, maxlength: 50, default: "website" },
  },
  { timestamps: true }
);

subscriberSchema.index({ createdAt: -1 });

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

export default Subscriber;
