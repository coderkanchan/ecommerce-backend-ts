"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { askNexusAssistant } from '../redux/slices/aiSlice';
import { RootState, AppDispatch } from '../redux/store';
import {
  MessageCircle, X, Send, Sparkles,
  Maximize2, Minimize2, Mic
} from 'lucide-react';
import { addToCart } from '../redux/slices/cartSlice';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.ai);
  const products = useSelector((state: RootState) => state.products.products);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  
  const handleVoice = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = (event: any) => {
      setQuery(event.results[0][0].transcript);
    };
  };

  const getContext = () => {
    return messages.slice(-5).map(m => `${m.sender}: ${m.text}`).join("\n");
  };

  const handleSearch = () => {
    if (!query.trim() || loading) return;

    const userMessage = query;

    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setIsTyping(true);

    dispatch(askNexusAssistant({
      userQuery: getContext() + "\nUser: " + userMessage,
      products
    }))
      .unwrap()
      .then((res) => {

        setIsTyping(false);

        let reply = "";

        if (res.action === "add_to_cart") {
          const product = products.find(
            p => p.name.toLowerCase().trim() === res.productName.toLowerCase().trim()
          );

          if (product) {
            dispatch(addToCart({ ...product, qty: 1 }));
            reply = `${product.name} added to cart 🛒`;
          } else {
            reply = "❌ AI mismatch. Please try again.";
          }
        }

        else if (res.action === "not_found") {
          const suggestions = res.suggestions?.join(", ");
          reply = `${res.message}\nTry: ${suggestions}`;
        }

        else {
          reply = res.message || "🤖 No response";
        }

        let i = 0;
        let current = "";

        const interval = setInterval(() => {
          current += reply[i];
          i++;

          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.sender === 'ai-stream') {
              return [...prev.slice(0, -1), { text: current, sender: 'ai-stream' }];
            }
            return [...prev, { text: current, sender: 'ai-stream' }];
          });

          if (i >= reply.length) {
            clearInterval(interval);

            setMessages(prev => {
              const last = prev[prev.length - 1];
              if (last?.sender === 'ai-stream') {
                return [...prev.slice(0, -1), { text: reply, sender: 'ai' }];
              }
              return prev;
            });
          }
        }, 15);

      })
      .catch(() => {
        setIsTyping(false);
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
      });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

      {isOpen && (
        <div className={`mb-4 bg-white rounded-2xl shadow-2xl border overflow-hidden transition-all duration-300
        ${isExpanded ? 'w-[500px] h-[600px]' : 'w-80 sm:w-96'}`}>

          <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles size={20} />
              <span>Nexus Smart Assistant</span>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button onClick={() => setIsOpen(false)}>
                <X size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3 h-[350px]">
            {messages.map((msg, index) => (
              <div key={index}
                className={`p-2 rounded-lg text-sm max-w-[80%] ${msg.sender === 'user'
                    ? 'self-end bg-blue-600 text-white'
                    : 'self-start bg-gray-200'
                  }`}>
                {msg.text}
              </div>
            ))}

            {isTyping && (
              <div className="text-gray-400 text-sm">AI typing...</div>
            )}

            <div ref={bottomRef}></div>
          </div>

          <div className="p-4 flex gap-2 border-t">
            <button onClick={handleVoice}>
              <Mic size={20} />
            </button>

            <input
              className="flex-1 p-2 bg-gray-100 rounded-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ask anything..."
            />

            <button onClick={handleSearch}>
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