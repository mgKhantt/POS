const Product = require("../../models/Products");

const getHomePage = async (req, res) => {

    const products = await Product.find()
    try {
        res.render("client/homePage", {
        docTitle: "Home Page",
        pageTitle: "Welcome to the Home Page",
        user: req.session.user,
        shopName: "iCase",
        featuredProducts: products.slice(0, 4) // Display first 4 products as featured,
    })
    } catch (error) {
        console.error("Error rendering home page:", error);
        return res.status(500).send("Internal Server Error");
    }
}

exports.getHomePage = getHomePage;