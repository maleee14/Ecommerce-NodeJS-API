import mongoose from "mongoose";
import Category from "../models/Category.js";
import { isRequired } from "../libs/validator.js";

class CategoryController {
  async index(req, res) {
    try {
      const category = await Category.find().select("_id name");
      if (!category) {
        throw { code: 404, message: "CATEGORY_NOT_FOUND" };
      }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_GET_CATEGORIES",
        category,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async store(req, res) {
    try {
      isRequired(req.body.name, "name");

      const nameExists = await Category.findOne({ name: req.body.name });
      if (nameExists) {
        throw { code: 400, message: "CATEGORY_ALREADY_EXISTS" };
      }

      const category = await Category.create({
        name: req.body.name,
      });

      if (!category) {
        throw { code: 500, message: "FAILED_CREATE_CATEGORY" };
      }

      return res.status(201).json({
        status: true,
        message: "SUCCESS_CREATE_CATEGORY",
        category: {
          _id: category._id,
          name: category.name,
        },
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async show(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      const category = await Category.findById(req.params.id).select(
        "_id name"
      );
      if (!category) {
        throw { code: 404, message: "CATEGORY_NOT_FOUND" };
      }

      return res.status(200).json({
        status: true,
        message: "FOUND_CATEGORY",
        category,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      isRequired(req.body.name, "name");

      const nameExists = await Category.findOne({
        _id: { $ne: req.params.id },
        name: req.body.name,
      });
      if (nameExists) {
        throw { code: 400, message: "CATEGORY_ALREADY_EXISTS" };
      }

      const category = await Category.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true }
      );

      if (!category) {
        throw { code: 404, message: "CATEGORY_NOT_FOUND" };
      }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_UPDATE_CATEGORY",
        category: {
          _id: category._id,
          name: category.name,
        },
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async destroy(req, res) {
    try {
      if (!req.params.id) {
        throw { code: 400, message: "REQUIRED_ID" };
      }
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      const category = await Category.findByIdAndDelete(req.params.id);
      if (!category) {
        throw { code: 404, message: "CATEGORY_NOT_FOUND" };
      }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_DELETE_CATEGORY",
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new CategoryController();
