const Order = require("../model/ordermodel");

exports.order = async (req, res) => {
  try {
    const userId = req.user.id;
    const { customer, items, totalAmount, paymentMethod } = req.body;

    if (!userId || !customer || !items?.length || totalAmount == null) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const order = await Order.create({
      userId,
      customer,
      items,
      totalAmount,
      paymentMethod: paymentMethod || "COD",
    });

    res.status(201).json({
      message: "Order saved successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error saving order",
      error: err.message,
    });
  }
};

exports.getorder = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ userId }).populate("items.productId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Find Successfully",
      orders,
    });
  } catch (err) {
    res.status(500).json({
      message: "Order not found",
      error: err.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name phone") // show user info
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All orders fetched successfully",
      data: orders,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: err.message,
    });
  }
};
