// models/Product.js
const mongoose = require('mongoose');

// Define Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required']
  }
});

// Export the model
module.exports = mongoose.model('Product', productSchema);
