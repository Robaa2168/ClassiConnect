// models/AirbnbSpecialization.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the specialization
const airbnbSpecializationSchema = new Schema({
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
  // Reference to the subcategory
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: 'AirbnbSubcategory', 
    required: true
  },
  // Add a reference to the user schema who created the specialization
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'AirbnbCloneUser',
    required: true
  }
}, { timestamps: true });

// Check if the model has already been defined
let AirbnbSpecialization;
if (mongoose.models.AirbnbSpecialization) {
    AirbnbSpecialization = mongoose.model('AirbnbSpecialization');
} else {
    AirbnbSpecialization = mongoose.model('AirbnbSpecialization', airbnbSpecializationSchema);
}

module.exports = AirbnbSpecialization;
