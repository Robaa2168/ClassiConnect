// pages/create-listing.js
import React from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CreateListingForm from '../components/CreateListingForm';


function CreateListingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Head>
        <title>ViewNyumba</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      {/* The rest of the content is centered, but the header is not affected */}
      <div className="flex-grow">
        <div className="flex justify-center items-center w-full h-full">
          {/* Add margin-top to create space between the header and the form. Adjust mt-8 to the space you need */}
          <div className="w-full px-4 sm:px-6 lg:px-8 py-8 mx-auto bg-white shadow-md rounded-lg max-w-4xl mt-8">
            <CreateListingForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateListingPage;
