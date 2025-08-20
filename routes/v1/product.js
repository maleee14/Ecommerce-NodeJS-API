import express from "express";
import jwtAuth from "../../middlewares/jwtAuth.js";
import ProductController from "../../controllers/ProductController.js";
import imageUpload from "../../middlewares/imageUpload.js";

const router = express.Router();

router.get("/", jwtAuth(), ProductController.index);
router.post(
  "/",
  jwtAuth(),
  imageUpload("products").single("image"),
  ProductController.store
);
router.get("/:id", jwtAuth(), ProductController.show);
router.put(
  "/:id",
  jwtAuth(),
  imageUpload("products").single("image"),
  ProductController.update
);
router.delete("/:id", jwtAuth(), ProductController.destroy);

export default router;
