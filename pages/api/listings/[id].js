// pages/api/listings/[id].js
import { connectDb } from '../../../utils/db';
import Listing from '../../../models/Listing';

export default async function handler(req, res) {
  const { id } = req.query;

  await connectDb();

  if (req.method === 'GET') {
    // Handle GET request for a specific listing by ID
    try {
      // Populate the 'seller' field with the 'firstName', 'lastName', and 'profileImage' from the AirbnbCloneUser collection
      const listing = await Listing.findById(id).populate('seller', 'firstName lastName profileImage');
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      console.log(listing);
      res.status(200).json(listing);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  } else {
    // If not a GET request, return a 405 Method Not Allowed
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
