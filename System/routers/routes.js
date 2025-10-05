const express = require("express");
const TestController = require("../controllers/client/TestController");
const HomePageController = require("../controllers/client/HomePageController");
const UserController = require("../controllers/auth/UserController");
const { authMiddleware } = require("../middleware/auth");
const LoginRegisterController = require("../controllers/auth/LoginRegisterController");
const ProductPageController = require("../controllers/client/ProductPageController");

const path = require('path')
const multer = require("multer");
const AdminController = require("../controllers/admin/AdminController");
const AdminProductsController = require("../controllers/admin/AdminProductsController");


const uploadPath = path.join(__dirname, '../public/uploads');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })
// router.post('/product-list/create-product',upload.single('image'), ProductController.postCreateProductPage)

const clientRoute = express.Router();
const adminRoute = express.Router();

//Login & Register Routes
clientRoute.get("/register", LoginRegisterController.getRegisterPage)
clientRoute.post("/register", UserController.createUser)
clientRoute.get("/login", LoginRegisterController.getLoginPage)
clientRoute.post("/login", LoginRegisterController.loginUser)
clientRoute.get("/logout", LoginRegisterController.logoutUser)

//Home Page Route
clientRoute.get("/", authMiddleware, HomePageController.getHomePage)

//Product Routes
clientRoute.get("/products", ProductPageController.getProductPage)


//Admin Site
//Admin Login Route
adminRoute.get("/login", LoginRegisterController.getAdminLoginPage)
// adminRoute.post("/login", LoginRegisterController.loginAdmin)
// adminRoute.get("/logout", LoginRegisterController.logoutAdmin)

//Admin Home Page Route
adminRoute.get("/dashboard", AdminController.getAdminHomePage)

//admin User Management Routes
adminRoute.get("/users", UserController.getUsersWithAdminRole)
adminRoute.delete("/users/:id", UserController.deleteUser)
adminRoute.get("/users/:id/edit", UserController.getUserById)
adminRoute.post("/users/:id/edit", UserController.updateUser)

adminRoute.get("/create-admin", AdminController.getCreateAdminPage)
adminRoute.post("/create-admin", AdminController.postCreateAdminPage)

//admin Product Management Routes
adminRoute.get("/products", AdminProductsController.getAdminProductPage)
adminRoute.get("/products/create-product", AdminProductsController.getAdminCreateProductPage)
adminRoute.post("/products/create-product", upload.single('image'), AdminProductsController.postAdminCreateProductPage)
adminRoute.delete("/products/delete/:id", AdminProductsController.deleteProduct)

//Category Manager and Brand Manager Routes
adminRoute.get("/products/create-product/category-manager", AdminProductsController.getCategoryManagerPage)
adminRoute.post("/products/create-product/category-manager", AdminProductsController.postCategoryManager)
adminRoute.delete("/products/create-product/category-manager/delete/:id", AdminProductsController.deleteCategoryManager)

adminRoute.get("/products/create-product/brand-manager", AdminProductsController.getBrandManagerPage)
adminRoute.post("/products/create-product/brand-manager", AdminProductsController.postBrandManager)
adminRoute.delete("/products/create-product/brand-manager/delete/:id", AdminProductsController.deleteBrandManager)

exports.clientRoute = clientRoute;
exports.adminRoute = adminRoute;