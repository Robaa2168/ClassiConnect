// pages/api/categories/get_categories.js

import { connectDb } from '../../../utils/db';
import AirbnbCategory from '../../../models/AirbnbCategory';

export default async (req, res) => {
    const { method } = req;
    await connectDb();

    if (method === 'GET') {
        try {
            const categories = await AirbnbCategory.find({}); 
            res.status(200).json({ success: true, data: categories });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    } else {
        // If the method is not GET
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ success: false, error: `Method ${method} not allowed` });
    }
};
