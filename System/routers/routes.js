const express = require("express");
const TestController = require("../controllers/client/TestController");
const HomePageController = require("../controllers/client/HomePageController");
const UserController = require("../controllers/auth/UserController");
const { authMiddleware } = require("../middleware/auth");
const LoginRegisterController = require("../controllers/auth/LoginRegisterController");

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

exports.clientRoute = clientRoute;
exports.adminRoute = adminRoute;