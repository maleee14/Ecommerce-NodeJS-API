import express from "express";
import CartController from "../../controllers/CartController.js";
import jwtAuth from "../../middlewares/jwtAuth.js";

const router = express.Router();

router.get("/", jwtAuth(), CartController.index);
router.post("/", jwtAuth(), CartController.addToCart);

export default router;
