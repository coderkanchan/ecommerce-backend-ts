"use client";
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Clock } from 'lucide-react';
import API from '@/services/api';
import { SEARCH_CATEGORIES } from '@/constants/categoryData';

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const suggestionRef = useRef<HTMLDivElement>(null);

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const currentCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (keyword.trim()) {
        router.push(`/?keyword=${keyword}${currentCategory !== 'All' ? `&category=${currentCategory}` : ''}`);
      } else if (keyword === "" && searchParams.get('keyword')) {
        router.push(currentCategory !== 'All' ? `/?category=${currentCategory}` : '/');
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [keyword, currentCategory, router, searchParams]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (keyword.length > 0) {
        try {
          const { data } = await API.get(`/products/all?keyword=${keyword}&limit=6`);
          setSuggestions(data.products);
          setShowSuggestions(true);
        } catch (err) {
          console.error("Suggestions fetch error:", err);
        }
      } else {
        setShowSuggestions(false);
      }
    };
    fetchSuggestions();
  }, [keyword]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative flex-1 max-w-lg" ref={suggestionRef}>
      <form onSubmit={(e) => e.preventDefault()} className="flex items-center border border-blue-500 rounded-xl overflow-hidden bg-white shadow-sm">
        <select
          className="bg-gray-100 text-gray-700 text-sm px-2 outline-none h-10 border-r border-blue-500"
          value={currentCategory}
          onChange={(e) => router.push(e.target.value === 'All' ? '/' : `/?category=${e.target.value}`)}
        >
          {SEARCH_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <div className='w-full flex items-center'>
          <input
            type="text"
            autoComplete="off" 
            id="product-search"
            value={keyword}
            onFocus={() => keyword.length > 1 && setShowSuggestions(true)}
            onChange={(e) => setKeyword(e.target.value)}
            className="px-4 w-full text-black outline-none h-10 text-sm py-2"
            placeholder="Search NexusMart..."
          />
          <div className="p-2 text-blue-600"><Search size={20} /></div>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-2xl rounded-b-xl z-999 mt-1 overflow-hidden">
          {suggestions.map((p: any) => (
            <div
              key={p._id}
              onClick={() => {
                setKeyword(p.name);
                setShowSuggestions(false);
                router.push(`/product/${p._id}`);
              }}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 border-b border-gray-50 last:border-0"
            >
              <Search size={14} className="text-gray-400" />
              <span className="text-gray-800 text-sm font-medium">{p.name}</span>
            </div>
          ))}
          <div className="bg-gray-50 px-4 py-2 text-[10px] text-gray-400 flex items-center gap-2">
            <Clock size={12} /> Trending now
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchBox() {
  return (
    <Suspense fallback={<div className="h-10 w-64 bg-gray-800 animate-pulse rounded-xl"></div>}>
      <SearchInput />
    </Suspense>
  );
}