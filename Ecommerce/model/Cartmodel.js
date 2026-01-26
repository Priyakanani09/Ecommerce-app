const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sign", 
      required: true,
      unique: true
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        image: {
          type: [String],
          default: [],
        },
        qty: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
  },
);

module.exports = mongoose.model("Cart", cartSchema);