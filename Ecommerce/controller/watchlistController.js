const Watchlist = require("../model/watchlistmodel");

exports.addToWatchlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "ProductID missing" });
    }

    const exists = await Watchlist.findOne({ userId, productId });

    if (exists) {
      await Watchlist.findOneAndDelete({ userId, productId });

      return res.status(200).json({
        message: "Removed from watchlist",
        action: "removed",
      });
    }

    const watchlist = await Watchlist.create({ userId, productId });

    res.status(201).json({ message: "Added to Watchlist", action: "added", watchlist });
  } catch (err) {
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