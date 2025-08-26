import mongoose from "mongoose";
import { isRequired, removeImage } from "../libs/validator.js";
import User from "../models/User.js";
import { userResponse } from "../utils/responseFormatter.js";

class UserController {
  async getProfile(req, res) {
    try {
      const user = await User.findById(req.jwt.id);
      if (!user) {
        throw { code: 404, message: "USER_NOT_FOUND" };
      }

      return res.status(200).json({
        status: true,
        message: "FOUND_USER",
        user: userResponse(user),
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async uploadImageProfile(req, res) {
    try {
      const user = await User.findById(req.jwt.id);
      if (!user) {
        throw { code: 404, message: "USER_NOT_FOUND" };
      }

      if (req.file) {
        if (user.profile_image) {
          removeImage(user.profile_image, "profiles");
        }
        user.profile_image = req.file.filename;
      }

      await user.save();

      return res.status(200).json({
        status: true,
        message: "SUCCESS_UPLOAD_IMAGE_PROFILE",
        user: userResponse(user),
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async deleteImageProfile(req, res) {
    try {
      const user = await User.findById(req.jwt.id);
      if (!user) {
        throw { code: 404, message: "USER_NOT_FOUND" };
      }

      if (!user.profile_image) {
        throw { code: 409, message: "IMAGE_PROFILE_HAS_BEEN_DELETED" };
      }

      removeImage(user.profile_image, "profiles");
      user.profile_image = "";

      await user.save();

      return res.status(200).json({
        status: true,
        message: "SUCCESS_DELETE_IMAGE_PROFILE",
        user: userResponse(user),
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async updateProfile(req, res) {
    try {
      isRequired(req.body.name, "name");
      isRequired(req.body.email, "email");

      const user = await User.findByIdAndUpdate(
        req.jwt.id,
        {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
        },
        { new: true }
      );

      return res.status(200).json({
        status: true,
        message: "SUCCESS_UPDATE_PROFILE",
        user: userResponse(user),
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async insertAddress(req, res) {
    try {
      isRequired(req.body.street, "street");
      isRequired(req.body.city, "city");

      const newAddress = {
        details: req.body.details,
        street: req.body.street,
        city: req.body.city,
        zipCode: req.body.zipCode,
      };

      const user = await User.findOneAndUpdate(
        { _id: req.jwt.id },
        { $push: { address: newAddress } },
        { new: true }
      );

      if (!user) {
        throw { code: 400, message: "FAILED_INSERT_ADDRESS" };
      }

      return res.status(200).json({
        status: false,
        message: "SUCCESS_INSERT_ADDRESS",
        user: userResponse(user),
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async updateAddress(req, res) {
    try {
      isRequired(req.params.addressId, "address");
      if (!mongoose.Types.ObjectId.isValid(req.params.addressId)) {
        throw { code: 400, message: "INVALID_ADDRESS_ID" };
      }

      let field = {};
      if (req.body.hasOwnProperty("details")) {
        field["address.$[addressIndex].details"] = req.body.details;
      }
      if (req.body.hasOwnProperty("street")) {
        field["address.$[addressIndex].street"] = req.body.street;
      }
      if (req.body.hasOwnProperty("city")) {
        field["address.$[addressIndex].city"] = req.body.city;
      }
      if (req.body.hasOwnProperty("zipCode")) {
        field["address.$[addressIndex].zipCode"] = req.body.zipCode;
      }

      const address = await User.findOneAndUpdate(
        { _id: req.jwt.id },
        { $set: field },
        {
          arrayFilters: [{ "addressIndex._id": req.params.addressId }],
          new: true,
        }
      );

      if (!address) {
        throw { code: 404, message: "ADDRESS_NOT_FOUND" };
      }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_UPDATE_ADDRESS",
        address: address.address,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async removeAddress(req, res) {
    try {
      isRequired(req.params.addressId);
      if (!mongoose.Types.ObjectId.isValid(req.params.addressId)) {
        throw { code: 400, message: "INVALID_ADDRESS_ID" };
      }

      const exists = await User.findOne({
        _id: req.jwt.id,
        "address._id": req.params.addressId,
      });

      if (!exists) {
        throw { code: 404, message: "ADDRESS_NOT_FOUND" };
      }

      const address = await User.findOneAndUpdate(
        { _id: req.jwt.id },
        { $pull: { address: { _id: req.params.addressId } } },
        { new: true }
      );

      if (!address) {
        throw { code: 400, message: "ADDRESS_NOT_FOUND" };
      }

      return res.status(200).json({
        status: false,
        message: "SUCCESS_REMOVE_ADDRESS",
        address: address.address,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new UserController();
