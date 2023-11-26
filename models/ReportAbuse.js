// models/ReportAbuse 

import mongoose from 'mongoose';

const ReportAbuseSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AirbnbCloneUser',
    required: true
  },
  reportContent: {
    type: String,
    required: true,
    trim: true
  },
  reportDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved'],
    default: 'pending',
  },
  additionalInfo: {
    type: String,
    trim: true,
    required: false,
  }
}, { timestamps: true });

// Check if the model is already compiled, in which case use that, else compile it
const ReportAbuse = mongoose.models.ReportAbuse || mongoose.model('ReportAbuse', ReportAbuseSchema);
export default ReportAbuse;
