// models/Comment

const mongoose = require('mongoose');

// Set up a new schema
const commentSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Listing',
        required: true, 
    },
    text: {
        type: String,
        required: true, 
        trim: true, 
    },
    username: {
        type: String,
        required: true, 
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    likes: {
        type: Number,
        default: 0, 
    },
    dislikes: {
        type: Number,
        default: 0, 
    },
});

// Create a model using the schema
const Comment = mongoose.models.Comment || mongoose.model('Comment', commentSchema);

// Export the model
export default Comment;

