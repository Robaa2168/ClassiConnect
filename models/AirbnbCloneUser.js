// models/AirbnbCloneUser

const mongoose = require('mongoose');

const AirbnbCloneUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
    default: 'DefaultFirstName', // Dummy default value
  },
  lastName: {
    type: String,
    required: true,
    default: 'DefaultLastName', // Dummy default value
  },
  profileImage: {
    type: String,
    required: false,
    default: 'https://example.com/default-image.jpg', // Dummy default image URL
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
const AirbnbCloneUser = mongoose.models.AirbnbCloneUser || mongoose.model('AirbnbCloneUser', AirbnbCloneUserSchema);
module.exports = AirbnbCloneUser;
