"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { askNexusAssistant } from '../redux/slices/aiSlice';
import { RootState, AppDispatch } from '../redux/store';
import { MessageCircle, X, Send, Sparkles, Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nexus_chat_open') === 'true';
    }
    return false;
  });

  const [messages, setMessages] = useState<{ text: string, sender: 'user' | 'ai' }[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nexus_chat_history');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.ai);
  const products = useSelector((state: RootState) => state.products.products);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    localStorage.setItem('nexus_chat_history', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('nexus_chat_open', isOpen.toString());
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const streamText = async (text: string) => {
    setMessages(prev => [...prev, { text: "", sender: 'ai' }]);
    let current = "";
    for (let i = 0; i < text.length; i++) {
      current += text[i];
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].text = current;
        return updated;
      });
      await new Promise(res => setTimeout(res, 10));
    }
  };

  const handleSearch = async () => {
    if (!query.trim() || loading) return;

    const userMessage = query;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setQuery('');

    try {
      const res = await dispatch(askNexusAssistant({ userQuery: userMessage })).unwrap();

      console.log("AI Response:", res);

      if (res.action === "add_to_cart") {
        const product = products.find(p => {
          const dbName = p.name.toLowerCase().replace(/\s+/g, '');
          const aiName = res.productName.toLowerCase().replace(/\s+/g, '');
          return dbName.includes(aiName) || aiName.includes(dbName);
        });

        if (product) {
          dispatch(addToCart({ ...product, qty: 1 }));
          toast.success(`${product.name} added to cart!`);
          await streamText(`Bilkul! Maine ${product.name} aapke cart mein add kar diya hai. 🛒`);
        } else {
          await streamText(res.message || `I found the product, but it seems I can't find that exact version in our store right now.`);
        }
      }
      else {
        await streamText(res.message || "How else can I help you?");
      }
    } catch (err) {
      setMessages(prev => [...prev, { text: "Connection error. Please ensure you are logged in and try again.", sender: 'ai' }]);
    }
  };

  const handleClearChat = async () => {
    const token = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo')!).token
      : null;

    try {
      if (token) {
        await fetch(`${API_BASE_URL}/api/chat/my-history`, {
          method: "DELETE",
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      setMessages([]);
      localStorage.removeItem('nexus_chat_history');
    } catch (error) {
      console.error("Clear chat failed");
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className={`${isExpanded ? "w-[90vw] h-[80vh]" : "w-80 sm:w-96 h-125"} bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-[width,height] duration-300 ease-in-out`}>

          <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Sparkles size={18} className="text-yellow-300" />
              <span className="font-semibold text-sm">Nexus AI Assistant</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setIsExpanded(!isExpanded)} className="hover:bg-blue-700 p-1 rounded transition-colors">
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-500">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-10 text-sm italic">
                How can I help you with your shopping today?
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`p-3 rounded-2xl text-sm max-w-[85%] shadow-sm animate-in fade-in duration-300 ${msg.sender === 'user'
                ? 'self-end bg-blue-600 text-white rounded-tr-none'
                : 'self-start bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                }`}>
                {msg.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t bg-white">
            <div className="flex justify-between mb-2">
              <button onClick={handleClearChat} className="text-[10px] flex items-center gap-1 text-red-500 hover:underline font-medium border border-red-300 ">
                <Trash2 size={12} /> Clear Chat
              </button>
            </div>
            <div className="flex gap-2">
              <input
                disabled={loading}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 p-2 bg-gray-100 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 transition-all"
                placeholder={loading ? "AI is thinking..." : "Ask about products..."}
              />
              <button
                disabled={loading || !query.trim()}
                onClick={handleSearch}
                className="bg-blue-600 text-white p-2 rounded-xl disabled:bg-gray-300 hover:bg-blue-700 transition-all active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white h-14 w-14 rounded-full shadow-lg hover:w-40 transition-all duration-300 flex items-center justify-center overflow-hidden group relative"
        >
          <div className="flex items-center justify-center w-full px-4">
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium absolute left-6">
              Chat with AI
            </span>
            <MessageCircle size={24} className="absolute right-4" />
          </div>
        </button>
      )}
    </div>
  );
};

export default AIAssistant;