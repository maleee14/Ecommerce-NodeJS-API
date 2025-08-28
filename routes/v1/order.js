import express from "express";
import jwtAuth from "../../middlewares/jwtAuth.js";
import OrderController from "../../controllers/OrderController.js";

const router = express.Router();

router.get("/", jwtAuth(), OrderController.index);
router.post("/", jwtAuth(), OrderController.createOrder);

export default router;
