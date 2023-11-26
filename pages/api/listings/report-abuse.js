// API route (/api/listings/report-abuse)
import jwt from 'jsonwebtoken';
import { connectDb } from '../../../utils/db';
import ReportAbuse from '../../../models/ReportAbuse';
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
    const { listingId, reportContent } = req.body;
    if (!listingId || !reportContent) {
      return res.status(400).json({ message: 'Listing ID and report content are required' });
    }

    // Check for existing abuse reports by this user for the same listing
    const existingReport = await ReportAbuse.findOne({
      listing: listingId,
      reportedBy: userId
    });

    if (existingReport) {
      return res.status(409).json({ message: 'You have already reported this listing.' });
    }

    const newReport = new ReportAbuse({ listing: listingId, reportedBy: userId, reportContent });
    await newReport.save();
    return res.status(200).json({ message: 'Abuse report successfully submitted' });

  } else if (req.method === 'GET') {
    const { listingId } = req.query;
    if (!listingId) {
      return res.status(400).json({ message: 'Listing ID is required' });
    }

    const existingReport = await ReportAbuse.findOne({
      listing: listingId,
      reportedBy: userId
    });

    return res.status(200).json({ hasReported: !!existingReport });

  } else {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
