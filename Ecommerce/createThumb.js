const mongoose = require("mongoose");
const sharp = require("sharp");
const Product = require("./model/productmodel");

// Change DB name
mongoose.connect("mongodb+srv://dbms:eY6BHjjK5BXXxcoZ@cluster0.9gcddz7.mongodb.net/e-commerce");

async function createThumb() {

  try {

    const products = await Product.find();

    for (let product of products) {

      let thumbs = [];

      if (product.image && product.image.length > 0) {

        for (let img of product.image) {

          // Example: /Img/shoes.jpg
          const filePath = "." + img;

          const fileName = img.split("/").pop();

          console.log("Processing:", fileName);

          await sharp(filePath)
            .resize(200,200)
            .toFile(`Img/thumb/thumb-${fileName}`);

          thumbs.push(`/Img/thumb/thumb-${fileName}`);

        }

        product.thumbImage = thumbs;

        await product.save();

      }

    }

    console.log("✅ All thumbnails created");

    mongoose.disconnect();

  } catch (error) {

    console.log(error);

  }

}

createThumb();