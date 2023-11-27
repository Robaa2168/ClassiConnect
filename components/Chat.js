// components/Chat.js
import React, { useState, useEffect } from 'react';
import { FaTimes, FaPaperPlane, FaExclamationTriangle, FaGavel, FaSpinner } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';

const Chat = ({ isOpen, closeChat, listing }) => {
    const { user } = useAuth();
    const [isInputFocused, setInputFocused] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchChatMessages();
        }
    }, [isOpen, listing._id]);

    const fetchChatMessages = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/chat/get-messages?listingId=${listing._id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch messages');
            }
    
            const fetchedMessages = await response.json();
            const formattedMessages = fetchedMessages.map(msg => ({
                id: msg._id,
                sender: msg.sender === user?._id ? 'user' : 'seller',
                text: msg.message,
                timestamp: new Date(msg.createdAt),
                isSending: false,
                sendFailed: false,
            }));
            setMessages(formattedMessages);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };
    

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        const userId = user?._id; // Assuming you have the user's ID
        const temporaryMessage = {
            id: Date.now(), // Temporary identifier
            sender: 'user',
            text: newMessage,
            timestamp: new Date(),
            isSending: true, // Flag to indicate sending status
        };

        setMessages(messages => [...messages, temporaryMessage]);
        setNewMessage('');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/chat/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    message: newMessage,
                    receiver: listing.seller,
                    listingId: listing._id
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const sentMessage = await response.json();

            // Transform the message into the expected format
            const formattedMessage = {
                id: sentMessage._id,
                sender: sentMessage.sender === userId ? 'user' : 'seller',
                text: sentMessage.message,
                timestamp: new Date(sentMessage.createdAt)
            };

            // Replace the temporary message with the actual message from the server
            setMessages(messages =>
                messages.map(msg =>
                    msg.id === temporaryMessage.id ? formattedMessage : msg
                )
            );
        } catch (error) {
            console.error('Error:', error);
            // Mark the temporary message as failed to send
            setMessages(messages =>
                messages.map(msg =>
                    msg.id === temporaryMessage.id ? { ...msg, isSending: false, sendFailed: true } : msg
                )
            );
        }
    };

    const retrySendMessage = async (messageToRetry) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/chat/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    message: messageToRetry.text,
                    receiver: listing.seller,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to resend message');
            }

            const sentMessage = await response.json();

            // Transform the message into the expected format
            const formattedMessage = {
                id: sentMessage._id,
                sender: sentMessage.sender === user?._id ? 'user' : 'seller',
                text: sentMessage.message,
                timestamp: new Date(sentMessage.createdAt)
            };

            // Replace the failed message with the successfully resent message
            setMessages(messages =>
                messages.map(msg =>
                    msg.id === messageToRetry.id ? formattedMessage : msg
                )
            );
        } catch (error) {
            console.error('Error:', error);
            // If the retry fails, keep the failed state
            setMessages(messages =>
                messages.map(msg =>
                    msg.id === messageToRetry.id ? { ...msg, sendFailed: true } : msg
                )
            );
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  {isOpen && (
    <div className="bg-white w-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-2xl mx-4 sm:mx-auto p-6 rounded-lg shadow-lg">
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
          <p className="text-xs text-emerald-700">
            Reminder: Stay safe! Chat within this platform to avoid potential fraud. We cannot assist with disputes arising from external communications.
          </p>
        </div>

        {/* Chat Messages */}
        <div className="w-full max-h-72 xs:max-h-96 sm:max-h-full lg:max-h-80 overflow-auto bg-gray-100 p-3 rounded">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <FaSpinner className="animate-spin text-2xl text-emerald-500" />
            </div>
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`text-xs p-2 rounded my-1 ${msg.sender === 'user' ? 'bg-emerald-100' : 'bg-gray-200'}`}
              >
                <p>{msg.text}</p>
                {msg.isSending && <span className="text-xs text-gray-500">Sending...</span>}
                {msg.sendFailed && (
                  <div className="flex items-center text-xs text-red-500">
                    <FaExclamationTriangle className="mr-1" />
                    <button onClick={() => retrySendMessage(msg)} className="underline">Retry</button>
                  </div>
                )}
                <span className="text-xs text-gray-500 block text-right">
                  {formatDistanceToNow(msg.timestamp, { addSuffix: true })}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">
              Start a conversation with the seller.
            </div>
          )}
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
            className={`bg-emerald-100 text-emerald-600 py-2 px-4 rounded-r-lg hover:bg-emerald-200 transition duration-300 flex items-center justify-center ${isInputFocused ? 'ring-2 ring-emerald-200' : ''} max-w-1/4 sm:w-auto`}
          >
            <FaPaperPlane />
          </button>
        </div>
        <div className="text-right">
          <button
            className="border border-red-400 text-red-400 py-2 px-4 rounded hover:bg-red-50 transition duration-300 flex items-center justify-center w-full sm:w-auto text-xs sm:text-sm whitespace-nowrap"
            title="Start a dispute if you have significant issues with this transaction."
          >
            <FaGavel className="mr-2" /> Start a Dispute
          </button>
        </div>
      </div>
    </div>
  )}
</div>

    );
};

export default Chat;
