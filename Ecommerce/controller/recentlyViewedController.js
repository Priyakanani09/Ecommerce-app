const RecentlyViewed = require("../model/recentlyViewed");

exports.saveRecentlyViewed = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.body.productId;

    if (!productId) {
      return res.status(400).json({ message: "Product Id Missing" });
    }

    const duplicateRemove = await RecentlyViewed.deleteOne({
      userId,
      productId,
    });

    const newAdd = await RecentlyViewed.create({ userId, productId });

    const total = await RecentlyViewed.countDocuments({ userId });

    if (total > 8) {
      const oldProduct = await RecentlyViewed.find({ userId })
        .sort({ viewedAt: 1 })
        .limit(total - 8);

      await RecentlyViewed.deleteMany({
        _id: { $in: oldProduct.map((p) => p._id) },
      });
    }

    res.status(200).json({ success: true, message: "Recently viewed product saved", duplicateRemove, newAdd });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecentlyViewed = async (req,res) => {
	try{
		const userId = req.user.id;

		const getproduct = await RecentlyViewed.find({userId}).sort({ viewedAt: -1 }).limit(8).populate("productId");

		res.status(200).json({ success: true,getproduct});
	}
	catch (err) {
    res.status(500).json({ message: err.message });
  }
};