// pages/api/listings/[id].js
import { connectDb } from '../../../utils/db';
import Listing from '../../../models/Listing';

export default async function handler(req, res) {
  const { id } = req.query;

  await connectDb();

  if (req.method === 'GET') {
    // Handle GET request for a specific listing by ID
    try {
      const listing = await Listing.findById(id);
      if (!listing) {
        return res.status(404).json({ message: 'Listing not found' });
      }
      res.status(200).json(listing);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  } else if (req.method === 'PUT') {
    // Handle PUT request to update a specific listing
    try {
      const listing = await Listing.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(listing);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  } else if (req.method === 'DELETE') {
    // Handle DELETE request to delete a specific listing
    try {
      await Listing.findByIdAndDelete(id);
      res.status(200).json({ message: 'Listing deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
