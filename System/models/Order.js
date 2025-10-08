const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
        type: String,
        enum: ["Pending", "Completed", "Cancelled"],
        default: "Pending"
    },
    date: { type: Date, default: Date.now }
});
//   item: String,
//   quantity: Number,
//   total: Number,
//   status: {
//     type: String,
//     enum: ["Pending", "Completed", "Cancelled"],
//     default: "Pending"
//   },
//   date: {
//     type: Date,
//     default: Date.now
//   }
// });
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
