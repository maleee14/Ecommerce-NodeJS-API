import mongoose from "mongoose";
import itemSchema from "./CartItem.js";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    cartItems: {
      type: [itemSchema],
      default: [],
    },
    shippingAddress: {
      details: String,
      street: String,
      city: String,
      zipCode: String,
    },
    totalPrice: {
      type: Number,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank", "qris"],
      default: "cash",
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["new", "delivered", "accepted", "canceled"],
      default: "new",
    },
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "userId", select: "name email phone" }).populate({
    path: "cartItems.product",
    select: "name price description image",
  });

  next();
});

export default mongoose.model("Order", orderSchema);
