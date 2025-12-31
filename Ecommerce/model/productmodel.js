const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  image: { type: [String], required: true },
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true,
  },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema);