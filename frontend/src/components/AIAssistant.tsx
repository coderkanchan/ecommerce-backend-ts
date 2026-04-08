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
  const [isTyping, setIsTyping] = useState(false);
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

          typeMessage(`${product.name} added to cart 🛒`);
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

  const typeMessage = (text: string) => {
    let index = 0;
    let currentText = "";

    setIsTyping(true);

    const interval = setInterval(() => {
      if (index < text.length) {
        currentText += text[index];
        index++;

        setMessages(prev => {
          const last = prev[prev.length - 1];

          if (last && last.sender === 'ai') {
            return [
              ...prev.slice(0, -1),
              { text: currentText, sender: 'ai' }
            ];
          }

          return [...prev, { text: currentText, sender: 'ai' }];
        });

      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 20);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div
          className={`bg-white shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300
          ${isExpanded
              ? 'fixed inset-0 w-full h-full rounded-none'
              : 'mb-4 w-80 sm:w-96 rounded-2xl'
            }`}
        >

          <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={20} />
              <span className="font-semibold">Nexus Smart Assistant</span>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
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
            className="text-xs bg-red-500 text-white px-2 py-1 m-2 rounded"
          >
            Clear Chat
          </button>

          <div
            className={`overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3
            ${isExpanded ? 'h-[calc(100vh-140px)]' : 'h-80'}
          `}
          >
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
            <div ref={bottomRef}></div>
          </div>

          <div
            className={`p-4 bg-white border-t flex gap-2
            ${isExpanded ? 'sticky bottom-0' : ''}
          `}
          >
            <input
              type="text"
              className="flex-1 p-2 bg-gray-100 rounded-lg border border-gray-300 outline-none focus:ring focus:ring-blue-500 text-sm"
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