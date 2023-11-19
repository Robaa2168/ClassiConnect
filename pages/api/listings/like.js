// pages/api/listings/like.js
import { connectDb } from '../../../utils/db';
import Listing from '../../../models/Listing';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();  // Method Not Allowed
  }

  const { listingId } = req.body;

  if (!listingId) {
    return res.status(400).json({ message: 'Listing ID is required' });  // Bad Request
  }

  await connectDb();

  try {
    const listing = await Listing.findByIdAndUpdate(listingId, { $inc: { likes: 1 } }, { new: true });
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the like count.', error });
  }
}
