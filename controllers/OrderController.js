import Order from "../models/Order.js";
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
