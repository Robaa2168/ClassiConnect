//pages/listings/[id.js]]
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FaCamera, FaEye, FaChevronLeft, FaChevronRight, FaCheckCircle, FaSms, FaShoppingCart, FaComments, FaBan, FaFlag, FaTimes, FaPaperPlane, FaSpinner, FaGavel } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Lightbox } from 'react-modal-image';
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import Header from '../../components/Header';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

export async function getServerSideProps({ params }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/listings/${params.id}`);
    if (!res.ok) {
        return { notFound: true };
    }
    const listing = await res.json();
    return { props: { listing } };
}


const ListingPage = ({ listing }) => {
    const { user, loading: authLoading, signOut } = useAuth();
    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [openLightbox, setOpenLightbox] = useState(false);
    const [mainImageUrl, setMainImageUrl] = useState(listing.imageUrl[0]);
    const [isOverflow, setIsOverflow] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollRef = useRef(null);
    const router = useRouter();
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [isInputFocused, setInputFocused] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [feedbacks, setFeedbacks] = useState([]);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const [isUnavailable, setIsUnavailable] = useState(false);
    const [reportDescription, setReportDescription] = useState('');
    const [wordCount, setWordCount] = useState(0);
    const [hasReportedAbuse, setHasReportedAbuse] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const [messages, setMessages] = useState([
        { id: 1, sender: 'user', text: 'Hi, is this still available?', timestamp: new Date(new Date().setHours(new Date().getHours() - 23)) },
        { id: 2, sender: 'seller', text: 'Yes, it is! Would you like to know more?', timestamp: new Date(new Date().setHours(new Date().getHours() - 22)) },
        { id: 3, sender: 'user', text: 'Can you provide more details about its condition?', timestamp: new Date(new Date().setHours(new Date().getHours() - 20)) },
        { id: 4, sender: 'seller', text: 'Sure, it’s in great condition with no scratches.', timestamp: new Date(new Date().setHours(new Date().getHours() - 18)) },
        { id: 5, sender: 'user', text: 'Sounds good. Are you available for a viewing tomorrow?', timestamp: new Date(new Date().setHours(new Date().getHours() - 10)) },
        { id: 6, sender: 'seller', text: 'Yes, how about 3 PM?', timestamp: new Date(new Date().setHours(new Date().getHours() - 1)) },
        // You can add more messages as required
    ]);

    const handleDescriptionChange = (e) => {
        let newDescription = e.target.value;
    
        // Truncate the input if it exceeds 200 characters
        if (newDescription.length > 200) {
            newDescription = newDescription.substring(0, 200);
        }
    
        setReportDescription(newDescription);
    
        // Update character count
        setWordCount(newDescription.length);
    };
    

    const handlePostAdClick = () => {
        router.push('/users/signup');
    };

    const openReportModal = () => {
        setIsReportModalOpen(true);
    };

    const closeReportModal = () => {
        setIsReportModalOpen(false);
    };


    const openFeedback = async () => {
        setIsFeedbackOpen(true);
        setIsLoading(true);

        try {
            // Replace with your actual fetch call
            const response = await fetch(`/api/listings/comments?listing=${listing._id}`);
            const data = await response.json();
            setFeedbacks(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching feedback:', error);
            setIsLoading(false);
        }
    };

    const closeFeedback = () => {
        setIsFeedbackOpen(false);
    };

    const openChat = () => {
        setIsChatOpen(true);
    };

    const closeChat = () => {
        setIsChatOpen(false);
    };

    const handleSendMessage = () => {
        // Add functionality to handle sending a message
        if (newMessage.trim()) {
            const newMsg = {
                id: messages.length + 1,
                sender: 'user',
                text: newMessage,
                timestamp: new Date()
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };



    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://classi-connect.vercel.app/';

    useEffect(() => {
        if (scrollRef.current) {
            const { scrollWidth, clientWidth } = scrollRef.current;
            setIsOverflow(scrollWidth > clientWidth);
        }
    }, [listing.imageUrl]);

    const handleThumbnailHover = (url) => {
        const index = listing.imageUrl.indexOf(url);
        if (index >= 0) {
            setCurrentIndex(index); // Update the current index
            setMainImageUrl(url);
        }
    };



    const handleScroll = (direction) => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            if (direction === 'left') {
                current.scrollLeft -= 50;
            } else {
                current.scrollLeft += 50;
            }
        }
    };

    const handleRequestCallback = async () => {
        if (!user) {
            router.push('/users/login');
            return;
        }
        // Optimistically update UI
        setRequestSent(true);

        try {
            // Get the JWT token from localStorage
            const token = localStorage.getItem('token');
            const response = await fetch('/api/listings/request-callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ listingId: listing._id }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // You can handle a successful response here if needed
        } catch (error) {
            console.error('Error:', error);
            // Revert state if the request fails
            setRequestSent(false);
        }
    };

    useEffect(() => {
        const listingId = listing._id;
        setRequestSent(false); // Reset state when listing changes

        const storedRequestState = localStorage.getItem(`requestSent-${listingId}`);

        if (storedRequestState === 'true') {
            setRequestSent(true);
        } else {
            const checkCallbackRequest = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`/api/listings/request-callback?listingId=${listingId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        if (data.exists) {
                            setRequestSent(true);
                            localStorage.setItem(`requestSent-${listingId}`, 'true');
                        }
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            };

            checkCallbackRequest();
        }
    }, [listing._id]);

    const handleMarkUnavailable = async () => {
        if (!user) {
            router.push('/users/login');
            return;
        }

        // Optimistically update UI
        setIsUnavailable(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/listings/ListingAvailability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ listingId: listing._id }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Handle a successful response here if needed
        } catch (error) {
            console.error('Error:', error);
            // Revert state if the request fails
            setIsUnavailable(false);
        }
    };

    useEffect(() => {
        const listingId = listing._id;
        // Check localStorage first
        const storedUnavailableState = localStorage.getItem(`unavailable-${listingId}`);

        if (storedUnavailableState === 'true') {
            setIsUnavailable(true);
        } else {
            const checkAvailability = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`/api/listings/ListingAvailability?listingId=${listingId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const { isAvailable } = await response.json();
                        const unavailable = !isAvailable;
                        setIsUnavailable(unavailable);
                        if (unavailable) {
                            localStorage.setItem(`unavailable-${listingId}`, 'true');
                        }
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            };

            checkAvailability();
        }
    }, [listing._id]);


    const handleReportAbuse = async () => {
        closeReportModal();
        if (!user) {
            router.push('/users/login');
            return;
        }

        setHasReportedAbuse(true); // Optimistically set report as submitted

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/listings/report-abuse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    listingId: listing._id,
                    reportContent: reportDescription
                }),
            });

            if (!response.ok) {
                setHasReportedAbuse(false);
                throw new Error('Network response was not ok');
            }


        } catch (error) {
            console.error('Error:', error);
            setHasReportedAbuse(false); // Revert if there's an error
        }
    };

    useEffect(() => {
        const listingId = listing._id;
        // Check localStorage first
        const storedReportState = localStorage.getItem(`reportedAbuse-${listingId}`);

        if (storedReportState === 'true') {
            setHasReportedAbuse(true);
        } else {
            const checkReportAbuse = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`/api/listings/report-abuse?listingId=${listingId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const { hasReported } = await response.json();
                        setHasReportedAbuse(hasReported);
                        if (hasReported) {
                            localStorage.setItem(`reportedAbuse-${listingId}`, 'true');
                        }
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            };

            checkReportAbuse();
        }
    }, [listing._id]);

    return (
        <>
            <Head>
                <title>{listing.productTitle} - ClassiConnect</title>
                <meta name="description" content={listing.description} />

                {/* Open Graph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`${baseUrl}/listings/${listing._id}`} />
                <meta property="og:title" content={listing.productTitle} />
                <meta property="og:description" content={listing.description} />
                <meta property="og:image" content={listing.imageUrl[0]} />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={`${baseUrl}/listings/${listing._id}`} />
                <meta property="twitter:title" content={listing.productTitle} />
                <meta property="twitter:description" content={listing.description} />
                <meta property="twitter:image" content={listing.imageUrl[0]} />

                {/* Additional tags as needed */}
            </Head>
            <Header />
            <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-white  rounded-lg">
                {/* Image Gallery */}
                <div className="flex flex-col md:flex-row -mx-4">
                    <div className="md:flex-1 px-4">
                        {/* Main Image Container */}
                        <div className="relative mb-4 cursor-pointer" onClick={() => setOpenLightbox(true)}>
                            {/* Overlay for image count */}
                            <div className="absolute top-0 left-0 m-2 bg-black bg-opacity-75 text-white py-1 px-3 rounded-full flex items-center z-10">
                                <FaCamera className="text-lg" />
                                <span className="text-sm ml-1">{`${currentIndex + 1}/${listing.imageUrl.length}`}</span>
                            </div>
                            {/* Overlay for views count */}
                            <div className="absolute bottom-0 right-0 m-2 bg-black bg-opacity-75 text-white py-1 px-3 rounded-full flex items-center z-10">
                                <FaEye className="text-lg" />
                                <span className="text-sm ml-1">{listing.impressions}</span>
                            </div>
                            <div className="relative w-full" style={{ height: '300px' }}>
                                <Image
                                    src={mainImageUrl}
                                    alt="Main Image"
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-lg"
                                />
                            </div>
                        </div>
                        {openLightbox && (
                            <Lightbox large={mainImageUrl} onClose={() => setOpenLightbox(false)} />
                        )}

                        {/* Thumbnail Strip */}
                        <div className="relative flex items-center mb-4 lg:max-w-lg lg:w-full">
                            {isOverflow && (
                                <button onClick={() => handleScroll('left')} className="absolute left-0 z-10 bg-white bg-opacity-50 rounded-full p-1">
                                    <FaChevronLeft />
                                </button>
                            )}
                            <div className="flex overflow-x-auto" ref={scrollRef}>
                                {listing.imageUrl.map((url, index) => (
                                    <div key={index} className="flex-shrink-0 mr-2" style={{ width: '50px', height: '50px', position: 'relative' }}>
                                        <Image
                                            src={url}
                                            alt={`Thumbnail ${index + 1}`}
                                            layout="fill"
                                            objectFit="cover"
                                            className="rounded-lg"
                                            onMouseEnter={() => handleThumbnailHover(url)}
                                        />
                                    </div>
                                ))}
                            </div>
                            {isOverflow && (
                                <button
                                    onClick={() => handleScroll('right')}
                                    className="absolute right-0 z-10 bg-white bg-opacity-50 rounded-full p-1"
                                    aria-label="Scroll right"
                                >
                                    <FaChevronRight />
                                </button>
                            )}
                        </div>
                        <div>
                            {/* Product Title and Description */}
                            <h1 className="text-xl sm:text-2xl font-bold mb-2 text-emerald-700">{listing.productTitle}</h1>
                            <p className="text-sm sm:text-gray-600 mb-4">{listing.description}</p>

                            {/* Details Section */}
                            <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
                                <h2 className="text-base sm:text-lg font-semibold mb-2 text-emerald-600">Details</h2>
                                <ul className="list-disc pl-5 text-xs sm:text-sm">
                                    <li className="mb-2">Price: {listing.price}</li>
                                    {/* Additional listing details */}
                                </ul>
                            </div>
                        </div>

                        <div className="rounded-lg bg-gray-200 h-64 mt-4 flex items-center justify-center">
                            <LoadScript
                                googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
                                onLoad={() => setIsMapLoaded(true)}
                                onError={() => console.error('Error loading Google Maps')}
                            >
                                {listing.location.productCoordinates && listing.location.productCoordinates.coordinates && isMapLoaded &&
                                    <GoogleMap
                                        mapContainerStyle={{ width: '100%', height: '100%' }}
                                        center={{
                                            lat: parseFloat(listing.location.productCoordinates.coordinates[1]), // Latitude
                                            lng: parseFloat(listing.location.productCoordinates.coordinates[0]) // Longitude
                                        }}
                                        zoom={15}
                                        options={{
                                            streetViewControl: false,
                                            scaleControl: false,
                                            mapTypeControl: false,
                                            panControl: false,
                                            zoomControl: false,
                                            rotateControl: false,
                                            fullscreenControl: false
                                        }}
                                    >
                                        <Marker
                                            position={{
                                                lat: parseFloat(listing.location.productCoordinates.coordinates[1]), // Latitude
                                                lng: parseFloat(listing.location.productCoordinates.coordinates[0]) // Longitude
                                            }}
                                            icon={{
                                                url: 'https://res.cloudinary.com/dx6jw8k0m/image/upload/v1699821203/nyumba/195492_psmryj.png',
                                                scaledSize: new window.google.maps.Size(30, 30)
                                            }}
                                        />
                                    </GoogleMap>
                                }
                            </LoadScript>
                        </div>
                    </div>
                    {/* Listing Details */}
                    <div className="md:flex-1 px-4">

                        <div className="bg-gray-100 p-4 sm:p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
                            {/* Price and Market Price Section */}
                            <div className="text-center">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">USD {listing.price}</h1>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">Market price: KSh 5.47 M - 6.2 M</p>
                                <button
                                    className={`mt-3 mb-2 ${requestSent ? 'bg-gray-500 hover:bg-gray-600 focus:ring-gray-500' : 'bg-green-500 hover:bg-green-600 focus:ring-green-500'} text-white text-xs sm:text-sm font-medium py-2 px-4 rounded-lg w-full transition duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                                    onClick={handleRequestCallback}
                                    disabled={requestSent}
                                >
                                    {requestSent ? 'Call back Requested' : 'Request call back'}
                                </button>


                            </div>

                            {/* Seller Information Section */}
                            <div className="flex flex-row items-center bg-white p-4 rounded-lg shadow-sm mt-4">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-green-500 mr-2">
                                    <Image
                                        src={listing.seller?.profileImage}
                                        alt="Profile Picture"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>


                                <div className="flex-1 min-w-0">
                                    <h2 className="text-sm font-semibold truncate">
                                        {`${listing.seller?.firstName} ${listing.seller?.lastName}`}
                                    </h2>
                                    <p className="mt-1">
                                        <span className="bg-green-100 text-green-600 text-xs inline-flex items-center py-1 px-3 rounded-full">
                                            <FaCheckCircle className="w-4 h-4 mr-1" />
                                            Verified ID
                                        </span>
                                    </p>
                                    <p className="text-gray-500 text-xs truncate">Typically replies within a few hours</p>
                                </div>
                            </div>


                            {/* Contact and Chat Buttons */}
                            <div className="mt-3 flex flex-col space-y-2">
                                <button
                                    className="bg-green-500 text-white text-xs sm:text-sm font-medium py-2 px-4 rounded-lg w-full flex items-center justify-center transition duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                                    <FaShoppingCart className="mr-2" />
                                    Make Purchase
                                </button>

                                <button onClick={openChat} className="bg-white text-green-600 border border-green-500 text-xs sm:text-sm font-medium py-2 px-4 rounded-lg w-full flex items-center justify-center transition duration-300 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ">
                                    <FaComments className="mr-2" />
                                    Start chat
                                </button>
                                {isChatOpen && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <div className="bg-white w-full max-w-lg mx-4 md:mx-auto p-6 rounded-lg shadow-lg">
                                            <div className="flex flex-col space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <h2 className="text-xl font-semibold">Chat with Seller</h2>
                                                    <div
                                                        className="rounded-full p-2 hover:bg-gray-200 cursor-pointer transition duration-300"
                                                        onClick={closeChat}
                                                    >
                                                        <FaTimes className="text-red-500" />
                                                    </div>
                                                </div>

                                                {/* Pinned Advisory Message */}
                                                <div className="bg-emerald-100 border-l-4 border-emerald-500 p-3 rounded">
                                                    <p className="text-sm text-emerald-700">
                                                        Reminder: Stay safe! Chat within this platform to avoid potential fraud. We cannot assist with disputes arising from external communications.
                                                    </p>
                                                </div>

                                                {/* Chat Messages */}
                                                <div className="w-full max-w-lg h-64 overflow-auto bg-gray-100 p-3 rounded">
                                                    {messages.map((msg) => (
                                                        <div key={msg.id} className={`text-sm p-2 rounded my-1 ${msg.sender === 'user' ? 'bg-emerald-100' : 'bg-gray-200'}`}>
                                                            <p>{msg.text}</p>
                                                            <span className="text-xs text-gray-500 block text-right">
                                                                {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Message Input */}
                                                <div className="flex">
                                                    <input
                                                        type="text"
                                                        value={newMessage}
                                                        onChange={(e) => setNewMessage(e.target.value)}
                                                        className={`flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none ${isInputFocused ? 'ring-2 ring-emerald-200' : ''}`}
                                                        placeholder="Type your message..."
                                                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                                        onFocus={() => setInputFocused(true)}
                                                        onBlur={() => setInputFocused(false)}
                                                    />
                                                    <button
                                                        onClick={handleSendMessage}
                                                        className={`bg-emerald-100 text-emerald-600 py-2 px-4 rounded-r-lg hover:bg-emerald-200 transition duration-300 flex items-center justify-center ${isInputFocused ? 'ring-2 ring-emerald-200' : ''}`}
                                                    >
                                                        <FaPaperPlane />
                                                    </button>
                                                </div>
                                                <div className=" md:text-right">
                                                    <button
                                                        className="border border-red-400 text-red-400 py-2 px-4 rounded hover:bg-red-50 transition duration-300 flex items-center justify-center w-fullsm:w-auto text-xs sm:text-sm whitespace-nowrap"
                                                        title="Start a dispute if you have significant issues with this transaction."
                                                    >
                                                        <FaGavel className="mr-2" /> Start a Dispute
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Feedback Section */}
                            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mt-4">
                                <div className="flex items-center">
                                    <div className="p-2 mr-2 bg-[#D9F9E5] rounded-full">
                                        <FaSms className="text-[#34D399]" />
                                    </div>
                                    <span className="text-gray-800 text-xs sm:text-sm font-medium">Feedback</span>
                                </div>
                                <button onClick={openFeedback} className="text-[#34D399] text-xs sm:text-sm font-medium hover:underline">
                                    view all
                                </button>
                            </div>

                            {isFeedbackOpen && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white w-full max-w-lg mx-4 md:mx-auto p-6 rounded-lg shadow-lg">
                                        {/* Modal Header */}
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-xl font-semibold">Feedback</h2>
                                            <div
                                                className="rounded-full p-2 hover:bg-gray-200 cursor-pointer transition duration-300"
                                                onClick={closeFeedback}
                                            >
                                                <FaTimes className="text-red-500" />
                                            </div>
                                        </div>

                                        {/* Feedback Messages */}
                                        <div className="mt-3 bg-emerald-100 border-l-4 border-emerald-500 p-3 rounded">
                                            <p className="text-sm text-emerald-700">
                                                See what others are saying about this seller.
                                            </p>
                                        </div>
                                        <div className="h-64 overflow-auto bg-gray-100 p-3 rounded">
                                            {isLoading ? (
                                                <div className="flex justify-center items-center h-full">
                                                    <FaSpinner className="animate-spin text-2xl text-emerald-500" />
                                                </div>
                                            ) : feedbacks.length > 0 ? (
                                                feedbacks.map(feedback => (
                                                    <div key={feedback.id} className="bg-gray-200 p-3 rounded my-2">
                                                        <p className="font-semibold">{feedback.username}</p>
                                                        <p>{feedback.text}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No feedbacks yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Safety Tips Section */}
                            <div className="mt-3 bg-white p-4 rounded-lg shadow-sm">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-800">Safety tips</h3>
                                <ul className="list-disc pl-4 text-xs sm:text-sm text-gray-600 mt-2">
                                    <li>Remember, don&apos;t send any pre-payments</li>
                                    <li>Meet the seller at a safe public place</li>
                                    {/* More safety tips here */}
                                </ul>
                            </div>


                            {/* Action Buttons */}
                            <div className="bg-white p-4 rounded-lg shadow-sm mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-between">
                                <button
                                    className={`flex items-center justify-center border border-gray-300 ${isUnavailable ? 'text-gray-500 bg-gray-100' : 'text-blue-600 hover:bg-blue-50'} py-2 px-4 rounded-md transition duration-300 focus:outline-none w-full sm:w-auto text-xs sm:text-sm whitespace-nowrap`}
                                    onClick={handleMarkUnavailable}
                                    disabled={isUnavailable}
                                >
                                    <FaBan className="mr-2" />
                                    {isUnavailable ? 'Marked Unavailable' : 'Mark Unavailable'}
                                </button>
                                <button
                                    className={`flex items-center justify-center border border-gray-300 ${hasReportedAbuse ? 'text-gray-500 bg-gray-100' : 'text-red-600 hover:bg-red-50'} py-2 px-4 rounded-md transition duration-300 focus:outline-none w-full sm:w-auto text-xs sm:text-sm whitespace-nowrap`}
                                    onClick={openReportModal}
                                    disabled={hasReportedAbuse}>
                                    <FaFlag className="mr-2" />
                                    {hasReportedAbuse ? 'Ad Reported' : 'Report Abuse'}
                                </button>



                            </div>
                            {isReportModalOpen && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white w-full max-w-lg mx-4 md:mx-auto p-6 rounded-lg shadow-lg">
                                        {/* Modal Header */}
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-xl font-semibold">Report Abuse</h2>
                                            <div
                                                className="rounded-full p-2 hover:bg-gray-200 cursor-pointer transition duration-300"
                                                onClick={closeReportModal}
                                            >
                                                <FaTimes className="text-red-500" />
                                            </div>
                                        </div>

                                        {/* Report Form */}
                                        <div className="mt-4">
                                        <textarea
    className="w-full p-2 border border-gray-300 rounded-md"
    rows="4"
    placeholder="Describe the issue"
    value={reportDescription}
    onChange={handleDescriptionChange}
></textarea>
<div id="wordCounter" className="text-right">{wordCount}/200</div>
                                            <button
                                                 onClick={handleReportAbuse}
                                                className="mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
                                            >
                                                Submit Report
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}



                            {/* Post Ad Button */}
                            <div className="bg-white p-4 rounded-lg shadow-sm mt-4">
                                <div className="border border-green-600 rounded-md transition duration-300 hover:bg-green-50 w-full sm:w-auto">
                                    <button
                                        className="text-green-600 py-2 px-4 w-full rounded-md transition duration-300 hover:bg-green-50 focus:outline-none text-xs sm:text-sm whitespace-nowrap"
                                        onClick={handlePostAdClick} >
                                        Post Ad Like This
                                    </button>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default ListingPage;
