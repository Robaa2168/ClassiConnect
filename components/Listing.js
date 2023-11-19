//components/Listing.js

import React, { useState, useEffect, useCallback } from 'react';
import { FiHeart, FiBarChart, FiMessageCircle, FiShare, FiMapPin } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import CommentModal from './CommentModal';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';


function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject('Geolocation is not supported by your browser');
        } else {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        }
    });
}

getUserLocation().then((position) => {
    console.log('Current Position:', position);
    console.log('Latitude:', position.coords.latitude);
    console.log('Longitude:', position.coords.longitude);
}).catch((error) => {
    console.error('Error getting location:', error);
});



function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
}


function Listing({ imageUrl, productTitle, description, price, featured, _id, likes, comments, impressions, houseCoordinates, onShowComments }) {
    const [likesCount, setLikesCount] = useState(likes);
    const [shares, setShares] = useState(0);
    const [impressionCount, setImpressionCount] = useState(impressions);
    const [distance, setDistance] = useState(null);
    const { user } = useAuth();
    const router = useRouter();


    useEffect(() => {
        if (houseCoordinates && houseCoordinates.length === 2) {
            getUserLocation().then((position) => {
                const { latitude, longitude } = position.coords;
                const houseLat = houseCoordinates[1];
                const houseLng = houseCoordinates[0];
                const dist = calculateDistance(latitude, longitude, houseLat, houseLng);
                setDistance(dist);
            }).catch(error => {
                console.error('Error getting location', error);
            });
        }
    }, [houseCoordinates]);



    const showComments = () => {
        onShowComments(_id, productTitle);
    };

    const handleLike = useCallback(async () => {
        if (!user) {
            router.push('/users/login');
            return;
        }
        setLikesCount(prevLikesCount => prevLikesCount + 1);
        try {
            const res = await fetch('/api/listings/like', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listingId: _id }),
            });

            if (!res.ok) {
                throw new Error(`An error occurred: ${res.status}`);
            }

            const updatedListing = await res.json();
            setLikesCount(updatedListing.likes);
        } catch (error) {
            setLikesCount(prevLikesCount => prevLikesCount - 1);
            console.error('Error liking listing:', error);
        }
    }, [_id]);

    const recordImpression = useCallback(async () => {
        // Update the local state to provide instant feedback to the user
        setImpressionCount(prevImpressionCount => prevImpressionCount + 1);

        try {
            const res = await fetch('/api/listings/record-impression', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listingId: _id }),
            });

            if (!res.ok) {
                throw new Error(`An error occurred: ${res.status}`);
            }

            const data = await res.json();
            setImpressionCount(data.impressions);
        } catch (error) {
            setImpressionCount(prevImpressionCount => prevImpressionCount - 1);
            console.error('Error recording impression:', error);
        }
    }, [_id]);

    return (
        <div className="flex flex-col border-2 border-emerald-200 rounded-lg overflow-hidden shadow-md relative group h-full">
            {featured && <span className="absolute top-1 right-1 bg-emerald-500 text-white py-1 px-3 text-xs sm:text-sm font-bold uppercase rounded-full">Featured</span>}
            <Image
                src={imageUrl[0]}
                alt={productTitle ? `Image of ${productTitle}` : ""}
                width={500}
                height={500}
                objectFit="cover"
                quality={75}
                className="transform transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-lg"
            />
            <div className="p-2 sm:p-4 flex flex-col justify-between h-full">
                <Link href={`/listings/${_id}`} onClick={recordImpression} className="hover:underline cursor-pointer">
                    <h3 className="font-semibold text-base sm:text-lg mb-4 truncate">{productTitle}</h3>
                </Link>
                {distance && (
                    <div className="flex items-center justify-center mt-2">
                        <FiMapPin className="mr-2" />
                        <p>{(distance / 1000).toFixed(2)} km away</p> {/* Convert meters to kilometers */}
                    </div>
                )}



                <p className="text-gray-600 mb-4 truncate border-b border-dotted border-emerald-200 pb-2">{description}</p>

                <div className="flex flex-row items-center justify-between w-full">
                    <span className="font-bold text-xs sm:text-sm flex-shrink-0 text-emerald-500">${price}</span>
                    <div className="flex space-x-2  sm:mt-0">
                        <button
                            className="flex items-center space-x-1"
                            onClick={handleLike}
                            aria-label="Like"
                            style={{ outline: 'none' }}
                        >
                            <FiHeart className="text-red-500 cursor-pointer" />
                            <span className="text-xs sm:text-sm">{likesCount}</span>
                        </button>
                        <button
                            className="flex items-center space-x-1"
                            aria-label="Comments"
                            style={{ outline: 'none' }}
                            onClick={showComments}
                        >
                            <FiMessageCircle className="text-gray-500 cursor-pointer" />
                            <span className="text-xs sm:text-sm">{comments}</span>
                        </button>
                        <button
                            className="flex items-center space-x-1"
                            aria-label="Share"
                            style={{ outline: 'none' }}
                        >
                            <FiShare className="text-gray-500 cursor-pointer" />
                            <span className="text-xs sm:text-sm">{shares}</span>
                        </button>
                        <button
                            className="flex items-center space-x-1"
                            aria-label="Impressions"
                            style={{ outline: 'none' }}
                        >
                            <FiBarChart className="text-gray-500 cursor-pointer" />
                            <span className="text-xs sm:text-sm">{impressionCount}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Listing;