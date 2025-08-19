import express from "express";
import CategoryController from "../../controllers/CategoryController.js";
import jwtAuth from "../../middlewares/jwtAuth.js";

const router = express.Router();

router.get("/", jwtAuth(), CategoryController.index);
router.post("/", jwtAuth(), CategoryController.store);
router.get("/:id", jwtAuth(), CategoryController.show);
router.put("/:id", jwtAuth(), CategoryController.update);
router.delete("/:id", jwtAuth(), CategoryController.destroy);

export default router;
