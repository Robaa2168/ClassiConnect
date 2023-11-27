// API route (e.g., /api/chat/get-messages)
import jwt from 'jsonwebtoken';
import { connectDb } from '../../../utils/db';
import ChatMessage from '../../../models/ChatMessage';

export default async function handler(req, res) {
    await connectDb();

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    let userId;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.', error: error.message });
    }

    if (req.method === 'GET') {
        const listingId = req.query.listingId; // Get the listing ID from the query parameters
        if (!listingId) {
            return res.status(400).json({ message: 'Listing ID is required' });
        }

        try {
            // Fetch messages related to the specific listing
            const messages = await ChatMessage.find({
                listing: listingId,
                $or: [{ sender: userId }, { receiver: userId }]
            }).sort({ createdAt: -1 });

            return res.status(200).json(messages);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching messages', error: error.message });
        }
    } else {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
