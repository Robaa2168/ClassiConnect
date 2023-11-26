//API route ( /api/listings/request-callback)
import jwt from 'jsonwebtoken';
import { connectDb } from '../../../utils/db';
import CallbackRequest from '../../../models/CallbackRequest';
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

    // Check if user exists
    const user = await AirbnbCloneUser.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.', error: error.message });
  }

  if (req.method === 'POST') {
    // Handle POST request
    const { listingId } = req.body;
    if (!listingId) {
      return res.status(400).json({ message: 'Listing ID is required' });
    }

    // Check for existing uncompleted callback requests
    const existingRequest = await CallbackRequest.findOne({
      listing: listingId,
      user: userId,
      status: { $ne: 'completed' }
    });

    if (existingRequest) {
      return res.status(409).json({ message: 'You already have a pending callback request for this listing.' });
    }

    const newCallbackRequest = new CallbackRequest({ listing: listingId, user: userId });
    await newCallbackRequest.save();
    return res.status(200).json({ message: 'Callback request successfully received' });

  } else if (req.method === 'GET') {
    // Handle GET request
    const { listingId } = req.query;
    if (!listingId) {
      return res.status(400).json({ message: 'Listing ID is required' });
    }

    const existingRequest = await CallbackRequest.findOne({
      listing: listingId,
      user: userId,
      status: { $ne: 'completed' }
    });

    return res.status(200).json({ exists: !!existingRequest });

  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

