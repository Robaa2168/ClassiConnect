// pages/categories/create-category.js
import React, { useState } from 'react';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CreateCategoryForm from '../../components/categories/CreateCategoryForm';
import CreateSubcategoryForm from '../../components/categories/CreateSubcategoryForm';
import CreateSpecializationForm from '../../components/categories/CreateSpecializationForm';

function CreateCategoryPage() {
  const [activeForm, setActiveForm] = useState('category');


  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Head>
        <title>Create Category - ClassiConnect</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex-grow">
        <div className="flex justify-center items-center w-full h-full">
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8 mx-auto bg-white shadow-md rounded-lg max-w-4xl mt-8">
            {/* Sub-navbar for form selection */}
            <div className="mb-6 flex justify-center">
              <button
                onClick={() => setActiveForm('category')}
                className={`px-4 py-2 mr-2 ${activeForm === 'category' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Category
              </button>
              <button
                onClick={() => setActiveForm('subcategory')}
                className={`px-4 py-2 mr-2 ${activeForm === 'subcategory' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Subcategory
              </button>
              <button
                onClick={() => setActiveForm('specialization')}
                className={`px-4 py-2 ${activeForm === 'specialization' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-800'}`}
              >
                Specialization
              </button>
            </div>

            {/* Conditional rendering of forms based on activeForm state */}
            {activeForm === 'category' && <CreateCategoryForm />}
            {activeForm === 'subcategory' && <CreateSubcategoryForm />}
            {activeForm === 'specialization' && <CreateSpecializationForm />}
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateCategoryPage;