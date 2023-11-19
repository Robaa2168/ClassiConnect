// pages/api/categories/main_category.js

import { connectDb } from '../../../utils/db';
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
  
      const { name, description, imageUrl } = req.body;
  
      // Basic validation for required fields
      if (!name || !description || !imageUrl) {
        return res.status(400).json({ success: false, error: 'Name, description, and image URL are required' });
      }
  
      try {
        // Use the user ID from the decoded token
        const categoryData = {
          name,
          description,
          imageUrl,
          createdBy: userId,
        };
  
        const category = new AirbnbCategory(categoryData);
        await category.save();
        res.status(201).json({ success: true, data: category });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
    } else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  };
