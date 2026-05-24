"use client";
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Clock } from 'lucide-react';
import API from '@/services/api';
import { SEARCH_CATEGORIES } from '@/constants/categoryData';

interface SearchInputProps {
  onFocusChange?: (isFocused: boolean) => void;
}

function SearchInput({ onFocusChange }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const suggestionRef = useRef<HTMLDivElement>(null);

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const currentCategory = searchParams.get('category') || 'All';

  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
  }, [searchParams]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (keyword.trim().length > 0) {
        try {
          const { data } = await API.get(`/products/all?keyword=${encodeURIComponent(keyword)}&limit=6`);
          setSuggestions(data.products);
        } catch (err) {
          console.error("Suggestions fetch error:", err);
        }
      } else {
        setSuggestions([]);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  const handleSearchSubmit = (searchKeyword: string, searchCategory: string) => {
    setShowSuggestions(false);
    let targetUrl = `/search?`;
    const queryParts: string[] = [];

    if (searchKeyword.trim()) {
      queryParts.push(`keyword=${encodeURIComponent(searchKeyword.trim())}`);
    }
    if (searchCategory && searchCategory !== 'All') {
      queryParts.push(`category=${encodeURIComponent(searchCategory)}`);
    }

    router.push(queryParts.length > 0 ? `${targetUrl}${queryParts.join('&')}` : '/search');
  };

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
    <div className="relative flex-1 max-w-sm" ref={suggestionRef}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchSubmit(keyword, currentCategory);
        }}
        className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-100 shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-orange-400 focus-within:border-transparent focus-within:shadow-md"
      >
        <select
          className="w-auto max-w-[160px] text-gray-700 text-xs sm:text-sm pl-3 pr-8 outline-none h-10 border-r border-gray-300 bg-gray-200 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%234A5568%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')]
           bg-[length:10px_10px] bg-[position:right_10px_center] bg-no-repeat transition-colors hover:bg-gray-300"
          value={currentCategory}
          onChange={(e) => {
            const nextCat = e.target.value;
            handleSearchSubmit(keyword, nextCat);
          }}
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
            onFocus={() => {
              if (keyword.length > 0) setShowSuggestions(true);
              if (onFocusChange) onFocusChange(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                if (onFocusChange) onFocusChange(false);
              }, 200);
            }}
            onChange={(e) => {
              setKeyword(e.target.value);
              setShowSuggestions(true);
            }}
            className="px-4 w-full text-black outline-none h-10 text-sm py-2"
            placeholder="Search NexusMart..."
          />
          <button
            type="submit"
            className="p-2 text-blue-600 hover:bg-gray-200 h-10 transition-colors"
            aria-label="Submit Search"
          >
            <Search size={20} />
          </button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-2xl rounded-b-xl z-50 mt-1 overflow-hidden">
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
              <Search
                size={14}
                className="text-gray-400" />
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

export default function SearchBox({ onFocusChange }: SearchInputProps) {
  return (
    <Suspense fallback={<div className="h-10 w-64 bg-gray-800 animate-pulse rounded-xl"></div>}>
      <SearchInput onFocusChange={onFocusChange} />
    </Suspense>
  );
}