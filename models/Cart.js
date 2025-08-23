import mongoose from "mongoose";
import itemSchema from "./CartItem.js";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    totalPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    cartItems: {
      type: [itemSchema],
      default: [],
    },
  },
  { timestamps: true }
);

cartSchema.pre(/^find/, function (next) {
  this.populate({ path: "userId", select: "name email phone" }).populate({
    path: "cartItems.product",
    select: "name price description image",
  });

  next();
});

export default mongoose.model("Cart", cartSchema);
