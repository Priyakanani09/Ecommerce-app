const mongoose = require("mongoose");
const Product = require("../model/productmodel");
const Category = require("../model/maincategorymodel");
const SubCategory = require("../model/subcategorymodel")

exports.addProduct = async (req, res) => {
  try {
    const { name, price, category,subCategory, description } = req.body;

    // Validate category and subCategory IDs
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(subCategory)) {
      return res.status(400).json({ message: "Invalid subCategory ID" });
    }

    const image = req.files
      ? req.files.map((file) => `/Img/${file.filename}`)
      : [];

    const product = await Product.create({
      image,
      name,
      price,
      category,
      subCategory,
      description,
    });
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to add product" });
  }
};
exports.getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 24;
    const skip = (page - 1) * limit;

    const { mainCategory, subCategory } = req.query;

    let matchStage = {};

    // ✅ subCategory filter
    if (subCategory) {
      if (!mongoose.Types.ObjectId.isValid(subCategory)) {
        return res.status(400).json({ message: "Invalid subCategory ID" });
      }
      matchStage.subCategory = new mongoose.Types.ObjectId(subCategory);
    }

    // ✅ mainCategory filter (NO extra query)
    if (mainCategory) {
      if (!mongoose.Types.ObjectId.isValid(mainCategory)) {
        return res.status(400).json({ message: "Invalid mainCategory ID" });
      }
      matchStage.mainCategory = new mongoose.Types.ObjectId(mainCategory);
    }

    const result = await Product.aggregate([
      { $match: matchStage },

      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: "$category" },

      {
        $lookup: {
          from: "subcategories",
          localField: "subCategory",
          foreignField: "_id",
          as: "subCategory"
        }
      },
      { $unwind: "$subCategory" },

      {
        $facet: {
          products: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit }
          ],
          totalCount: [
            { $count: "count" }
          ]
        }
      }
    ]);

    const products = result[0].products;
    const totalProducts = result[0].totalCount[0]?.count || 0;

    res.status(200).json({
      message: "Products fetched successfully",
      products,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit)
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ message: "Product name is required" });
    }

    const deletedProduct = await Product.findOneAndDelete({ name : name })
      .populate("category", "name")
      .populate("subCategory", "name");

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to delete product",
      details: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, subCategory, description } = req.body;

    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    if (subCategory && !mongoose.Types.ObjectId.isValid(subCategory)) {
      return res.status(400).json({ message: "Invalid subCategory ID" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    let images = product.image;
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/Img/${file.filename}`);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        image: images,
        name,
        price,
        category,
        subCategory,
        description,
      },
      { new: true }
    )
      .populate("category", "name")
      .populate("subCategory", "name");

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

exports.searchProduct = async (req, res) => {
  try {
    const query = req.query.query || "";

     const matchingCategories = await Category.find({
      name: { $regex: query, $options: "i" }
    });
    const categoryIds = matchingCategories.map(cat => cat._id);

    const matchingSubCategories = await SubCategory.find({
      name: { $regex: query, $options: "i" }
    });
    const subCategoryIds = matchingSubCategories.map(sub => sub._id);

    // Search products by name, category ID, or subcategory ID
   const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $in: categoryIds } },
        { subCategory: { $in: subCategoryIds } }
      ]
    })
      .limit(8)
      .populate("category", "name")
      .populate("subCategory", "name");

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Search failed" });
  }
};