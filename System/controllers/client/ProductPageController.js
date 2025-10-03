const Product = require("../../models/Products");

const getProductPage = async (req, res) => {
    try {
        const products = await Product.find()
        res.render("client/productPage", {
        docTitle: "Product Page",
        pageTitle: "Our Products",
        user: req.session.user,
        shopName: "iCase",
        products: products
    })
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).send("Internal Server Error");
    }
}

exports.getProductPage = getProductPage;