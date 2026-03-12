import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { askNexusAssistant } from '../redux/slices/aiSlice';
import { RootState, AppDispatch } from '../redux/store';

const AIAssistant = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const { answer, loading } = useSelector((state: RootState) => state.ai);
  const { products } = useSelector((state: RootState) => state.products); 

  const handleSearch = () => {
    if (query.trim()) {
      dispatch(askNexusAssistant({ query, products }));
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        <span className="animate-pulse">✨</span> Nexus Assistant
      </h2>

      <div className="mt-4 flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Ask me: What's the best watch?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
          disabled={loading}
        >
          Ask
        </button>
      </div>

      {loading && (
        <div className="mt-4 flex items-center gap-3 text-blue-600">
          <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          <span className="text-sm font-medium">NexusMart AI is thinking...</span>
        </div>
      )}

      {answer && !loading && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg text-gray-700 text-sm leading-relaxed border-l-4 border-blue-400">
          {answer}
        </div>
      )}
    </div>
  );
};