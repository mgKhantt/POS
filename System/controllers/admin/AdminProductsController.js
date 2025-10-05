const Brand = require("../../models/Brand");
const Category = require("../../models/Category");
const Product = require("../../models/Products");

const getAdminProductPage = async (req, res) => {
    const products = await Product.find()
    // console.log(products);

    res.render('admin/adminProductPage', {
        layout: './layouts/adminApp',
        docTitle: 'Admin Product Management',
        pageTitle: 'Product Management',
        products: products,
    })
}

const getAdminCreateProductPage = async (req, res) => {
    const categories = await Category.find();
    const brands = await Brand.find()
    try {
        res.render('admin/adminAddProductPage', {
            layout: './layouts/adminApp',
            docTitle: 'Create New Product',
            pageTitle: 'Add Product',
            categories: categories,
            brands: brands,
        })
    } catch (error) {
        console.error("Error rendering create product page:", error);
        return res.status(500).send("Internal Server Error");
    }
}

const postAdminCreateProductPage = async (req, res) => {
    try {
        const { name, code, category, brand, price } = req.body;
        const image = req.file ? req.file.filename : null;
       
        const filePath = image !== null ? `/uploads/${image}` : `/uploads/no-image.png`;

        const newProduct = new Product({
            name,
            code,
            category,
            brand,
            price,
            imageUrl: filePath,
            stock: 100, // Default stock value
        });
        
        await newProduct.save();
        
        res.redirect('/admin/products?added=success');
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(500).send("Internal Server Error");
    }
}

const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.findByIdAndDelete(productId);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.getAdminProductPage = getAdminProductPage;
exports.getAdminCreateProductPage = getAdminCreateProductPage;
exports.postAdminCreateProductPage = postAdminCreateProductPage;
exports.deleteProduct = deleteProduct;