// API route (e.g., /api/chat/send-message)
import jwt from 'jsonwebtoken';
import { connectDb } from '../../../utils/db';
import ChatMessage from '../../../models/ChatMessage';
import AirbnbCloneUser from '../../../models/AirbnbCloneUser';

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

        const user = await AirbnbCloneUser.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.', error: error.message });
    }

    if (req.method === 'POST') {
        const { message, receiver } = req.body;
        if (!message || !receiver) {
            return res.status(400).json({ message: 'Message and receiver are required' });
        }

        const newMessage = new ChatMessage({ sender: userId, receiver, message });
        await newMessage.save();
        return res.status(200).json(newMessage); // You might want to populate or transform this object as needed
    } else {
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
