import express from "express";
import CartController from "../../controllers/CartController.js";
import jwtAuth from "../../middlewares/jwtAuth.js";

const router = express.Router();

router.get("/", jwtAuth(), CartController.index);
router.post("/", jwtAuth(), CartController.addToCart);
router.put("/:productId", jwtAuth(), CartController.updateItemQuantity);
router.delete("/:productId", jwtAuth(), CartController.deleteItemCart);
router.delete("/", jwtAuth(), CartController.clearCart);

export default router;
