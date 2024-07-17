// pages/index.js
import React, { useState, useEffect } from 'react';
import CircleLoader from 'react-spinners/CircleLoader';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Listing from '../components/Listing';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import { motion } from 'framer-motion';
import CommentModal from '../components/CommentModal';


export default function Home({ listings: initialListings }) {
  const [localListings, setListings] = useState(initialListings || []);
  const [isLoading, setIsLoading] = useState(true);
  const [isCommentModalOpen, setCommentModalOpen] = useState(false);
  const [activeComments, setActiveComments] = useState([]);
  const [activeListingTitle, setActiveListingTitle] = useState('');
  const [activeListingId, setActiveListingId] = useState(null);
  const [loadingComments, setLoadingComments] = useState(false);

  const showComments = async (listingId, productTitle) => {
    // Open the modal right away
    setActiveListingId(listingId);
    setActiveListingTitle(productTitle);
    setCommentModalOpen(true);
    setLoadingComments(true);

    try {
      // Fetch the comments as before
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/listings/comments?listing=${listingId}`);
      if (!response.ok) {
        throw new Error(`An error occurred: ${response.statusText}`);
      }
      const comments = await response.json();
      setActiveComments(comments);
    } catch (error) {
      console.error("Could not fetch comments: ", error);
      // Handle error by showing user feedback or a message.
    } finally {
      setLoadingComments(false); // End loading since fetching is done
    }
  };


  useEffect(() => {
    if (!initialListings) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
          // Fetch your listings here and set them
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/listings/listings`);
          if (!response.ok) throw new Error(response.statusText);

          const data = await response.json();
          setListings(data);  // Updates localListings
        } catch (error) {
          console.error("Error fetching data: ", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [initialListings]);


  if (isLoading) {
    return (
      <div className="flex h-screen">
        <div className="m-auto">
          {/* color emerald */}
          <CircleLoader color={"#50C878"} loading={true} size={150} />
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col justify-between h-screen">
      <Head>
        <title>ClassiConnect</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* Header Component */}
      <Header />
      {/* Hero Section Component */}
      <Hero />
      <Categories />
      {/* Main content with card style for listings */}
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center my-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">Featured Listing</h2>
        </div>
        {/* Listings grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {localListings.map(listing => (
            <motion.div
              key={listing._id}
              className="relative rounded-lg overflow-hidden shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0px 3px 3px rgba(0,0,0,0.15)" }}  // Enhanced shadow effect on hover
              whileTap={{ scale: 1 }} 
              transition={{ type: "spring", stiffness: 100 }}  // Smoother transition effect
            >

              <Listing
                {...listing}
                onShowComments={showComments}
                houseCoordinates={
                  listing.location.houseCoordinates && listing.location.houseCoordinates.coordinates
                    ? [listing.location.houseCoordinates.coordinates[0], listing.location.houseCoordinates.coordinates[1]]
                    : null
                }
              />
            </motion.div>
          ))}
        </div>

      </main>


      {isCommentModalOpen && (
        <CommentModal
          listingId={activeListingId}
          comments={activeComments}
          productTitle={activeListingTitle}
          onClose={() => setCommentModalOpen(false)}
          isLoading={loadingComments}
        />
      )}

      {/* Footer Component */}
      <Footer />
    </div>
  );
}




