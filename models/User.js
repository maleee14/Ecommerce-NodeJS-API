import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["costumer", "admin"],
      default: "costumer",
      required: true,
    },
    phone: {
      type: String,
    },
    profile_image: {
      type: String,
    },
    address: {
      type: [
        {
          details: String,
          street: String,
          city: String,
          zipCode: String,
        },
      ],
      default: [],
    },
    verifyOtp: {
      type: String,
      default: "",
    },
    verifyOtpExpireAt: {
      type: Number,
      default: 0,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    resetPasswordOtp: {
      type: String,
      default: "",
    },
    resetPasswordOtpExpireAt: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
