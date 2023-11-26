//API route ( /api/listings/ListingAvailability)
import jwt from 'jsonwebtoken';
import { connectDb } from '../../../utils/db';
import ListingAvailability from '../../../models/ListingAvailability';
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
    const { listingId } = req.body;
    if (!listingId) {
      return res.status(400).json({ message: 'Listing ID is required' });
    }

    // Mark the listing as unavailable
    let availability = await ListingAvailability.findOne({ listing: listingId });
    if (availability) {
      availability.isAvailable = false; // Mark as unavailable
      availability.markedBy = userId; // Record who marked it
    } else {
      // If it doesn't exist, create a new record
      availability = new ListingAvailability({
        listing: listingId,
        isAvailable: false, // Mark as unavailable
        markedBy: userId
      });
    }

    await availability.save();
    return res.status(200).json({ message: 'Listing marked as unavailable', availability });

  }if (req.method === 'GET') {
    // Fetch the current availability status of a listing for a specific user
    const { listingId } = req.query;
    if (!listingId) {
      return res.status(400).json({ message: 'Listing ID is required' });
    }
  
    const availability = await ListingAvailability.findOne({
      listing: listingId,
      markedBy: userId // Check for availability status set by this specific user
    });
  
    if (!availability) {
      // If no record is found, it indicates the user has not marked the listing as unavailable
      return res.status(404).json({ message: 'No availability data found for this user and listing', isAvailable: false });
    }
  
     // If availability data is found
  const isAvailable = availability ? availability.isAvailable : true;
  return res.status(200).json({ isAvailable });
  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}