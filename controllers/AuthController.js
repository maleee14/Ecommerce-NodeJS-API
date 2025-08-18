import mongoose from "mongoose";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
  async login(req, res) {
    //
  }

  async register(req, res) {
    try {
      if (!req.body.name) {
        throw { code: 400, message: "NAME_IS_REQUIRED" };
      }
      if (!req.body.email) {
        throw { code: 400, message: "EMAIL_IS_REQUIRED" };
      }
      if (
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/.test(
          req.body.email
        ) === false
      ) {
        throw { code: 400, message: "INVALID_EMAIL" };
      }
      if (!req.body.password) {
        throw { code: 400, message: "PASSWORD_IS_REQUIRED" };
      }
      if (req.body.password.lenght < 6) {
        throw { code: 400, message: "PASSWORD_MINIMUM_6_CHARACTERS" };
      }

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

  async refreshToken(req, res) {
    //
  }
}

export default new AuthController();
