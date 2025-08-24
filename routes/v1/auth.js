import express from "express";
import AuthController from "../../controllers/AuthController.js";
import jwtAuth from "../../middlewares/jwtAuth.js";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/send-verify-otp", jwtAuth(), AuthController.sendVerifyOtp);
router.post("/verify-email", jwtAuth(), AuthController.verifyEmail);
router.post("/send-reset-otp", AuthController.sendResetPasswordOtp);
router.post("/reset-password", AuthController.resetPassword);

export default router;
