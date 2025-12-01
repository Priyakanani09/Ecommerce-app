const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    image: { type: [String], required: true },
    name: { type: String, required: true, unique: true },
    price: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);