import Order from "../models/Order.js";
import User from "../models/User.js";
import Cart from "../models/Cart.js";
import { isRequired } from "../libs/validator.js";
class OrderController {
  async index(req, res) {
    try {
      const order = await Order.find({ userId: req.jwt.id });
      if (!order) {
        throw { code: 404, message: "ORDER_NOT_FOUND" };
      }

      return res.status(200).json({
        status: true,
        message: "ORDER_FOUND",
        order,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }

  async createOrder(req, res) {
    try {
      isRequired(req.body.addressId, "address");
      isRequired(req.body.paymentMethod, "payment method");
      const user = await User.findById(req.jwt.id);
      if (!user) {
        throw { code: 404, message: "USER_NOT_FOUND" };
      }

      const cart = await Cart.findOne({ userId: req.jwt.id });
      if (!cart) {
        throw { code: 404, message: "CART_NOT_FOUND" };
      }

      if (!cart.cartItems && cart.cartItems.length === 0) {
        throw { code: 400, message: "CART_EMPTY" };
      }

      const selectedAddress = user.address.find(
        (a) => a._id.toString() === req.body.addressId
      );
      if (!selectedAddress) {
        throw { code: 404, message: "ADDRESS_NOT_FOUND" };
      }

      const order = await Order.create({
        userId: req.jwt.id,
        cartItems: cart.cartItems,
        totalPrice: cart.totalPrice,
        shippingAddress: selectedAddress,
        paymentMethod: req.body.paymentMethod,
      });

      await Cart.findOneAndDelete({ userId: req.jwt.id });

      if (!order) {
        throw { code: 500, message: "FAILED_CREATE_ORDER" };
      }

      return res.status(201).json({
        status: true,
        message: "SUCCESS_CREATE_ORDER",
        order,
      });
    } catch (error) {
      return res.status(error.code || 500).json({
        status: false,
        message: error.message,
      });
    }
  }
}

export default new OrderController();
