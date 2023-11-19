// models/Listing.js
import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AirbnbCloneUser',
    required: true
  },
  contact: {
    phone: { type: String },
    email: { type: String },
  },
  productTitle: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  imageUrl: {
    type: [String],
    required: [true, 'At least one image URL is required'],
    validate: {
      validator: function (array) {
        return Array.isArray(array) && array.length > 0;
      },
      message: 'You should provide at least one image.'
    }
  },
  price: {
    type: String,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  likes: {
    type: Number,
    default: 0
  },
  impressions: {
    type: Number,
    default: 0,
  },
  availability: { type: Boolean, default: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AirbnbCategory',
    required: true
  },

  // Subcategory
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AirbnbSubcategory',
    required: false
  },

  // Specialization
  specialization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AirbnbSpecialization',
    required: false
  },
  location: {
    country: { type: String, default: 'NY' },
    productLocation: { type: String, required: true },
    productCoordinates: {
      type: { type: String, default: 'Point' },
      coordinates: {
        type: [Number], // [longitude, latitude] 
        required: true
      }
    }
  },

  policies: {
    sellerTerms: { type: String, required: false },
  },

});

ListingSchema.index({ 'location.landmarkCoordinates': '2dsphere' });
ListingSchema.index({ 'location.productCoordinates': '2dsphere' });

// Check if the model is already compiled, in which case use that, else compile it
const Listing = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
export default Listing;