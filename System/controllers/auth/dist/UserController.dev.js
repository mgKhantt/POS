"use strict";

var moment = require("moment");

var User = require("../../models/Users");

var express = require("express");

var Admin = require("../../models/Admins");

var createUser = function createUser(req, res) {
  var user;
  return regeneratorRuntime.async(function createUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          user = new User(req.body);
          _context.next = 4;
          return regeneratorRuntime.awrap(user.save());

        case 4:
          res.status(201).json({
            message: "User created successfully",
            user: user
          });
          _context.next = 10;
          break;

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          res.status(400).json({
            error: _context.t0.message
          });

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getUsers = function getUsers(req, res) {
  var users;
  return regeneratorRuntime.async(function getUsers$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.find());

        case 3:
          users = _context2.sent;
          res.json(users);
          _context2.next = 10;
          break;

        case 7:
          _context2.prev = 7;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            error: _context2.t0.message
          });

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var getUserById = function getUserById(req, res) {
  var admin;
  return regeneratorRuntime.async(function getUserById$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.params.id));

        case 3:
          admin = _context3.sent;

          if (admin) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 6:
          // res.json(user);
          res.render("admin/editAdmin", {
            layout: "./layouts/adminApp",
            docTitle: "Edit User",
            pageTitle: "Edit User Details",
            admin: admin,
            page: "editUser"
          });
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            error: _context3.t0.message
          });

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var deleteUser = function deleteUser(req, res) {
  return regeneratorRuntime.async(function deleteUser$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(User.findByIdAndDelete(req.params.id));

        case 3:
          _context4.next = 5;
          return regeneratorRuntime.awrap(Admin.findOneAndDelete({
            userRef: req.params.id
          }));

        case 5:
          res.json({
            message: "User deleted successfully"
          });
          _context4.next = 11;
          break;

        case 8:
          _context4.prev = 8;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            error: _context4.t0.message
          });

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var updateUser = function updateUser(req, res) {
  var user, admin;
  return regeneratorRuntime.async(function updateUser$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(User.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role // only if role is in User schema

          }, {
            "new": true,
            runValidators: true
          }));

        case 3:
          user = _context5.sent;
          _context5.next = 6;
          return regeneratorRuntime.awrap(Admin.findOneAndUpdate({
            userRef: req.params.id
          }, {
            username: req.body.name,
            email: req.body.email,
            role: req.body.role // only if role is in Admin schema

          }, {
            "new": true,
            runValidators: true
          }));

        case 6:
          admin = _context5.sent;

          if (!(!user && !admin)) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 9:
          // Redirect back to user list
          res.redirect("/admin/users");
          _context5.next = 16;
          break;

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](0);
          console.error(_context5.t0);
          res.status(400).json({
            error: _context5.t0.message
          });

        case 16:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var getUsersWithAdminRole = function getUsersWithAdminRole(req, res) {
  var users;
  return regeneratorRuntime.async(function getUsersWithAdminRole$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(User.aggregate([{
            $lookup: {
              from: "admins",
              localField: "adminRef",
              foreignField: "_id",
              as: "adminDetails"
            }
          }, {
            $unwind: {
              path: "$adminDetails",
              preserveNullAndEmptyArrays: true
            }
          }, {
            $project: {
              name: 1,
              email: 1,
              role: 1,
              "adminDetails.username": 1,
              "adminDetails.role": 1,
              "adminDetails.createdAt": 1
            }
          }]));

        case 3:
          users = _context6.sent;
          res.render("admin/userList", {
            layout: "./layouts/adminApp",
            docTitle: "User List",
            pageTitle: "List of Users with Admin Details",
            users: users,
            page: "userList",
            moment: moment
          });
          _context6.next = 10;
          break;

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            message: _context6.t0.message
          });

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.createUser = createUser;
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.deleteUser = deleteUser;
exports.updateUser = updateUser;
exports.getUsersWithAdminRole = getUsersWithAdminRole;