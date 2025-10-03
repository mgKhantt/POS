const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        category: { type: String, required: true },
        brand: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        description: { type: String },
        code: { type: String, unique: true, required: true },
        imageUrl: { type: String },
    },
    { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;