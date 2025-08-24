import Cart from "../models/Cart.js";
import { isRequired } from "../libs/validator.js";
import mongoose from "mongoose";
import Product from "../models/Product.js";
import { cartResponse } from "../utils/responseFormatter.js";

const calculateTotalPrice = (cart) => {
  let totalPrice = 0;

  cart.cartItems.forEach((item) => {
    totalPrice += item.price;
  });

  cart.totalPrice = totalPrice;

  return totalPrice;
};

class CartController {
  async index(req, res) {
    try {
      const cart = await Cart.find({ userId: req.jwt.id });

      if (!cart) {
        throw { code: 404, message: "CART_NOT_FOUND" };
      }

      const result = cart.map((c) => cartResponse(c));

      return res.status(200).json({
        status: true,
        message: "FOUND_CART",
        cart: result,
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async addToCart(req, res) {
    try {
      isRequired(req.body.product, "product");
      if (!mongoose.Types.ObjectId.isValid(req.body.product)) {
        throw { code: 400, message: "INVALID_PRODUCT_ID" };
      }

      const product = await Product.findById(req.body.product);
      if (!product) {
        throw { code: 404, message: "PRODUCT_NOT_FOUND" };
      }

      let itemPrice = product.price * req.body.quantity;

      let cart = await Cart.findOne({ userId: req.jwt.id });

      if (cart) {
        const itemIndex = cart.cartItems.findIndex(
          (item) => item.product._id.toString() === req.body.product
        );
        if (itemIndex > -1) {
          cart.cartItems[itemIndex].quantity += req.body.quantity;
          cart.cartItems[itemIndex].price =
            cart.cartItems[itemIndex].quantity * product.price;
        } else {
          cart.cartItems.push({
            product: req.body.product,
            quantity: req.body.quantity,
            price: itemPrice,
          });
        }
      } else {
        cart = await Cart.create({
          userId: req.jwt.id,
          totalPrice: 0,
          cartItems: [
            {
              product: req.body.product,
              quantity: req.body.quantity,
              price: itemPrice,
            },
          ],
        });
      }

      calculateTotalPrice(cart);

      await cart.save();

      return res.status(201).json({
        status: true,
        message: "SUCCESS_ADD_TO_CART",
        cart: cartResponse(cart),
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async updateItemQuantity(req, res) {
    try {
      isRequired(req.params.productId, "id");
      if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      const cart = await Cart.findOne({ userId: req.jwt.id });
      if (!cart) {
        throw { code: 404, message: "CART_NOT_FOUND" };
      }

      const product = await Product.findOne({ _id: req.params.productId });
      if (!product) {
        throw { code: 404, message: "PRODUCT_NOT_FOUND" };
      }

      const itemIndex = cart.cartItems.findIndex(
        (item) => item.product._id.toString() === req.params.productId
      );

      if (itemIndex > -1) {
        cart.cartItems[itemIndex].quantity = req.body.quantity;
        cart.cartItems[itemIndex].price =
          cart.cartItems[itemIndex].quantity * product.price;
      } else {
        throw { code: 404, message: "ITEM_NOT_FOUND" };
      }

      calculateTotalPrice(cart);

      await cart.save();

      return res.status(200).json({
        status: true,
        message: "SUCCESS_UPDATE_QUANTITY",
        cart: cartResponse(cart),
      });
    } catch (error) {
      console.log(error);
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async deleteItemCart(req, res) {
    try {
      isRequired(req.params.productId, "id");
      if (!mongoose.Types.ObjectId.isValid(req.params.productId)) {
        throw { code: 400, message: "INVALID_ID" };
      }

      const cart = await Cart.findOneAndUpdate(
        { userId: req.jwt.id },
        { $pull: { cartItems: { product: req.params.productId } } },
        { new: true }
      );

      if (!cart) {
        throw { code: 404, message: "CART_NOT_FOUND" };
      }

      calculateTotalPrice(cart);

      await cart.save();

      return res.status(200).json({
        status: true,
        message: "SUCCESS_DELETE_ITEM",
        cart: cartResponse(cart),
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async clearCart(req, res) {
    try {
      const cart = await Cart.findOneAndDelete({ userId: req.jwt.id });
      if (!cart) {
        throw { code: 404, message: "CART_IS_EMPTY" };
      }

      return res.status(200).json({
        status: true,
        message: "SUCCESS_CLEAR_CART",
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new CartController();
