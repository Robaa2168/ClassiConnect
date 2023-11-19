// models/AirbnbCloneUser

const mongoose = require('mongoose');

const AirbnbCloneUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['customer', 'agent', 'superAdmin'],
    default: 'customer'
  },
  phoneNumber: {
    type: String,
    unique: true,
    trim: true, 
  },
  otp: {
    type: String, 
    required: false,
  },
  referralCode: {
    type: String,
    required: false, 
  },
  uniqueId: {
    type: String,
    required: true,
    unique: true,
  },
}, 
{
  timestamps: true, 
});

// Check if the model has already been defined
let AirbnbCloneUser;
if (mongoose.models.AirbnbCloneUser) {
    AirbnbCloneUser = mongoose.model('AirbnbCloneUser');
} else {
    AirbnbCloneUser = mongoose.model('AirbnbCloneUser', AirbnbCloneUserSchema);
}

module.exports = AirbnbCloneUser;
