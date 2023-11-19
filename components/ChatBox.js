import React, { useState } from 'react';

const ChatBox = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const sendMessage = () => {
        if(input.trim() !== '') {
            setMessages([...messages, input]);
            setInput('');
        }
    };

    return (
        <div className="chat-box">
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index}>{message}</div>
                ))}
            </div>
            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatBox;
