import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { isRequired, validateEmail, minimumChar } from "../libs/validator.js";

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
}

export default new AuthController();
