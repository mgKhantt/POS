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

exports.getAdminOrderPage = getAdminOrderPage;