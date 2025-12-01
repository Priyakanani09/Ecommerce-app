const Order = require("../model/ordermodel");

exports.order = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ message: "Order saved successfully!", order });
  } catch (err) {
    res.status(500).json({ message: "Error saving order", error: err.message });
  }
};
