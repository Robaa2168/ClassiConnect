// components/CreateListingForm.js
import React, { useState, useRef, useEffect, } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

function CreateListingForm() {

  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const imageInputRef = useRef(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const initialFormData = {
    productTitle: '',
    description: '',
    imageUrl: [],
    price: '',
    featured: false,
    category: '',
    subcategory: '',
    specialization: '',
    contact: {
      phone: '',
      email: '',
    },
    location: {
      country: 'NY',
      productLocation: '',
      productCoordinates: {
        type: 'Point',
        coordinates: [0, 0], // [longitude, latitude]
      }
    },
    policies: {
      sellerTerms: '',
    },
  };


  const [formData, setFormData] = useState(initialFormData);

  const handleLogout = useCallback(() => {
    signOut();
  }, []);
  


  useEffect(() => {
    if (!user && !authLoading) {
      handleLogout();
    }
  }, [user, authLoading, handleLogout]);
  

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries, // Use the constant here
  });

  const productAutocompleteRef = useRef();



  // Function to update state as user inputs data
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const setValue = (name, value, prevFormData) => {
      const keys = name.split('.');
      let current = prevFormData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
    };

    setFormData((prevFormData) => {
      const newData = { ...prevFormData };
      if (type === 'checkbox') {
        setValue(name, checked, newData);
      } else {
        setValue(name, value, newData);
      }
      return newData;
    });
  };



  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData((prevFormData) => ({
      ...prevFormData,
      imageUrl: [...prevFormData.imageUrl, ...newFiles]
    }));
  };

  const removeImage = (e, index) => {
    e.preventDefault(); // Prevents the default form submit action
    setFormData((prevFormData) => {
      const updatedImages = [...prevFormData.imageUrl];
      updatedImages.splice(index, 1);
      return { ...prevFormData, imageUrl: updatedImages };
    });
  };


  const uploadImages = async () => {
    const urls = [];

    for (const file of formData.imageUrl) {
      const data = new FormData();
      data.append('file', file);
      data.append('upload_preset', 'ml_default');
      data.append('cloud_name', 'dx6jw8k0m');

      try {
        const response = await axios.post('https://api.cloudinary.com/v1_1/dx6jw8k0m/image/upload', data);
        urls.push(response.data.secure_url);
      } catch (error) {
        // Handle errors, e.g., log to console or set an error message
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload images');
      }
    }

    return urls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage('Creating...');

    try {
      // Get the JWT token from localStorage
      const token = localStorage.getItem('token');

      // Send the form data to the server including the imageUrl
      const fullFormData = {
        ...formData
      };

      const res = await fetch('/api/listings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(fullFormData),
      });

      if (!res.ok) {
        throw new Error(`An error occurred: ${res.status}`);
      }

      const data = await res.json();
      setSuccessMessage(data.message || 'Listing created successfully!');

      // Reset form fields here
      setFormData(initialFormData);

    } catch (error) {
      setErrorMessage('An error occurred while submitting the form. Please try again.');
      console.error('Error submitting form', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('/api/categories/get_categories');
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setErrorMessage('Failed to load categories.');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get('/api/categories/get_subCategories');
        setSubcategories(response.data.data);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
        setErrorMessage('Failed to load subcategories.');
      }
    };
    fetchSubcategories();
  }, []);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get('/api/categories/get_specializations');
        setSpecializations(response.data.data);
      } catch (error) {
        console.error('Error fetching specializations:', error);
        setErrorMessage('Failed to load specializations.');
      }
    };
    fetchSpecializations();
  }, []);


  if (!isLoaded) return <div>Loading...</div>;



  const handleProductPlaceSelect = () => {
    const place = productAutocompleteRef.current.getPlace();
    if (!place.geometry) {
      // Handle scenario when the place is not found
      return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();

    setFormData((prevFormData) => ({
      ...prevFormData,
      location: {
        ...prevFormData.location,
        productLocation: place.formatted_address, // Raw text description
        productCoordinates: {
          type: 'Point',
          coordinates: [lng, lat],
        },
      },
    }));
  };



  return (
    <form className="w-full max-w-3xl bg-white p-8 border border-emerald-200 rounded-md shadow-md" onSubmit={handleSubmit} >
      {/* Conditionally render error or success messages */}
      {errorMessage && (
        <div className="mb-4 text-center p-2 bg-red-100 text-red-700 border border-red-200 rounded">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 text-center p-2 bg-green-100 text-green-700 border border-green-200 rounded">
          {successMessage}
        </div>
      )}
      {/* 
      <div className="flex flex-col justify-center items-center mb-4 w-full">
        <label htmlFor="image" className="block text-emerald-700 text-sm font-bold mb-2 w-full">
          <label htmlFor="image-upload" className="block text-emerald-700 text-sm font-bold mb-2 w-full">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-emerald-500 transition-colors">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H8m36-12h-4m4 0H20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Drag files to upload or click here
              </span>
              <input
                id="image-upload"
                type="file"
                name="image"
                onChange={handleFileChange}
                multiple
                className="hidden" // Hide the actual input
              />
            </div>
          </label>
        </label>

{/* 
<div className="mt-4 flex flex-wrap justify-start items-center w-full">
  {formData.imageUrl.map((image, index) => (
    <div key={index} className="flex flex-col items-center mr-4 mb-4">
      <img src={URL.createObjectURL(image)} alt={`Uploaded #${index + 1}`} className="w-16 h-16 object-cover rounded-md" />
      <button onClick={(e) => removeImage(e, index)} className="mt-2 text-red-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  ))}
</div>
*/}



      {/* Title */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-emerald-700 text-sm font-bold mb-2">Product Title:</label>
        <input type="text" name="productTitle" value={formData.productTitle} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
      </div>
      {/* Image URL */}
      <div className="mb-4">
        <label htmlFor="imageUrl" className="block text-emerald-700 text-sm font-bold mb-2">Image URL:</label>
        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Category Dropdown */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-emerald-700 text-sm font-bold mb-2">Product Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-grey-darker"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>

        {/* Subcategory Dropdown */}
        <div className="mb-4">
          <label htmlFor="subcategory" className="block text-emerald-700 text-sm font-bold mb-2">Product Subcategory:</label>
          <select
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-grey-darker"
          >
            <option value="">Select a subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>{subcategory.name}</option>
            ))}
          </select>
        </div>

        {/* Specialization Dropdown */}
        <div className="mb-4">
          <label htmlFor="specialization" className="block text-emerald-700 text-sm font-bold mb-2">Product Specialization:</label>
          <select
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-grey-darker"
          >
            <option value="">Select a specialization</option>
            {specializations.map((specialization) => (
              <option key={specialization._id} value={specialization._id}>{specialization.name}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-emerald-700 text-sm font-bold mb-2">Product Price:</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
        </div>


        {/* Contact Phone */}
        <div className="mb-4">
          <label htmlFor="contact.phone" className="block text-emerald-700 text-sm font-bold mb-2">Seller Phone:</label>
          <input type="tel" name="contact.phone" value={formData.contact.phone} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
        </div>

        {/* Contact Email */}
        <div className="mb-4">
          <label htmlFor="contact.email" className="block text-emerald-700 text-sm font-bold mb-2">Seller Email:</label>
          <input type="email" name="contact.email" value={formData.contact.email} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
        </div>

        {/* House Location */}
        <div className="mb-4">
          <label htmlFor="productLocation" className="block text-emerald-700 text-sm font-bold mb-2">Product Location:</label>
          <Autocomplete
            onLoad={(autocomplete) => (productAutocompleteRef.current = autocomplete)}
            onPlaceChanged={handleProductPlaceSelect}
          >
            <input
              type="text"
              name="productLocation"
              className="shadow border rounded w-full py-2 px-3 text-grey-darker"
            />
          </Autocomplete>
        </div>


        {/* Policies House Rules */}
        <div className="mb-4">
          <label htmlFor="policies.sellerTerms" className="block text-emerald-700 text-sm font-bold mb-2">Sellers Terms:</label>
          <textarea name="policies.sellerTerms" value={formData.policies.sellerTerms} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
        </div>
      </div>
      {/* Description */}
      <div className="mb-4">
        <label htmlFor="description" className="block text-emerald-700 text-sm font-bold mb-2">Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-grey-darker" />
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isLoading} // Disable the button when loading
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
            {/* Display spinner during loading */}
            {isLoading && <FaSpinner className="h-5 w-5 text-white animate-spin" />}
          </span>
          {isLoading ? 'Creating...' : 'Create Listing'}
        </button>
      </div>
    </form>
  );
}

export default CreateListingForm;