"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { askNexusAssistant } from '../redux/slices/aiSlice';
import { RootState, AppDispatch } from '../redux/store';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { addToCart } from '../redux/slices/cartSlice';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'ai' }[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.ai);
  const products = useSelector((state: RootState) => state.products.products);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  
  if (!products || products.length === 0) {
    setMessages(prev => [...prev, {
      text: "Products loading ho rahe hain... thoda wait karo 😅",
      sender: "ai"
    }]);
    return;
  }
  const handleSearch = () => {
    if (query.trim() && !loading) {

      const userMessage = query;

      setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);

      dispatch(askNexusAssistant({ userQuery: userMessage, products }))
        .unwrap()
        .then((res) => {

          console.log("AI Response:", res);
          console.log("Available products:", products);
          if (res.action === "add_to_cart") {
            const aiName = res.productName.toLowerCase();

            const product = products.find(p =>
              p.name.toLowerCase().includes(aiName)
            );

            if (product) {
              dispatch(addToCart(product));

              setMessages(prev => [...prev, {
                text: `${product.name} added to cart 🛒`,
                sender: 'ai'
              }]);
            } else {
              const suggestions = products.slice(0, 2);

              setMessages(prev => [...prev, {
                text: `Product not found 😅\nTry: ${suggestions.map(p => p.name).join(", ")}`,
                sender: 'ai'
              }]);
            }
          }

          else if (res.action === "not_found") {
            const suggestions = res.suggestions?.length
              ? res.suggestions
              : products.slice(0, 2).map(p => p.name);

            setMessages(prev => [...prev, {
              text: `${res.message}\nTry: ${suggestions.join(", ")}`,
              sender: 'ai'
            }]);
          }

          else {
            setMessages(prev => [...prev, {
              text: res.message || res.answer || "🤖 No response",
              sender: 'ai'
            }]);
          }

        })
        .catch(() => {
          setMessages(prev => [...prev, {
            text: "Something went wrong 😅",
            sender: 'ai'
          }]);
        });

      setQuery('');
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/chat/demoUser")
      .then(res => res.json())
      .then(data => {
        if (data.messages) {
          setMessages(data.messages.map((m: any) => ({
            text: m.content,
            sender: m.role
          })));
        }
      })
      .catch(() => {
        console.log("No previous chat");
      });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

          <button
            onClick={async () => {
              await fetch("http://localhost:5000/api/chat/demoUser", {
                method: "DELETE",
              });
              setMessages([]);
            }}
            className="text-xs bg-red-500 text-white px-2 py-1 m-2 rounded"
          >
            Clear Chat
          </button>

          <div className="h-80 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">

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

            <div ref={bottomRef}></div>
          </div>

          <div className="p-4 bg-white border-t flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 bg-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
              placeholder="Puchiye..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className={`p-2 rounded-lg ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
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