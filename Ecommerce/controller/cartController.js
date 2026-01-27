const Cart = require("../model/Cartmodel");
const Product = require("../model/productmodel")

/* ADD TO CART */
exports.addToCart = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user._id;
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{
          productId,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: 1,
        }],
      });
    } else {
      const index = cart.items.findIndex(item =>
        item.productId.equals(productId)
      );

      if (index > -1) {
        cart.items[index].qty += 1;
      } else {
        cart.items.push({
          productId,
          name: product.name,
          price: product.price,
          image: product.image,
          qty: 1,
        });
      }
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      items: cart.items,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Add to cart failed" });
  }
};


/* GET USER CART */
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ userId })
      .populate("items.productId");

    res.status(200).json({
      success: true,
      count: cart ? cart.items.length : 0,
      items: cart ? cart.items : [],
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

/* UPDATE QUANTITY */
exports.updateQty = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({ success: true, items: [] });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId.toString()
    );

    if (item) {
      if (qty <= 0) {
        cart.items = cart.items.filter(
          (i) => i.productId.toString() !== productId.toString()
        );
      } else {
        item.qty = qty;
      }
    }

    await cart.save();

    res.json({
      success: true,
      items: cart.items,
    });
  } catch (error) {
    res.status(500).json({ message: "Update quantity failed" });
  }
};

/* REMOVE ITEM */
exports.removeItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId});

    if (!cart) {
      return res.json({ success: true, items: [] });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== req.params.id.toString()
    );

    await cart.save();

    res.json({
      success: true,
      items: cart.items,
    });
  } catch (error) {
    res.status(500).json({ message: "Remove item failed" });
  }
};

/* CLEAR CART */
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    await Cart.findOneAndDelete({ userId});

    res.json({
      success: true,
      items: [],
    });
  } catch (error) {
    res.status(500).json({ message: "Clear cart failed" });
  }
};
