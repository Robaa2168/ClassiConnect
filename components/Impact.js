// components/Impact.js

import React, { useState } from 'react';
import { FiHeart, FiMessageCircle, FiShare } from 'react-icons/fi';

function Impact({ imageUrl, impactTitle, description, id, likes, comments, shares }) {
    const [likesCount, setLikesCount] = useState(likes);
    const [commentCount, setCommentCount] = useState(comments);
    const [shareCount, setShareCount] = useState(shares);

    const handleLike = () => {
        // Implement like functionality here
        setLikesCount(prevLikesCount => prevLikesCount + 1);
    };

    const handleShare = () => {
        // Implement share functionality here
        setShareCount(prevShareCount => prevShareCount + 1);
    };

    const handleComment = () => {
        // Implement comment functionality here
        setCommentCount(prevCommentCount => prevCommentCount + 1);
    };

    return (
        <div className="flex flex-col border-2 border-emerald-200 rounded-lg overflow-hidden shadow-md relative group h-full">
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={`Image of ${impactTitle}`}
                    className="object-cover w-full h-64" // Adjust width and height as needed
                />
            )}
            <div className="p-4 flex flex-col justify-between h-full">
                <h3 className="font-semibold text-lg mb-4 truncate">{impactTitle}</h3>
                <p className="text-gray-600 mb-4 truncate">{description}</p>

                <div className="flex space-x-4 justify-end">
                    <button className="flex items-center space-x-1" onClick={handleLike} aria-label="Like">
                        <FiHeart className="text-red-500" />
                        <span>{likesCount}</span>
                    </button>
                    <button className="flex items-center space-x-1" onClick={handleComment} aria-label="Comments">
                        <FiMessageCircle className="text-gray-500" />
                        <span>{commentCount}</span>
                    </button>
                    <button className="flex items-center space-x-1" onClick={handleShare} aria-label="Share">
                        <FiShare className="text-gray-500" />
                        <span>{shareCount}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Impact;
