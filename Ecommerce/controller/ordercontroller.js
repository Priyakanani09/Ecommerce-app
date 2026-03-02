const Order = require("../model/ordermodel");

const updateOrderStatus = (order) => {
  const today = new Date();
  const orderDate = new Date(order.createdAt);

  const diffTime = today - orderDate;

  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Cancelled order change nahi thay
  if (order.status === "Cancelled") {
    return "Cancelled";
  }

  if (diffDays === 0) return "Pending";

  if (diffDays === 1) return "Confirmed";

  if (diffDays === 2) return "Processing";

  if (diffDays >= 3) return "Delivered";
};

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
      status: "Pending",
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

    let orders = await Order.find({ userId })
      .populate("items.productId")
      .sort({ createdAt: -1 });

    orders = orders.map((order) => {
      const newStatus = updateOrderStatus(order);

      order.status = newStatus;

      return order;
    });

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
    let orders = await Order.find()
      .populate("userId", "name phone")
      .sort({ createdAt: -1 });

    orders = orders.map((order) => {
      const newStatus = updateOrderStatus(order);

      order.status = newStatus;

      return order;
    });

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

exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const orderId = req.params.id;

    const order = await Order.findOne({
      _id: orderId,
      userId: userId,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({
        message: "Order already cancelled",
      });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({
        message: "Delivered order cannot be cancelled",
      });
    }

    order.status = "Cancelled";

    await order.save();

    res.status(200).json({
      message: "Order Cancelled Successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({
      message: "Cancel failed",
      error: err.message,
    });
  }
};
