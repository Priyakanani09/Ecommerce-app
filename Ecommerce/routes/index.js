var express = require('express');
var router = express.Router();
const signController =  require('../controller/signcontroller');
const multer = require('multer');
const productController = require('../controller/productcontroller');
const ordercontroller = require("../controller/ordercontroller");

// var jwtAuth = require('../middleware/authMiddleware');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "Img/"),
  filename: (req, file, cb) => cb(null,file.originalname),
});
const upload = multer({ storage });

//User Registration and Login
router.post('/register', signController.register);
router.post('/login', signController.login);

//Product Upload Setup
router.post('/add-product', upload.array('image',5), productController.addProduct);
router.get('/products', productController.getProducts);
router.put('/update-product/:id', upload.array('image',5), productController.updateProduct);
router.get("/search",productController.searchProduct);

// User Order 
router.post('/order',ordercontroller.order);

module.exports = router;