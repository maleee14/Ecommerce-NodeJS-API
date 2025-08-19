import express from "express";
import jwtAuth from "../../middlewares/jwtAuth.js";
import ProductController from "../../controllers/ProductController.js";

const router = express.Router();

router.get("/", jwtAuth(), ProductController.index);
router.post("/", jwtAuth(), ProductController.store);
router.get("/:id", jwtAuth(), ProductController.show);
router.put("/:id", jwtAuth(), ProductController.update);
router.delete("/:id", jwtAuth(), ProductController.destroy);

export default router;
