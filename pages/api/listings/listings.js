// pages/api/listings/listings.js

import { connectDb } from '../../../utils/db';
import Listing from '../../../models/Listing';

export default async function handler(req, res) {
  // Connect to the database
  await connectDb();

  if (req.method === 'GET') {
    try {
      // Find all listings in the database
      const listings = await Listing.find({});
      // Send the listings as the response
      res.status(200).json(listings);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while retrieving listings.', error });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
