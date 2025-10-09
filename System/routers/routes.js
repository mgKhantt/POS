const express = require("express");
const TestController = require("../controllers/client/TestController");
const HomePageController = require("../controllers/client/HomePageController");
const UserController = require("../controllers/auth/UserController");
const { authMiddleware, authAdminMiddleware } = require("../middleware/auth");
const LoginRegisterController = require("../controllers/auth/LoginRegisterController");
const ProductPageController = require("../controllers/client/ProductPageController");

const path = require('path')
const multer = require("multer");
const AdminController = require("../controllers/admin/AdminController");
const AdminProductsController = require("../controllers/admin/AdminProductsController");
const AdminOrderController = require("../controllers/admin/AdminOrderController");
const AdminCashierController = require("../controllers/admin/AdminCashierController");


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
clientRoute.get("/products", authMiddleware, ProductPageController.getProductPage)

//Admin Site
//Admin Login Route
adminRoute.get("/login", LoginRegisterController.getAdminLoginPage)
adminRoute.post("/login", LoginRegisterController.postAdminLoginPage)
adminRoute.get("/logout", LoginRegisterController.logoutAdmin)

//Admin Home Page Route
adminRoute.get("/dashboard", authAdminMiddleware, AdminController.getAdminHomePage)

//admin User Management Routes
adminRoute.get("/users", authAdminMiddleware, UserController.getUsersWithAdminRole)
adminRoute.delete("/users/:id", authAdminMiddleware, UserController.deleteUser)
adminRoute.get("/users/:id/edit", authAdminMiddleware, UserController.getUserById)
adminRoute.post("/users/:id/edit", authAdminMiddleware, UserController.updateUser)

adminRoute.get("/create-admin", authAdminMiddleware, AdminController.getCreateAdminPage)
adminRoute.post("/create-admin", authAdminMiddleware, AdminController.postCreateAdminPage)

//admin Product Management Routes
adminRoute.get("/products", authAdminMiddleware, AdminProductsController.getAdminProductPage)
adminRoute.get("/products/create-product", authAdminMiddleware, AdminProductsController.getAdminCreateProductPage)
adminRoute.post("/products/create-product", authAdminMiddleware, upload.single('image'), AdminProductsController.postAdminCreateProductPage)

adminRoute.get("/products/edit/:id", authAdminMiddleware, AdminProductsController.getAdminEditProductPage)
adminRoute.post("/products/edit/:id", authAdminMiddleware, upload.single('image'), AdminProductsController.postAdminEditProductPage)

adminRoute.delete("/products/delete/:id", authAdminMiddleware, AdminProductsController.deleteProduct)

//Category Manager and Brand Manager Routes
adminRoute.get("/products/create-product/category-manager", authAdminMiddleware, AdminProductsController.getCategoryManagerPage)
adminRoute.post("/products/create-product/category-manager", authAdminMiddleware, AdminProductsController.postCategoryManager)
adminRoute.delete("/products/create-product/category-manager/delete/:id", authAdminMiddleware, AdminProductsController.deleteCategoryManager)

adminRoute.get("/products/create-product/brand-manager", authAdminMiddleware, AdminProductsController.getBrandManagerPage)
adminRoute.post("/products/create-product/brand-manager", authAdminMiddleware, AdminProductsController.postBrandManager)
adminRoute.delete("/products/create-product/brand-manager/delete/:id", authAdminMiddleware, AdminProductsController.deleteBrandManager)

//Cashier Page Route
adminRoute.get("/orders", authAdminMiddleware, AdminOrderController.getAdminOrderPage)
adminRoute.get("/cashier", authAdminMiddleware, AdminCashierController.getAdminCashierPage)
adminRoute.post("/checkout", authAdminMiddleware, AdminCashierController.postCheckOut)

exports.clientRoute = clientRoute;
exports.adminRoute = adminRoute;