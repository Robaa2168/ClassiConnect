// pages/api/listings/record-impression.js
import { connectDb } from '../../../utils/db';
import Listing from '../../../models/Listing';

export default async function handler(req, res) {
  const { listingId } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).end(); 
  }

  if (!listingId) {
    return res.status(400).json({ message: 'Listing ID is required' }); 
  }

  await connectDb();

  try {
    // Increment the impressions count for the listing
    const listing = await Listing.findByIdAndUpdate(
      listingId, 
      { $inc: { impressions: 1 } }, 
      { new: true }
    );
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json({ impressions: listing.impressions });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while recording the impression.', error });
  }
}
