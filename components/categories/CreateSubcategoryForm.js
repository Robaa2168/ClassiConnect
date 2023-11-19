// components/CreateSubcategoryForm.js

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';

const CreateSubcategoryForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [parentCategoryId, setParentCategoryId] = useState('');
    const [file, setFile] = useState(null); // Store the file object
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]); // State to hold main categories
    const router = useRouter();
    const { user } = useAuth();
    const imageInputRef = useRef(null);

    useEffect(() => {
        // Declare the async function inside the useEffect
        const fetchCategories = async () => {
            try {
                // Await the axios call and get the response
                const response = await axios.get('/api/categories/get_categories');
                // Update state with the fetched categories
                setCategories(response.data.data); // Make sure this matches the shape of your response
            } catch (error) {
                // Log and set error if the fetch fails
                console.error('Error fetching categories:', error);
                setErrorMessage('Failed to load categories.');
            }
        };

        // Call the async function
        fetchCategories();
    }, []);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]); // Store the file
    };

    const uploadImage = async () => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'ml_default');
        data.append('cloud_name', 'dx6jw8k0m');

        const response = await axios.post('https://api.cloudinary.com/v1_1/dx6jw8k0m/image/upload', data);
        return response.data.secure_url; // Return the URL of the uploaded image
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            setErrorMessage('Please select an image before submitting.');
            return;
        }

        if (!user) {
            setErrorMessage('You must be logged in to create a subcategory.');
            return;
        }

        setIsLoading(true); 
        setErrorMessage(''); 

        try {
            setSuccessMessage('Image uploading...');
            const imageUrl = await uploadImage();
            setSuccessMessage('Form uploading...');

            const formData = {
                name,
                description,
                imageUrl,
                parentCategory: parentCategoryId, 
                createdBy: user._id 
            };

            // Retrieve the JWT token from wherever it's stored (e.g., localStorage)
            const token = localStorage.getItem('token');

            if (!token) {
                setSuccessMessage('');
                setErrorMessage('No authentication token found.');
                setIsLoading(false);
                return;
            }

            const response = await axios.post('/api/categories/sub_category', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setSuccessMessage('Subcategory created successfully!');
                setErrorMessage('');
                setName('');
                setDescription('');
                setParentCategoryId('');
                setFile(null);
                if (imageInputRef.current) {
                    imageInputRef.current.value = '';
                }
            } else {
                setSuccessMessage('');
                setErrorMessage('Failed to create subcategory');
            }
        } catch (error) {
            setSuccessMessage('');
            setErrorMessage(error.response?.data?.error || 'An error occurred while creating the subcategory');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="w-full max-w-3xl bg-white p-8 border border-emerald-200 rounded-md shadow-md" onSubmit={handleSubmit}>
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
            <div className="mb-4">
                <label htmlFor="name" className="block text-emerald-700 text-sm font-bold mb-2">
                    Subcategory Name
                </label>
                <input
                    type="text"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="description" className="block text-emerald-700 text-sm font-bold mb-2">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                ></textarea>
            </div>
            <div className="mb-4">
                <label htmlFor="parentCategory" className="block text-emerald-700 text-sm font-bold mb-2">
                    Parent Category
                </label>
                <select
                    id="parentCategory"
                    required
                    value={parentCategoryId}
                    onChange={(e) => setParentCategoryId(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Select Parent Category</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="image-upload" className="block text-emerald-700 text-sm font-bold mb-2">
                    Subcategory Image
                </label>
                <input
                    id="image-upload"
                    ref={imageInputRef}
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
            </div>
            <div className="flex items-center justify-between">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    {isLoading ? 'Creating...' : 'Create Subcategory'}
                </button>
            </div>
        </form>
    );
};

export default CreateSubcategoryForm