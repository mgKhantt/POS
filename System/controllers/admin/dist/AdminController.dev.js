"use strict";

var Admin = require("../../models/Admins");

var User = require("../../models/Users");

var getAdminHomePage = function getAdminHomePage(req, res) {
  res.render("admin/adminHomePage", {
    layout: "./layouts/adminApp",
    docTitle: "Admin Home",
    pageTitle: "Welcome to the Admin Dashboard",
    user: req.session.user,
    page: "adminHome"
  });
};

var getCreateAdminPage = function getCreateAdminPage(req, res) {
  res.render("admin/createAdmin", {
    layout: "./layouts/adminApp",
    docTitle: "Create Admin",
    pageTitle: "Create New Admin Account",
    user: req.session.user,
    page: "createAdmin"
  });
};

var postCreateAdminPage = function postCreateAdminPage(req, res) {
  var _req$body, username, email, password, role, existingUser, existingAdmin, today, onlyDate, newUser, savedUser, newAdmin, savedAdmin;

  return regeneratorRuntime.async(function postCreateAdminPage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, username = _req$body.username, email = _req$body.email, password = _req$body.password, role = _req$body.role;
          console.log(req.body);

          if (!(!username || !email || !password)) {
            _context.next = 5;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Username, email and password are required"
          }));

        case 5:
          _context.next = 7;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 7:
          existingUser = _context.sent;
          _context.next = 10;
          return regeneratorRuntime.awrap(Admin.findOne({
            email: email
          }));

        case 10:
          existingAdmin = _context.sent;

          if (!(existingUser || existingAdmin)) {
            _context.next = 13;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            error: "Email already exists"
          }));

        case 13:
          // Only save date (no time)
          today = new Date();
          onlyDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // 1️⃣ Save User

          newUser = new User({
            name: username,
            email: email,
            password: password,
            role: role,
            createdAt: onlyDate,
            updatedAt: onlyDate
          });
          _context.next = 18;
          return regeneratorRuntime.awrap(newUser.save());

        case 18:
          savedUser = _context.sent;
          console.log("Saved User:", savedUser); // 2️⃣ Save Admin

          newAdmin = new Admin({
            username: username,
            email: email,
            password: password,
            role: role,
            userRef: savedUser._id,
            createdAt: onlyDate,
            updatedAt: onlyDate
          });
          _context.next = 23;
          return regeneratorRuntime.awrap(newAdmin.save());

        case 23:
          savedAdmin = _context.sent;
          console.log("Saved Admin:", savedAdmin); // 3️⃣ Update user to reference admin

          savedUser.adminRef = savedAdmin._id;
          _context.next = 28;
          return regeneratorRuntime.awrap(savedUser.save());

        case 28:
          res.redirect("/admin/users");
          _context.next = 35;
          break;

        case 31:
          _context.prev = 31;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);
          res.status(400).json({
            error: _context.t0.message
          });

        case 35:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 31]]);
};

exports.getAdminHomePage = getAdminHomePage;
exports.getCreateAdminPage = getCreateAdminPage;
exports.postCreateAdminPage = postCreateAdminPage;