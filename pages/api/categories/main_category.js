// pages/api/categories/main_category.js

import { connectDb } from '../../../utils/db';
import AirbnbCategory from '../../../models/AirbnbCategory';
import jwt from 'jsonwebtoken';


const createCategory = async (req, res) => {
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

      const { name, description, imageUrl } = req.body;

      if (!name || !description || !imageUrl) {
          return res.status(400).json({ success: false, error: 'Name, description, and image URL are required' });
      }

      try {
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

export default createCategory;