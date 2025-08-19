import express from "express";
import authRouter from "./v1/auth.js";
import categoryRouter from "./v1/category.js";

const router = express.Router();

router.use("/v1", authRouter);
router.use("/v1/categories", categoryRouter);

export default router;
