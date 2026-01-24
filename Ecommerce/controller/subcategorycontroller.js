const SubCategory = require("../model/subcategorymodel")
const Category = require("../model/maincategorymodel")

exports.addSubCategory = async (req, res) => {
  try {
    const { name, mainCategory } = req.body;

    if (!name || !mainCategory) {
      return res.status(400).json({
        message: "Sub category name and main category are required"
      });
    }

    // check main category exists
    const categoryExists = await Category.findById(mainCategory);
    if (!categoryExists) {
      return res.status(404).json({
        message: "Main category not found"
      });
    }

    const subCategory = await SubCategory.create({name: name,mainCategory});

    res.status(201).json({
      message: "Sub category added successfully",
      subCategory
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.getAllSubCategories = async (req, res) => {
  try {
    
    const subCategories = await SubCategory.find().populate("mainCategory", "name");

    res.status(200).json({
      message: "Sub categories fetched successfully",
      subCategories
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await SubCategory.findByIdAndDelete(id);

    res.json({
      message: "Sub category deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error"
    });
  }
};
