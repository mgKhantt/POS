const Order = require("../../models/Order");
const Product = require("../../models/Products");

const getAdminOrderPage = async (req, res) => {

    const orders = await Order.find()
    const products = await Product.find()
    res.render("admin/orders/AdminOrderPage", {
        layout: "./layouts/adminApp",
        docTitle: "Order History",
        pageTitle: "Order History",
        orders: orders,
        products: products
    });
}

exports.getAdminOrderPage = getAdminOrderPage;