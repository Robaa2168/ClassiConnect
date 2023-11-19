// pages/api/categories/specialization.js

import { connectDb } from '../../../utils/db';
import AirbnbSpecialization from '../../../models/AirbnbSpecialization';
import AirbnbSubcategory from '../../../models/AirbnbSubcategory';
import jwt from 'jsonwebtoken';

export default async (req, res) => {
  const { method } = req;
  await connectDb();

  if (method === 'POST') {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided.' });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId;
    } catch (error) {
      return res.status(401).json({ success: false, error: 'Invalid token.' });
    }

    const { name, description, imageUrl, subcategory } = req.body;
    if (!name || !description || !imageUrl || !subcategory) {
      return res.status(400).json({ success: false, error: 'Name, description, image URL, and subcategory are required' });
    }

    try {
      // Check if the subcategory exists
      const subcategoryExists = await AirbnbSubcategory.findById(subcategory);
      if (!subcategoryExists) {
        return res.status(404).json({ success: false, error: 'Subcategory does not exist' });
      }

      const specializationData = {
        name,
        description,
        imageUrl,
        subcategory,
        createdBy: userId,
      };

      const specialization = new AirbnbSpecialization(specializationData);
      await specialization.save();
      res.status(201).json({ success: true, data: specialization });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
};
