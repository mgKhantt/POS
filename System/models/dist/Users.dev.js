"use strict";

var mongoose = require("mongoose");

var bcrypt = require("bcryptjs");

var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    "enum": ['admin', 'superadmin', 'client', 'cashier'],
    "default": 'client'
  },
  adminRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
}, {
  timestamps: true
});
userSchema.pre("save", function _callee(next) {
  var salt;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (this.isModified("password")) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", next());

        case 2:
          _context.next = 4;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 4:
          salt = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(bcrypt.hash(this.password, salt));

        case 7:
          this.password = _context.sent;
          next();

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
});

userSchema.methods.comparePassword = function _callee2(enteredPassword) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(bcrypt.compare(enteredPassword, this.password));

        case 2:
          return _context2.abrupt("return", _context2.sent);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  }, null, this);
};

var User = mongoose.model("User", userSchema);
module.exports = User;