"use client";
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { askNexusAssistant } from '../redux/slices/aiSlice';
import { RootState, AppDispatch } from '../redux/store';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'ai' }[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const { answer, loading } = useSelector((state: RootState) => state.ai);

  const products = useSelector((state: RootState) => state.products.products);

  const handleSearch = () => {
    if (query.trim() && !loading) {

      setMessages(prev => [...prev, { text: query, sender: 'user' }]);

      dispatch(askNexusAssistant({ userQuery: query, products }))
        .unwrap()
        .then((res) => {
          setMessages(prev => [...prev, { text: res, sender: 'ai' }]);
        });

      setQuery('');
    }
  };
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300">

          <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={20} />
              <span className="font-semibold">Nexus Smart Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
              <X size={20} />
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
            {loading && (
              <div className="self-end bg-blue-600 text-white p-2 rounded-lg text-sm max-w-[80%]">
                Processing your request...
              </div>
            )}

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg text-sm max-w-[80%] ${msg.sender === 'user'
                    ? 'self-end bg-blue-600 text-white'
                    : 'self-start bg-gray-200 text-black'
                  }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-blue-600 animate-pulse bg-blue-50 p-2 rounded-lg w-fit">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
                <span className="text-xs font-medium">Nexus is thinking...</span>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
              placeholder="Puchiye..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className={`p-2 rounded-lg transition-colors ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
              disabled={loading}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-red-500 rotate-90' : 'bg-blue-600 hover:scale-110'} text-white p-4 rounded-full shadow-xl transition-all duration-300`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default AIAssistant;
