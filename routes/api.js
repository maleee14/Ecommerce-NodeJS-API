import express from "express";
import authRouter from "./v1/auth.js";
import categoryRouter from "./v1/category.js";
import productRouter from "./v1/product.js";
import cartRouter from "./v1/cart.js";

const router = express.Router();

router.use("/v1", authRouter);
router.use("/v1/categories", categoryRouter);
router.use("/v1/products", productRouter);
router.use("/v1/carts", cartRouter);

export default router;
