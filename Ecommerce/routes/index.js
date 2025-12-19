var express = require('express');
var router = express.Router();
const signController =  require('../controller/signcontroller');
const multer = require('multer');
const productController = require('../controller/productcontroller');
const ordercontroller = require("../controller/ordercontroller");

var jwtAuth = require('../middleware/authMiddleware');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "Img/"),
  filename: (req, file, cb) => cb(null,file.originalname),
});
const upload = multer({ storage });

//User Registration and Login
router.post('/register', signController.register);
router.post('/login', signController.login);
router.post("/refresh", signController.refreshToken);

//Product Upload Setup
router.post('/add-product',jwtAuth, upload.array('image',5), productController.addProduct);
router.get('/products', productController.getProducts);
router.delete("/delete/:name",productController.deleteproduct);

router.put('/update-product/:id',jwtAuth, upload.array('image',5), productController.updateProduct);
router.get("/search",productController.searchProduct);

// User Order 
router.post('/order',jwtAuth,ordercontroller.order);
router.get("/getorder",ordercontroller.getorder);

module.exports = router;