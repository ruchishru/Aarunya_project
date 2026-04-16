import React, { useState, useEffect, useRef } from 'react';
import { useSupport } from '../context/SupportContext';

const SupportChat = ({ ticketId, onClose }) => {
  const { chatHistory, sendMessage, loading } = useSupport();
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  const quickQueries = [
    { label: "💳 Payment Failed", value: "My payment failed but money was deducted.", priority: "High" },
    { label: "📅 Cancel Appointment", value: "I want to cancel my appointment and get a refund.", priority: "High" },
    { label: "💊 Medical Advice", value: "I need health related help. Who should I contact?", priority: "Medium" },
    { label: "⚙️ Technical Issue", value: "The app is not loading my profile data.", priority: "Medium" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [chatHistory, isOpen]);

  const handleSendMessage = async (msgText) => {
    const textToSend = typeof msgText === 'string' ? msgText : message;
    if (!textToSend.trim()) return;

    setIsTyping(true);
    await sendMessage(ticketId, textToSend);
    setIsTyping(false);
    setMessage('');
  };

  // 1. THE FLOATING BUTTON (The "Closed" State)
  if (!isOpen) {
    return (
      <div
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-2xl cursor-pointer flex items-center justify-center hover:scale-110 transition-all z-50 animate-bounce"
        title="Open Magic Box Support"
      >
        <span className="text-3xl">🎁</span>
      </div>
    );
  }

  // 2. THE FLOATING WINDOW (The "Open" State)
  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-indigo-100 overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <div>
            <h3 className="font-bold text-sm">Magic Box AI Agent</h3>
            <p className="text-[10px] opacity-80">Online & Ready to Help</p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-700 p-1 rounded-full transition">
          <span className="text-xl text-white">✕</span>
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {chatHistory.map((chat, idx) => (
          <div key={idx} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${chat.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
              }`}>
              <p>{chat.message}</p>
            </div>
          </div>
        ))}

        {chatHistory.length < 2 && (
          <div className="grid grid-cols-1 gap-2 mt-2">
            <p className="text-xs text-gray-500 font-medium ml-1">Common Queries:</p>
            {quickQueries.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q.value)}
                className="text-left text-xs p-2 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors text-indigo-700 font-medium shadow-sm"
              >
                {q.label}
              </button>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-4 bg-white border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your issue..."
            className="flex-1 p-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
          >
            ➤
          </button>
        </div>
      </form>
    </div>
  );
};

export default SupportChat;