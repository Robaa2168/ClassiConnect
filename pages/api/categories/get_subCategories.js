// pages/api/categories/get_subcategories.js

import { connectDb } from '../../../utils/db';
import AirbnbSubcategory from '../../../models/AirbnbSubcategory';

const getSubcategories = async (req, res) => {
    const { method } = req;
    await connectDb();

    if (method === 'GET') {
        try {
            const subcategories = await AirbnbSubcategory.find({}).populate('parentCategory');
            res.status(200).json({ success: true, data: subcategories });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    } else {
        // If the method is not GET
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ success: false, error: `Method ${method} not allowed` });
    }
};

export default getSubcategories;