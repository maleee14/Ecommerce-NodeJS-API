import mongoose from "mongoose";
import slugify from "slugify";
import paginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: true,
      minLength: 3,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

productSchema.plugin(paginate);

export default mongoose.model("Product", productSchema);
