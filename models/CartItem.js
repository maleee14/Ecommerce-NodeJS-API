import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    quantity: {
      type: Number,
      min: 1,
      default: 1,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

export default itemSchema;
