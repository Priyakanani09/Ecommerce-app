const Cart = require("../model/Cartmodel");

/* ADD TO CART */
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ correct
    const { productId, name, price, image } = req.body;

    let cart = await Cart.findOne({ userId }); // ✅ correct

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [{ productId, name, price, image, qty: 1 }],
      });
    } else {
      const index = cart.items.findIndex(
        (item) => item.productId.toString() === productId.toString()
      );

      if (index > -1) {
        cart.items[index].qty += 1;
      } else {
        cart.items.push({ productId, name, price, image, qty: 1 });
      }

      await cart.save();
    }

    res.status(200).json({
      success: true,
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
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId});

    res.status(200).json({
      success: true,
      items: cart ? cart.items : [],
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

/* UPDATE QUANTITY */
exports.updateQty = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const userId = req.user.id;
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
    const userId = req.user.id;
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
    const userId = req.user.id;
    await Cart.findOneAndDelete({ userId});

    res.json({
      success: true,
      items: [],
    });
  } catch (error) {
    res.status(500).json({ message: "Clear cart failed" });
  }
};
