import express from "express";
import jwtAuth from "../../middlewares/jwtAuth.js";
import UserController from "../../controllers/UserController.js";
import { profileImage } from "../../middlewares/upload.js";

const router = express.Router();

router.get("/profile", jwtAuth(), UserController.getProfile);
router.put("/profile", jwtAuth(), UserController.updateProfile);
router.post(
  "/upload-profile",
  jwtAuth(),
  profileImage(),
  UserController.uploadImageProfile
);
router.delete(
  "/delete-profile",
  jwtAuth(),
  profileImage(),
  UserController.deleteImageProfile
);
router.post("/insert-address", jwtAuth(), UserController.insertAddress);

export default router;
