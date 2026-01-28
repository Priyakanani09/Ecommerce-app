const Watchlist = require("../model/watchlistmodel");
const Product = require("../model/productmodel");

exports.addToWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "ProductID missing" });
    }

    const watchlist = await Watchlist.create({ userId, productId });

    res.status(201).json({ message: "Added to Watchlist", watchlist });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Product already in watchlist" });
    }
    res.status(500).json({ message: err.message });
  }
};

exports.getWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const watchlist = await Watchlist.find({ userId }).populate("productId");

    res.status(200).json({ message: "find Watchlist", watchlist });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const remove = await Watchlist.findOneAndDelete({ userId, productId });

    if (!remove) {
      return res.status(404).json({
        message: "Item not found in watchlist",
      });
    }
    res.json({ message: "Removed from watchlist" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
