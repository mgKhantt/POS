const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: { type: String, default: "Walk-in Customer" }, // optional
  items: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // product reference
      name: String,
      qty: Number,
      price: Number
    }
  ],
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Cancelled"],
    default: "Pending" // since cashier usually completes immediately
  },
  type: {
    type: String,
    enum: ["Pickup", "Delivery", "Cashier"],
    default: "Delivery"
  },
  address: {
    type: String,
    default: ""
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
