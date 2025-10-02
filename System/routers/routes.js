const express = require("express");
const TestController = require("../controllers/client/TestController");
const HomePageController = require("../controllers/client/HomePageController");

const clientRoute = express.Router();
const adminRoute = express.Router();

clientRoute.get("/", HomePageController.getHomePage);

exports.clientRoute = clientRoute;
exports.adminRoute = adminRoute;