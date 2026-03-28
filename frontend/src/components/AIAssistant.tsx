"use client";
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { askNexusAssistant } from '../redux/slices/aiSlice';
import { RootState, AppDispatch } from '../redux/store';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const { answer, loading } = useSelector((state: RootState) => state.ai);

  const products = useSelector((state: RootState) => state.products.products);
  
  const handleSearch = () => {
    if (query.trim()) {
      dispatch(askNexusAssistant({ query, products }));
      setQuery('');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 ease-in-out">

          <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={20} />
              <span className="font-semibold">Nexus Smart Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
              <X size={20} />
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 bg-gray-50">
            {answer ? (
              <div className="bg-blue-100 text-gray-800 p-3 rounded-lg rounded-tl-none border border-blue-200 text-sm">
                {answer}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center mt-10">
                Hi! Main aapki shopping mein kaise madad kar sakta hoon?
              </p>
            )}

            {loading && (
              <div className="flex items-center gap-2 mt-4 text-blue-600 animate-pulse">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-xs font-medium">Nexus is thinking...</span>
              </div>
            )}
          </div>

          <div className="p-4 bg-white border-t flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 bg-gray-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
              placeholder="Type your message..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-red-500 rotate-90' : 'bg-blue-600 hover:scale-110'
          } text-white p-4 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center`}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

    </div>
  );
};

export default AIAssistant;