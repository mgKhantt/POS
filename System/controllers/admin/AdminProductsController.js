const Product = require("../../models/Products");

const getAdminProductPage = async (req, res) => {
    const products = await Product.find()
    console.log(products);

    res.render('admin/adminProductPage', {
        layout: './layouts/adminApp',
        docTitle: 'Admin Product Management',
        pageTitle: 'Product Management',
        products: products,
    })
}

exports.getAdminProductPage = getAdminProductPage;