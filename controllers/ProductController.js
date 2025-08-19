import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import { isRequired } from "../libs/validator.js";
import { productResponse } from "../utils/responseFormatter.js";

class ProductController {
  async index(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;

      const product = await Product.paginate(
        {},
        { limit: limit, page: page, populate: "categoryId" }
      );

      if (!product) {
        throw { code: 404, message: "PRODUCT_NOT_FOUND" };
      }

      const result = product.docs.map((p) => productResponse(p));

      return res.status(200).json({
        status: true,
        message: "FOUND_PRODUCT",
        total: product.totalDocs,
        products: result,
        limit: product.limit,
        page: product.page,
        nextPage: product.nextPage,
        prevPage: product.prevPage,
        totalPages: product.totalPages,
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
      isRequired(req.body.categoryId, "category");
      if (!mongoose.Types.ObjectId.isValid(req.body.categoryId)) {
        throw { code: 400, message: "INVALID_CATEGORY_ID" };
      }

      isRequired(req.body.name, "name");
      isRequired(req.body.price, "price");

      const category = await Category.findById(req.body.categoryId);
      if (!category) {
        throw { code: 404, message: "CATEGORY_NOT_FOUND" };
      }

      const existingProduct = await Product.findOne({ name: req.body.name });
      if (existingProduct) {
        throw { code: 409, message: "PRODUCT_ALREADY_EXISTS" };
      }

      const product = await Product.create({
        categoryId: category._id,
        name: req.body.name,
        description: req.body.description ?? null,
        price: req.body.price,
        image: req.body.image ?? null,
      });
      await product.populate("categoryId");

      if (!product) {
        throw { code: 500, message: "FAILED_CREATE_PRODUCT" };
      }

      return res.status(201).json({
        status: true,
        message: "SUCCESS_CREATE_PRODUCT",
        product: productResponse(product),
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
      isRequired(req.params.id, "id");
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_PRODUCT_ID" };
      }

      const product = await Product.findById(req.params.id).populate(
        "categoryId"
      );
      if (!product) {
        throw { code: 404, message: "PRODUCT_NOT_FOUND" };
      }

      return res.status(200).json({
        status: true,
        message: "PRODUCT_FOUND",
        product: productResponse(product),
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
      isRequired(req.params.id, "id");
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_PRODUCT_ID" };
      }

      isRequired(req.body.categoryId, "category");
      if (!mongoose.Types.ObjectId.isValid(req.body.categoryId)) {
        throw { code: 400, message: "INVALID_CATEGORY_ID" };
      }

      isRequired(req.body.name, "name");

      const productExists = await Product.findOne({
        _id: { $ne: req.params.id },
        name: req.body.name,
      });
      if (productExists) {
        throw { code: 409, message: "PRODUCT_ALREADY_EXISTS" };
      }

      isRequired(req.body.price, "price");

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
          categoryId: req.body.categoryId,
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          image: req.body.image,
        },
        { new: true }
      );

      await product.populate("categoryId");

      if (!product) {
        throw { code: 500, message: "FAILED_UPDATE_PRODUCT" };
      }

      return res.status(200).json({
        status: false,
        message: "SUCCESS_UPDATE_PRODUCT",
        product: productResponse(product),
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
      isRequired(req.params.id, "id");
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw { code: 400, message: "INVALID_PRODUCT_ID" };
      }

      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        throw { code: 404, message: "PRODUCT_NOT_FOUND" };
      }

      return res.status(200).json({
        status: false,
        message: "SUCCESS_DELETE_PRODUCT",
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new ProductController();
