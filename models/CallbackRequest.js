//models/CallbackRequest.js

import mongoose from 'mongoose';

const CallbackRequestSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AirbnbCloneUser',
    required: true
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
  additionalInfo: {
    type: String,
    trim: true,
    required: false,
  }
}, { timestamps: true });

// Check if the model is already compiled, in which case use that, else compile it
const CallbackRequest = mongoose.models.CallbackRequest || mongoose.model('CallbackRequest', CallbackRequestSchema);
export default CallbackRequest;
