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

//Category Manager and Brand Manager Controllers
const getCategoryManagerPage = async (req, res) => {
    const categories = await Category.find();
    try {
        res.render('admin/categoryManagerPage', {
            layout: './layouts/adminApp',
            docTitle: 'Category Manager',
            pageTitle: 'Manage Categories',
            categories: categories,
        })
    } catch (error) {
        console.error("Error rendering category manager page:", error);
        return res.status(500).send("Internal Server Error");
    }
}

const postCategoryManager = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send("Category name is required");
        }

        // Check for duplicate category
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).send("Category already exists");
        }
        const newCategory = new Category({ name });
        await newCategory.save();
        res.redirect('/admin/products/create-product/category-manager?added=success');
    } catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).send("Internal Server Error");
    }
}
const deleteCategoryManager = async (req, res) => {
    try {
        const categoryID = req.params.id
        await Category.findByIdAndDelete(categoryID)
        res.status(200).json({ message: "Category deleted successfully" })
    } catch (error) {
        console.error("Error deleting category:", error)
    }
}

// Brand Manager Controllers
const getBrandManagerPage = async (req, res) => {
    const brands = await Brand.find();
    try {
        res.render('admin/brandManagerPage', {
            layout: './layouts/adminApp',
            docTitle: 'Brand Manager',
            pageTitle: 'Manage Brands',
            brands: brands,
        })
    } catch (error) {
        console.error("Error rendering brand manager page:", error);
        return res.status(500).send("Internal Server Error");
    }
}

const postBrandManager = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).send("Category name is required");
        }

        // Check for duplicate category
        const existingBrand = await Brand.findOne({ name });
        if (existingBrand) {
            return res.status(400).send("Brand already exists");
        }
        const newBrand = new Brand({ name });
        await newBrand.save();
        res.redirect('/admin/products/create-product/brand-manager?added=success');
    } catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).send("Internal Server Error");
    }
}
const deleteBrandManager = async (req, res) => {
    try {
        const brandID = req.params.id
        await Brand.findByIdAndDelete(brandID)
        res.status(200).json({ message: "Brand deleted successfully" })
    } catch (error) {
        console.error("Error deleting category:", error)
    }
}

exports.getAdminProductPage = getAdminProductPage;
exports.getAdminCreateProductPage = getAdminCreateProductPage;
exports.postAdminCreateProductPage = postAdminCreateProductPage;
exports.deleteProduct = deleteProduct;

exports.getCategoryManagerPage = getCategoryManagerPage;
exports.postCategoryManager = postCategoryManager;
exports.deleteCategoryManager = deleteCategoryManager;

exports.getBrandManagerPage = getBrandManagerPage;
exports.postBrandManager = postBrandManager;
exports.deleteBrandManager = deleteBrandManager;