import { populate } from "dotenv";
import Cart from "../models/Cart.js";
import { isRequired } from "../libs/validator.js";
import mongoose from "mongoose";
import Product from "../models/Product.js";

class CartController {
  async index(req, res) {
    try {
      const carts = await Cart.find({ userId: req.jwt.id }).populate([
        "userId",
        "cartItems.product",
      ]);

      if (!carts) {
        throw { code: 404, message: "CART_NOT_FOUND" };
      }

      return res.status(200).json({
        status: true,
        message: "FOUND_CART",
        carts,
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
          (item) => item.product.toString() === req.body.product
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

      let totalPrice = 0;

      cart.cartItems.forEach((item) => {
        totalPrice += item.price;
      });

      cart.totalPrice = totalPrice;

      await cart.save();

      return res.status(201).json({
        status: true,
        message: "SUCCESS_ADD_TO_CART",
        cart,
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
