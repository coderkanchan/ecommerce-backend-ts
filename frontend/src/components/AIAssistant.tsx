import React, { useState } from 'react';
import axios from 'axios';

const AIAssistant = ({ products }: { products: any[] }) => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/ai/ask-assistant', {
        userQuery: query,
        products: products 
      });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error("AI Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50 shadow-md">
      <h3 className="text-lg font-bold mb-2">NexusMart Smart Assistant ✨</h3>
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Mujhe party ke liye black watch chahiye..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={askAI}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Thinking...' : 'Ask AI'}
      </button>

      {answer && (
        <div className="mt-4 p-3 bg-white border-l-4 border-blue-500 italic">
          {answer}
        </div>
      )}
    </div>
  );
};

export default AIAssistant;