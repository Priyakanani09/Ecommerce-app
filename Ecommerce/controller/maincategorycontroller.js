const Category = require("../model/maincategorymodel");

exports.addCategory = async (req, res) => {
  try {

    const category = await Category.create(req.body);
    res.status(201).json({
      message: "Category added successfully",
      category
    });

  } 
  catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Category already exists"
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.getCategories = async (req, res) => {
  try {

    const categories = await Category.find();
    res.status(201).json({
      message: "Category find successfully",
      categories
    });
  }
   catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await Category.findByIdAndDelete(id);

    res.json({
      message: "Category deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};
