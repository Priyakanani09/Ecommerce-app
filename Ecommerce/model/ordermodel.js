const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: String,
  username: String,
  name: String,
  phone: String,
  address: String,
  items: Array,
  totalAmount: Number,
  date: Date,
});

module.exports = mongoose.model("Order", orderSchema);