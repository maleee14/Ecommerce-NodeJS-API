import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { isRequired, validateEmail, minimumChar } from "../libs/validator.js";
import transporter from "../libs/nodemailer.js";

const generateAccessToken = async (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRED,
  });
};

const generateRefreshToken = async (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRED,
  });
};

class AuthController {
  async register(req, res) {
    try {
      isRequired(req.body.name, "name");

      isRequired(req.body.email, "email");
      validateEmail(req.body.email);

      isRequired(req.body.password, "password");
      minimumChar(req.body.password, 6, "password");

      const emailExist = await User.findOne({ email: req.body.email });
      if (emailExist) {
        throw { code: 409, message: "EMAIL_IS_EXIST" };
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        role: req.body.role ?? "costumer",
      });

      if (!user) {
        throw { code: 500, message: "REGISTER_FAILED" };
      }

      const payload = { id: user._id, email: user.email, role: user.role };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: req.body.email,
        subject: "Welcome to Express JS",
        text: `Your account has been created with email: ${req.body.email}`, // plain‑text body
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        status: true,
        message: "REGISTER_SUCCESS",
        name: user.name,
        email: user.email,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      isRequired(req.body.email, "email");
      isRequired(req.body.password, "password");

      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        throw { code: 400, message: "INVALID_EMAIL_OR_PASSWORD" };
      }

      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordValid) {
        throw { code: 400, message: "INVALID_EMAIL_OR_PASSWORD" };
      }

      const payload = { id: user._id, email: user.email, role: user.role };
      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateRefreshToken(payload);

      return res.status(200).json({
        status: true,
        message: "LOGIN_SUCCESS",
        name: user.name,
        email: user.email,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async refreshToken(req, res) {
    try {
      isRequired(req.body.refreshToken, "REFRESH_TOKEN");

      const verify = jwt.verify(
        req.body.refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET
      );

      let payload = { id: verify.id };

      const accessToken = await generateAccessToken(payload);
      const refreshToken = await generateAccessToken(payload);

      return res.status(200).json({
        status: true,
        message: "REFRESH_TOKEN_SUCCESS",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      const errorJwt = [
        "invalid signature",
        "jwt malformed",
        "jwt must be provided",
        "invalid token",
      ];

      if (error.message == "jwt expired") {
        error.message = "REFRESH_TOKEN_EXPIRED";
      } else if (errorJwt.includes(error.message)) {
        error.message = "INVALID_REFRESH_TOKEN";
      }
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async sendVerifyOtp(req, res) {
    try {
      const user = await User.findById(req.jwt.id);

      if (user.is_verified) {
        throw { code: 409, message: "EMAIL_HAS_BEEN_VERIFIED" };
      }

      const otp = String(Math.floor(100000 + Math.random() * 900000));

      user.verifyOtp = otp;
      user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; //1 hari
      await user.save();

      const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: "Account Verify OTP",
        text: `Your OTP is ${otp}. Verify your account use this OTP.`,
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        status: true,
        message: "SUCCESS_SEND_VERIFICATION_OTP",
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async verifyEmail(req, res) {
    try {
      if (!req.body.otp) {
        throw { code: 400, message: "OTP_IS_REQUIRED" };
      }

      const user = await User.findById(req.jwt.id);
      if (!user) {
        throw { code: 404, message: "USER_NOT_FOUND" };
      }

      if (user.is_verified) {
        throw { code: 409, message: "EMAIL_HAS_BEEN_VERIFIED" };
      }

      if (user.verifyOtp === "" || user.verifyOtp !== req.body.otp) {
        throw { code: 400, message: "INVALID_OTP" };
      }

      if (user.verifyOtpExpireAt < Date.now()) {
        throw { code: 400, message: "OTP_EXPIRED" };
      }

      user.is_verified = true;
      user.verifyOtp = "";
      user.verifyOtpExpireAt = 0;

      await user.save();

      return res.status(200).json({
        status: true,
        message: "SUCCESS_VERIFY_EMAIL",
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new AuthController();
