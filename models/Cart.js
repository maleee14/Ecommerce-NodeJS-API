import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
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
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          min: 1,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
  },
});

cartSchema.pre("find", function (next) {
  this.populate({ path: "userId", select: "name email phone" }).populate({
    path: "cartItems.product",
    select: "name price description image",
  });

  next();
});

export default mongoose.model("Cart", cartSchema);
