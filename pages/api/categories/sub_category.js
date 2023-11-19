// pages/api/categories/sub_category.js

import { connectDb } from '../../../utils/db';
import AirbnbSubcategory from '../../../models/AirbnbSubcategory';
import AirbnbCategory from '../../../models/AirbnbCategory';
import jwt from 'jsonwebtoken';

export default async (req, res) => {
  const { method } = req;
  await connectDb();

  if (method === 'POST') {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    // Ensure there is a token
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided.' });
    }

    let userId;

    try {
      // Verify and decode the token to get the user's information
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId; // Use the 'userId' property, as that is what your token contains
    } catch (error) {
      return res.status(401).json({ success: false, error: 'Invalid token.' });
    }

    const { name, description, imageUrl, parentCategory } = req.body;

    // Basic validation for required fields
    if (!name || !description || !imageUrl || !parentCategory) {
      return res.status(400).json({ success: false, error: 'Name, description, image URL, and parent category are required' });
    }

    try {
      // Check if the parent category exists
      const parentCategoryExists = await AirbnbCategory.findById(parentCategory);
      if (!parentCategoryExists) {
        return res.status(404).json({ success: false, error: 'Parent category does not exist' });
      }

      // Use the user ID from the decoded token
      const subcategoryData = {
        name,
        description,
        imageUrl,
        parentCategory,
        createdBy: userId,
      };

      const subcategory = new AirbnbSubcategory(subcategoryData);
      await subcategory.save();
      res.status(201).json({ success: true, data: subcategory });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, error: 'Method not allowed' });
  }
};
