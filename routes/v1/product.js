import express from "express";
import jwtAuth from "../../middlewares/jwtAuth.js";
import ProductController from "../../controllers/ProductController.js";
import { productImage } from "../../middlewares/upload.js";
import { multerErrorHandler } from "../../middlewares/errorHandler.js";

const router = express.Router();

router.get("/", jwtAuth(), ProductController.index);
router.post(
  "/",
  jwtAuth(),
  productImage(),
  multerErrorHandler,
  ProductController.store
);
router.get("/:id", jwtAuth(), ProductController.show);
router.put(
  "/:id",
  jwtAuth(),
  productImage(),
  multerErrorHandler,
  ProductController.update
);
router.delete("/:id", jwtAuth(), ProductController.destroy);

export default router;
