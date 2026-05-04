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
  const [lastSuggestedProduct, setLastSuggestedProduct] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.ai);
  const products = useSelector((state: RootState) => state.products.products);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const streamText = async (text: string) => {
    let current = "";

    for (let i = 0; i < text.length; i++) {
      current += text[i];

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          text: current,
          sender: 'ai'
        };
        return updated;
      });

      await new Promise(res => setTimeout(res, 15));
    }
  };

  const handleSearch = async () => {
    if (!query.trim() || loading) return;

    const userMessage = query;

    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);

    try {
      const res = await dispatch(
        askNexusAssistant({ userQuery: userMessage })
      ).unwrap();

      if (res.action === "add_to_cart") {
        const product = products.find(p => p.name === res.productName);

        if (product) {
          dispatch(addToCart({ ...product, qty: 1 }));

          setMessages(prev => [...prev, {
            text: `${product.name} added to cart 🛒`,
            sender: 'ai'
          }]);

          setLastSuggestedProduct(null);
        } else {
          setMessages(prev => [...prev, {
            text: "❌ Product not found",
            sender: 'ai'
          }]);
        }
      }

      else if (res.action === "not_found") {
        setMessages(prev => [...prev, { text: "", sender: 'ai' }]);
        await streamText(res.message);
      }

      else {
        setMessages(prev => [...prev, { text: "", sender: 'ai' }]);
        await streamText(res.message);

        const foundProduct = products.find(p =>
          res.message?.toLowerCase().includes(p.name.toLowerCase().slice(0, 5))
        );

        if (foundProduct) {
          setLastSuggestedProduct(foundProduct.name);
        }
      }

    } catch (err) {
      setMessages(prev => [...prev, {
        text: "Something went wrong 😅",
        sender: 'ai'
      }]);
    }

    setQuery('');
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/chat/demoUser")
      .then(res => res.json())
      .then(data => {
        if (data.messages) {
          setMessages(data.messages.map((m: any) => ({
            text: m.content,
            sender: m.role === "ai" ? "ai" : "user"
          })));
        }
      });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

      {isOpen && (
        <div className={`${isExpanded ? "w-[90vw] h-[80vh]" : "w-80 sm:w-96 h-125"}
          bg-blue-100 rounded-2xl shadow-2xl border flex flex-col`}>

          <div className="bg-blue-600 rounded-t-2xl p-4 text-white flex justify-between">
            <div className="flex gap-2 items-center">
              <Sparkles size={20} />
              <span>Nexus Assistant</span>
            </div>

            <div className="flex gap-2">
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
            className="max-w-20 text-xs bg-red-500 text-white px-2 py-1 m-2 rounded"
          >
            Clear Chat
          </button>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            {messages.map((msg, i) => (
              <div key={i}
                className={`p-2 rounded-lg max-w-[80%] ${msg.sender === 'user'
                  ? 'self-end bg-blue-600 text-white'
                  : 'self-start bg-gray-200 text-gray-800'
                  }`}>
                {msg.text}
              </div>
            ))}
            <div ref={bottomRef}></div>
          </div>

          <div className="p-3 flex gap-2 border-t bg-gray-100">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 p-2 border-2 border-gray-400 rounded-lg outline-none focus:border-blue-500 text-gray-600"
              placeholder="Ask anything..."
            />
            <button onClick={handleSearch} className='text-blue-500'>
              <Send size={30} />
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