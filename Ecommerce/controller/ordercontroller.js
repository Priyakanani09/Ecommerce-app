const Order = require("../model/ordermodel");

exports.order = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(201).json({ message: "Order saved successfully!", order });
  } catch (err) {
    res.status(500).json({ message: "Error saving order", error: err.message });
  }
};
exports.getorder = async (req,res) =>{
  try{
    const data = await Order.find();
    res.status(200).json({message : "Find Successfully" ,data})
  }
  catch (err) {
    res.status(400).json({ message: "order not find", error: err.message });
  }
};