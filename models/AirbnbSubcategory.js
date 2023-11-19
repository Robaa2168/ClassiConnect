// models/AirbnbSubcategory.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the subcategory
const airbnbSubcategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true,
    default: ''
  },
  // Reference to the main category
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'AirbnbCategory',
    required: true
  },
  // Add a reference to the user schema who created the subcategory
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'AirbnbCloneUser',
    required: true
  }
}, { timestamps: true });

// Check if the model has already been defined
let AirbnbSubcategory;
if (mongoose.models.AirbnbSubcategory) {
    AirbnbSubcategory = mongoose.model('AirbnbSubcategory');
} else {
    AirbnbSubcategory = mongoose.model('AirbnbSubcategory', airbnbSubcategorySchema);
}

module.exports = AirbnbSubcategory;
