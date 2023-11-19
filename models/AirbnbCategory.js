//models/AirbnbCategory.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the category
const airbnbCategorySchema = new Schema({
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
  // Add a reference to the user schema
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'AirbnbCloneUser',
    required: true
  }
}, { timestamps: true });

// Check if the model has already been defined
let AirbnbCategory;
if (mongoose.models.AirbnbCategory) {
    AirbnbCategory = mongoose.model('AirbnbCategory');
} else {
    AirbnbCategory = mongoose.model('AirbnbCategory', airbnbCategorySchema);
}

module.exports = AirbnbCategory;
