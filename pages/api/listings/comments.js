// pages/api/listings/comments.js

import { connectDb } from '../../../utils/db';
import Comment from '../../../models/commentModel'; // assuming your model name is 'Comment'

export default async function handler(req, res) {
    await connectDb();

    switch (req.method) {
        case 'GET':
            return getComments(req, res);
        case 'POST':
            return addComment(req, res);
        default:
            return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

// Updated function to get comments by listing
async function getComments(req, res) {
    const listingId = req.query.listing; // assuming you're passing the listing ID as a query parameter

    if (!listingId) {
        return res.status(400).json({ message: 'Listing ID is required' });
    }

    try {
        const comments = await Comment.find({ listing: listingId }).populate('listing');
        return res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

// Updated function to add a comment
async function addComment(req, res) {
    const { listing, text, username } = req.body;

    if (!listing || !text || !username) {
        return res.status(400).json({ message: 'Listing, text, and username are required' });
    }

    try {
        // Assuming listing is the ID of the listing to which this comment belongs
        const newComment = new Comment({ listing, text, username });
        await newComment.save();

        // You might want to populate the 'listing' field here as well before returning,
        // so the client receives not just the listing's ID but some of its populated information.
        const populatedComment = await Comment.findById(newComment._id).populate('listing');

        return res.status(201).json(populatedComment);
    } catch (error) {
        console.error('Error adding comment', error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}

