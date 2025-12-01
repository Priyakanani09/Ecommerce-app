const Product = require("../model/productmodel");

exports.addProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;
    const image = req.files
      ? req.files.map((file) => `/Img/${file.filename}`)
      : [];

    const product = await Product.create({
      image,
      name,
      price,
      category,
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
    const category = req.query.category;

    // ✅ Apply category filter before pagination
    const query = category
      ? { category: { $regex: category, $options: "i" } }
      : {};
    
    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query).skip(skip).limit(limit);
    res.status(200).json({products,totalProducts,currentPage: page, totalPages: Math.ceil(totalProducts / limit)});
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description } = req.body;
    const image = req.files
      ? req.files.map((file) => `/Img/${file.filename}`)
      : [];

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { image, name, price, category, description },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res
      .status(200)
      .json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to update product" });
  }
};
exports.searchProduct = async (req, res) => {
  try {
    const query = req.query.query || "";
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Search failed" });
  }
};