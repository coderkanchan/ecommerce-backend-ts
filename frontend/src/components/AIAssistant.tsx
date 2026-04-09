"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { askNexusAssistant } from '../redux/slices/aiSlice';
import { RootState, AppDispatch } from '../redux/store';
import { MessageCircle, X, Send, Sparkles, Maximize2, Minimize2 } from 'lucide-react';
import { addToCart } from '../redux/slices/cartSlice';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'ai' }[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.ai);
  const products = useSelector((state: RootState) => state.products.products);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = () => {
    if (!query.trim() || loading) return;

    const userMessage = query;

    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);

    dispatch(askNexusAssistant({ userQuery: userMessage, products }))
      .unwrap()
      .then((res) => {

        if (res.action === "add_to_cart") {

          const product = products.find(
            p => p.name === res.productName
          );

          if (!product) {
            setMessages(prev => [...prev, {
              text: "❌ AI mismatch. Please try again.",
              sender: 'ai'
            }]);
            return;
          }

          dispatch(addToCart({ ...product, qty: 1 }));

          setMessages(prev => [...prev, {
            text: `${product.name} added to cart 🛒`,
            sender: 'ai'
          }]);
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
            text: res.message || "🤖 No response",
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
        <div className={`mb-4 
          ${isExpanded ? "w-[90vw] h-[80vh]" : "w-80 sm:w-96 h-[500px]"} 
          bg-white rounded-2xl shadow-2xl border flex flex-col transition-all duration-300`}>

          <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={20} />
              <span className="font-semibold">Nexus Smart Assistant</span>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setIsExpanded(prev => !prev)}>
                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>
          </div>

          <button
            onClick={async () => {
              await fetch("http://localhost:5000/api/chat/demoUser", { method: "DELETE" });
              setMessages([]);
            }}
            className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 m-2 rounded w-fit"
          >
            Clear Chat
          </button>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-100 flex flex-col gap-3">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg text-sm max-w-[80%] ${msg.sender === 'user'
                  ? 'self-end bg-blue-600 text-white'
                  : 'self-start bg-gray-300 text-gray-900'
                  }`}
              >
                {msg.text}
              </div>
            ))}

            <div ref={bottomRef}></div>
          </div>

          <div className="p-4 bg-white border-t flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 text-gray-600 focus:border-2 focus:border-blue-500 bg-gray-100 rounded-lg border border-gray-400 outline-none text-sm"
              value={query}
              placeholder='Ask anything...'
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch} className='text-blue-700'>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default AIAssistant;