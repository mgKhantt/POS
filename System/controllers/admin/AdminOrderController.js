const Order = require("../../models/Order");
const Product = require("../../models/Products");

const getAdminOrderPage = async (req, res) => {
    const orders = await Order.find().sort({ date: -1 });
    res.render("admin/orders/AdminOrderPage", {
        layout: "./layouts/adminApp",
        docTitle: "Order History",
        pageTitle: "Order History",
        orders: orders,
    });
}

const deleteOrder = async (req, res) => {
    try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

exports.getAdminOrderPage = getAdminOrderPage;
exports.deleteOrder = deleteOrder;