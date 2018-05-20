var mongoose = require('mongoose');

var ProductSchema = new mongoose.Schema({
    name: {type: String, unique: true, required: true },
    category:{type: String, default: "nieznana"},
    color: String,
    price: Number
});

var Products = mongoose.model('product', ProductSchema);

module.exports = Products;
