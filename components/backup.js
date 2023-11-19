// components/CreateListingForm.js
import React, { useState } from 'react';
import { CameraIcon, StarIcon } from '@heroicons/react/24/outline';  // Import icons from Heroicons

function CreateListingForm() {
  // Set initial state for form inputs
  const [successMessage, setSuccessMessage] = useState(null);  // Success feedback
  const [errorMessage, setErrorMessage] = useState(null);

  const [formData, setFormData] = useState({
    host: '',
    contact: {
        phone: '',
        email: '',
    },
    title: '',
    description: '',
    imageUrl: '',
    price: '',
    featured: false,
    likes: 0,
    availability: true,
    category: '',
    managementType: 'Landlord',
    rentDeadline: 1,
    location: {
        estate: '',
        landmark: '',
        subCounty: '',
        city: 'Nairobi',
        country: 'Kenya',
        coordinates: {
            lat: 0,
            lng: 0,
        },
    },
    amenities: {
        wifi: false,
        parking: 'Limited',
        petsAllowed: false,
    },
    accessibility: {
        wheelchair: false,
        elevator: false,
    },
    policies: {
        cancellation: '',
        houseRules: '',
    },
    additionalPricing: {
        cleaningFee: 0,
        deposit: 0,
        extraPersonFee: 0,
    },
    capacity: {
        guests: 0,
        bedrooms: 0,
        beds: 0,
        baths: 0,
    },
});

const [step, setStep] = useState(1);

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
};

const handleNext = () => {
    // Validate the form data for the current step, and handle any errors if necessary
    // If data is valid, increment the step
    setStep(step + 1);
};

const handleBack = () => {
    // Go back to the previous step
    setStep(step - 1);
};



  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear out any previous messages
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/listings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`An error occurred: ${res.status}`);
      }
      const data = await res.json();
      // Show success message from response or a default success message
      setSuccessMessage(data.message || 'Listing created successfully!');

      // Clear the form after successful submission
      setFormData({ title: '', description: '', imageUrl: '', price: '', featured: false });

    } catch (error) {
      // Display a user-friendly error message
      setErrorMessage('An error occurred while submitting the form. Please try again.');
      console.error('Error submitting form', error);
    }
  };


  return (
    <div className="container mx-auto p-4">
        <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {step === 1 && (
                <div>
                    <input
                        type="text"
                        name="host"
                        value={formData.host}
                        onChange={handleChange}
                        placeholder="Host ID"
                        required
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="text"
                        name="contact.phone"
                        value={formData.contact.phone}
                        onChange={handleChange}
                        placeholder="Phone"
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="email"
                        name="contact.email"
                        value={formData.contact.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Title"
                        required
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Description"
                        required
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="Image URL"
                        required
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Price"
                        required
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    Featured
                    <input
                        type="number"
                        name="likes"
                        value={formData.likes}
                        onChange={handleChange}
                        placeholder="Likes"
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="checkbox"
                        name="availability"
                        checked={formData.availability}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    Available
                    {/* ... Other fields for Step 1 ... */}
                    <button type="button" onClick={handleNext} className="px-4 py-2 bg-emerald-500 text-white rounded">Next</button>
                </div>
            )}

            {/* Step 2: Location & Amenities */}
            {step === 2 && (
                <div>
                    <input
                        type="text"
                        name="location.estate"
                        value={formData.location.estate}
                        onChange={handleChange}
                        placeholder="Estate"
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="text"
                        name="location.landmark"
                        value={formData.location.landmark}
                        onChange={handleChange}
                        placeholder="Landmark"
                        required
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="text"
                        name="location.subCounty"
                        value={formData.location.subCounty}
                        onChange={handleChange}
                        placeholder="Sub County"
                        required
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="text"
                        name="location.city"
                        value={formData.location.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="text"
                        name="location.country"
                        value={formData.location.country}
                        onChange={handleChange}
                        placeholder="Country"
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="number"
                        name="location.coordinates.lat"
                        value={formData.location.coordinates.lat}
                        onChange={handleChange}
                        placeholder="Latitude"
                        required
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="number"
                        name="location.coordinates.lng"
                        value={formData.location.coordinates.lng}
                        onChange={handleChange}
                        placeholder="Longitude"
                        required
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="checkbox"
                        name="amenities.wifi"
                        checked={formData.amenities.wifi}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    Wifi
                    <select
                        name="amenities.parking"
                        value={formData.amenities.parking}
                        onChange={handleChange}
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="Limited">Limited Parking</option>
                        <option value="Medium">Medium Parking</option>
                        <option value="Enough">Enough Parking</option>
                    </select>
                    <input
                        type="checkbox"
                        name="amenities.petsAllowed"
                        checked={formData.amenities.petsAllowed}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    Pets Allowed
                    {/* ... Other fields for Step 2 ... */}
                    <button type="button" onClick={handleBack} className="px-4 py-2 bg-emerald-500 text-white rounded mr-2">Back</button>
                    <button type="button" onClick={handleNext} className="px-4 py-2 bg-emerald-500 text-white rounded">Next</button>
                </div>
            )}

            {/* Step 3: Policies & Pricing */}
            {step === 3 && (
                <div>
                    <input
                        type="text"
                        name="policies.cancellation"
                        value={formData.policies.cancellation}
                        onChange={handleChange}
                        placeholder="Cancellation Policy"
                        required
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <textarea
                        name="policies.houseRules"
                        value={formData.policies.houseRules}
                        onChange={handleChange}
                        placeholder="House Rules"
                        required
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="number"
                        name="additionalPricing.cleaningFee"
                        value={formData.additionalPricing.cleaningFee}
                        onChange={handleChange}
                        placeholder="Cleaning Fee"
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="number"
                        name="additionalPricing.deposit"
                        value={formData.additionalPricing.deposit}
                        onChange={handleChange}
                        placeholder="Deposit"
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="number"
                        name="additionalPricing.extraPersonFee"
                        value={formData.additionalPricing.extraPersonFee}
                        onChange={handleChange}
                        placeholder="Extra Person Fee"
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="number"
                        name="capacity.guests"
                        value={formData.capacity.guests}
                        onChange={handleChange}
                        placeholder="Guests"
                        required
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="number"
                        name="capacity.bedrooms"
                        value={formData.capacity.bedrooms}
                        onChange={handleChange}
                        placeholder="Bedrooms"
                        required
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="number"
                        name="capacity.beds"
                        value={formData.capacity.beds}
                        onChange={handleChange}
                        placeholder="Beds"
                        required
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="number"
                        name="capacity.baths"
                        value={formData.capacity.baths}
                        onChange={handleChange}
                        placeholder="Baths"
                        required
                        className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button type="button" onClick={handleBack} className="px-4 py-2 bg-emerald-500 text-white rounded mr-2">Back</button>
                    <button type="submit" className="px-4 py-2 bg-emerald-500 text-white rounded">Submit</button>
                </div>
            )}
        </form>
    </div>
);
}

export default CreateListingForm;