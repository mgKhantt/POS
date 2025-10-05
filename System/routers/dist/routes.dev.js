"use strict";

var express = require("express");

var TestController = require("../controllers/client/TestController");

var HomePageController = require("../controllers/client/HomePageController");

var UserController = require("../controllers/auth/UserController");

var _require = require("../middleware/auth"),
    authMiddleware = _require.authMiddleware;

var LoginRegisterController = require("../controllers/auth/LoginRegisterController");

var ProductPageController = require("../controllers/client/ProductPageController");

var path = require('path');

var multer = require("multer");

var AdminController = require("../controllers/admin/AdminController");

var AdminProductsController = require("../controllers/admin/AdminProductsController");

var uploadPath = path.join(__dirname, '../public/uploads');
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function filename(req, file, cb) {
    cb(null, file.originalname);
  }
});
var upload = multer({
  storage: storage
}); // router.post('/product-list/create-product',upload.single('image'), ProductController.postCreateProductPage)

var clientRoute = express.Router();
var adminRoute = express.Router(); //Login & Register Routes

clientRoute.get("/register", LoginRegisterController.getRegisterPage);
clientRoute.post("/register", UserController.createUser);
clientRoute.get("/login", LoginRegisterController.getLoginPage);
clientRoute.post("/login", LoginRegisterController.loginUser);
clientRoute.get("/logout", LoginRegisterController.logoutUser); //Home Page Route

clientRoute.get("/", authMiddleware, HomePageController.getHomePage); //Product Routes

clientRoute.get("/products", ProductPageController.getProductPage); //Admin Site
//Admin Login Route

adminRoute.get("/login", LoginRegisterController.getAdminLoginPage); // adminRoute.post("/login", LoginRegisterController.loginAdmin)
// adminRoute.get("/logout", LoginRegisterController.logoutAdmin)
//Admin Home Page Route

adminRoute.get("/dashboard", AdminController.getAdminHomePage); //admin User Management Routes

adminRoute.get("/users", UserController.getUsersWithAdminRole);
adminRoute["delete"]("/users/:id", UserController.deleteUser);
adminRoute.get("/users/:id/edit", UserController.getUserById);
adminRoute.post("/users/:id/edit", UserController.updateUser);
adminRoute.get("/create-admin", AdminController.getCreateAdminPage);
adminRoute.post("/create-admin", AdminController.postCreateAdminPage); //admin Product Management Routes

adminRoute.get("/products", AdminProductsController.getAdminProductPage);
exports.clientRoute = clientRoute;
exports.adminRoute = adminRoute;