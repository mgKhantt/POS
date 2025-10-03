"use strict";

var mongoose = require("mongoose");

var connectDB = function connectDB() {
  return regeneratorRuntime.async(function connectDB$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(mongoose.connect("mongodb+srv://khantphonenaing156:1234567890@cluster0.ud9do.mongodb.net/POS?retryWrites=true&w=majority&appName=Cluster0"));

        case 3:
          console.log("✅ MongoDB connected with Mongoose");
          _context.next = 10;
          break;

        case 6:
          _context.prev = 6;
          _context.t0 = _context["catch"](0);
          console.error("❌ MongoDB connection error:", _context.t0);
          process.exit(1);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 6]]);
};

module.exports = connectDB;