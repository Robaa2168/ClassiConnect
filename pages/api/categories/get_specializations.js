// pages/api/categories/get_specializations.js

import { connectDb } from '../../../utils/db';
import AirbnbSpecialization from '../../../models/AirbnbSpecialization';

export default async (req, res) => {
    const { method } = req;
    await connectDb();

    if (method === 'GET') {
        try {
            // Fetching all specializations without populating the parent category
            const specializations = await AirbnbSpecialization.find({});
            res.status(200).json({ success: true, data: specializations });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    } else {
        // If the method is not GET
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ success: false, error: `Method ${method} not allowed` });
    }
};
