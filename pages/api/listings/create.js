// pages/api/listings/create.js
import axios from 'axios';
import cheerio from 'cheerio';
import cloudinary from 'cloudinary';
import { connectDb } from '../../../utils/db';
import Listing from '../../../models/Listing';
import AirbnbCloneUser from '../../../models/AirbnbCloneUser';
import AirbnbCategory from '../../../models/AirbnbCategory';
import AirbnbSubcategory from '../../../models/AirbnbSubcategory';
import AirbnbSpecialization from '../../../models/AirbnbSpecialization';
import jwt from 'jsonwebtoken';

// Configure Cloudinary (assumes environment variables are set)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    userId = decoded.userId;

    const user = await AirbnbCloneUser.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }

  await connectDb();
  const { imageUrl, category, subcategory, specialization, ...rest } = req.body;

  try {
    if (!imageUrl) {
      return res.status(400).json({ error: 'Please provide an image URL.' });
    }
    if (category && !(await AirbnbCategory.findById(category))) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    if (subcategory && !(await AirbnbSubcategory.findById(subcategory))) {
      return res.status(404).json({ error: 'Subcategory not found.' });
    }
    if (specialization && !(await AirbnbSpecialization.findById(specialization))) {
      return res.status(404).json({ error: 'Specialization not found.' });
    }

    // Function to scrape and upload images
    const uploadImages = async (imageUrl) => {
      try {
        const htmlData = await axios.get(imageUrl).then(response => response.data);
        const $ = cheerio.load(htmlData);
        
        // Select the 'href' attribute of each thumbnail anchor
        let imageUrls = $('#thumbs .thumb').map((i, el) => $(el).attr('href')).get();
    
        // Filter out any undefined or null URLs and limit to 10 images
        const validImageUrls = imageUrls.filter(url => url).slice(0, 10);
    
        if (validImageUrls.length === 0) {
          throw new Error('No suitable images found in the provided URL.');
        }
    
        const uploadedImageUrls = await Promise.all(
          validImageUrls.map(async (url) => {
            try {
              // Ensure URL is valid and points to an image
              if (url && url.match(/\.(jpeg|jpg|gif|png)$/)) {
                const uploadedImage = await cloudinary.v2.uploader.upload(url);
                return uploadedImage.secure_url;
              }
              return null;
            } catch {
              return null; // Skip this image if there's an error
            }
          })
        );
    
        // Filter out null values (failed uploads or invalid URLs)
        return uploadedImageUrls.filter(url => url !== null);
      } catch (error) {
        console.error('Error in uploadImages:', error);
        return []; // Return an empty array on error
      }
    };
    
    
    const uploadedImages = await uploadImages(imageUrl);

    if (uploadedImages.length === 0) {
      return res.status(400).json({ error: 'Unable to find or upload images from the provided URL. Please provide a URL with accessible images.' });
    }

    // Include uploaded image URLs in listing data
    const listingData = {
      category,
      subcategory,
      specialization,
      ...rest,
      imageUrl: uploadedImages,
      seller: userId
    };

    const listing = await Listing.create(listingData);
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the listing.', error });
  }
}
