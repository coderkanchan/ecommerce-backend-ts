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

  const handleSearch = () => {
    if (!query.trim() || loading) return;

    const userMessage = query;

    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);

    dispatch(askNexusAssistant({ userQuery: userMessage, products }))
      .unwrap()
      .then((res) => {

        if (res.action === "add_to_cart") {

          const normalize = (str: string) =>
            str.toLowerCase().trim();

          const product = products.find(
            p => normalize(p.name) === normalize(res.productName)
          );
          if (!product) {
            setMessages(prev => [...prev, {
              text: "❌ AI mismatch. Please try again.",
              sender: 'ai'
            }]);
            return;
          }

          console.log("AI product:", res.productName);
          console.log("Matched product:", product);

          if (product) {
            const productWithQty = {
              ...product,
              qty: 1
            };

            dispatch(addToCart(productWithQty));

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
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <button
            onClick={async () => {
              await fetch("http://localhost:5000/api/chat/demoUser", { method: "DELETE" });
              setMessages([]);
            }}
            className="text-xs bg-red-500 text-white px-2 py-1 m-2 rounded"
          >
            Clear Chat
          </button>

          <div className="h-80 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, index) => (
              <div key={index}
                className={`p-2 rounded-lg text-sm max-w-[80%] ${msg.sender === 'user'
                  ? 'self-end bg-blue-600 text-white'
                  : 'self-start bg-gray-200 text-black'
                  }`}>
                {msg.text}
              </div>
            ))}
            <div ref={bottomRef}></div>
          </div>

          <div className="p-4 bg-white border-t flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 bg-gray-100 rounded-lg border border-gray-500 outline-none focus:ring focus:ring-blue-700 focus:border-none text-sm text-gray-500"
              value={query}
              placeholder='Ask anything'
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