import express from "express";
import authRouter from "./v1/auth.js";
import userRouter from "./v1/user.js";
import categoryRouter from "./v1/category.js";
import productRouter from "./v1/product.js";
import cartRouter from "./v1/cart.js";
import orderRouter from "./v1/order.js";

const router = express.Router();

router.use("/v1", authRouter);
router.use("/v1/users", userRouter);
router.use("/v1/categories", categoryRouter);
router.use("/v1/products", productRouter);
router.use("/v1/carts", cartRouter);
router.use("/v1/orders", orderRouter);

export default router;
