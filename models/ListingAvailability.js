// models/ListingAvailability

import mongoose from 'mongoose';

const ListingAvailabilitySchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  isAvailable: {
    type: Boolean,
    required: true,
    default: true
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AirbnbCloneUser',
    required: false
  }
}, { timestamps: true }); // Enable timestamps

const ListingAvailability = mongoose.models.ListingAvailability || mongoose.model('ListingAvailability', ListingAvailabilitySchema);

export default ListingAvailability;
