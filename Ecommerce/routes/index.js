var express = require('express');
var router = express.Router();
const signController =  require('../controller/signcontroller');
const multer = require('multer');
const productController = require('../controller/productcontroller');
const ordercontroller = require("../controller/ordercontroller");
const maincategory = require("../controller/maincategorycontroller")
const subCategoryController = require("../controller/subcategorycontroller");

var jwtAuth = require('../middleware/authMiddleware');
const admin = require('../middleware/admin');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "Img/"),
  filename: (req, file, cb) => cb(null,file.originalname),
});
const upload = multer({ storage });

//User Registration and Login
router.post('/register', signController.register);
router.post('/login', signController.login);
router.get("/getuser",signController.getuser);
router.post("/refresh", signController.refreshToken);

router.get('/admin-data', jwtAuth, admin, (req, res) => {
  res.json({ message: 'This is admin only data' });
});

// Add Main Category
router.post( '/add-main-category',jwtAuth,admin,maincategory.addCategory);
router.get('/main-categories',maincategory.getCategories);
router.delete( '/main-category/:id',jwtAuth,admin,maincategory.deleteCategory);

// Add SubCategory
router.post("/add-sub-category",jwtAuth,admin,subCategoryController.addSubCategory);
router.get("/sub-categories/:categoryId",subCategoryController.getAllSubCategories);
router.delete("/sub-category/:id",jwtAuth,admin,subCategoryController.deleteSubCategory);


//Product Upload Setup
router.post('/add-product',jwtAuth, admin,upload.array('image',5), productController.addProduct);
router.get('/products', productController.getProducts);
router.delete("/delete/:name",jwtAuth,admin,productController.deleteproduct);
router.put('/update-product/:id',jwtAuth,admin, upload.array('image',5), productController.updateProduct);
router.get("/search",productController.searchProduct);

// User Order 
router.post('/order',ordercontroller.order);
router.get("/getorder",ordercontroller.getorder);

module.exports = router;