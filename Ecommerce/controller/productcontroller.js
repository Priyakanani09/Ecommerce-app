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
     // 🔥 HOME PAGE SHORT-CIRCUIT
    if (req.query.home === "true") {
      const products = await Product.find({})
        .limit(200) // homepage mate limit
        .populate("category", "name")
        .populate("subCategory", "name");

      return res.status(200).json({
        message: "Home products",
        products,
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 24;
    const skip = (page - 1) * limit;
    const { mainCategory, subCategory } = req.query;

    let query = {};
    if (subCategory) {
      if (!mongoose.Types.ObjectId.isValid(subCategory)) {
        return res.status(400).json({ message: "Invalid subCategory ID" });
      }
      query.subCategory = subCategory;
    }

    if (mainCategory) {
      if (!mongoose.Types.ObjectId.isValid(mainCategory)) {
        return res.status(400).json({ message: "Invalid mainCategory ID" });
      }

      const subCategories = await SubCategory.find(
        { mainCategory },
        "_id"
      );

      const subCategoryIds = subCategories.map(sc => sc._id);
      query.subCategory = { $in: subCategoryIds };
    }
    
    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query).skip(skip).limit(limit).populate("category", "name").populate("subCategory", "name");

    res.status(200).json({message: "Product find successfully",products,totalProducts,currentPage: page, totalPages: Math.ceil(totalProducts / limit)});
  } catch (error) {
    console.log(error);
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
        { category: { $in: categoryIds, $options: "i"  } },
        { subCategory: { $in: subCategoryIds, $options: "i"  } }
      ]
    }) 
    .populate("category")
    .populate("subCategory");

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Search failed" });
  }
};