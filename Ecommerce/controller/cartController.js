const Cart = require("../model/Cartmodel");
const Product = require("../model/productmodel");

/* ================= ADD TO CART ================= */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "ProductId missing" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existing = await Cart.findOne({ userId, productId });

    if (existing) {
      existing.qty += 1;
      await existing.save();
    } else {
      await Cart.create({ userId, productId, qty: 1 });
    }

    res.status(200).json({
      success: true,
      message: "Added to cart",
    });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET CART ================= */
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.find({ userId }).populate("productId");

    res.status(200).json({
      success: true,
      count: cartItems.length,
      cartItems,
    });
  } catch (err) {
    console.error("Get cart error:", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

/* ================= UPDATE QTY ================= */
exports.updateQty = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, qty } = req.body;

    if (qty <= 0) {
      await Cart.findOneAndDelete({ userId, productId });
    } else {
      await Cart.findOneAndUpdate(
        { userId, productId },
        { qty },
        { new: true }
      );
    }

    const cartItems = await Cart.find({ userId }).populate("productId");

    res.json({
      success: true,
      cartItems,
    });
  } catch (err) {
    console.error("Update qty error:", err);
    res.status(500).json({ message: "Update quantity failed" });
  }
};

/* ================= REMOVE ITEM ================= */
exports.removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    await Cart.findOneAndDelete({ userId, productId });

    const cartItems = await Cart.find({ userId }).populate("productId");

    res.json({
      success: true,
      cartItems,
    });
  } catch (err) {
    console.error("Remove item error:", err);
    res.status(500).json({ message: "Remove item failed" });
  }
};

/* ================= CLEAR CART ================= */
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.deleteMany({ userId });

    res.json({
      success: true,
      items: [],
    });
  } catch (err) {
    console.error("Clear cart error:", err);
    res.status(500).json({ message: "Clear cart failed" });
  }
};
