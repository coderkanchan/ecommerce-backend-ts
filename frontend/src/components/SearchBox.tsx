"use client";
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, Clock } from 'lucide-react';
import API from '@/services/api';
import { SEARCH_CATEGORIES } from '@/constants/categoryData';

interface SearchInputProps {
  onFocusChange?: (isFocused: boolean) => void;
}

function SearchInput({ onFocusChange }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const suggestionRef = useRef<HTMLDivElement>(null);
  const textMeasurementRef = useRef<HTMLSpanElement>(null);

  // DOM Input Reference Pointer for Auto-Focus execution
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [keyword, setKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Standard Local States without localStorage caching for native reset on hard refresh
  const [currentCategory, setCurrentCategory] = useState('All');
  const [dropdownWidth, setDropdownWidth] = useState(65);

  // URL State Synchronizer (Only tracks parameters if present in search routes)
  useEffect(() => {
    const urlKeyword = searchParams.get('keyword');
    const urlCategory = searchParams.get('category');

    if (pathname === '/search') {
      if (urlKeyword) setKeyword(urlKeyword);
      if (urlCategory) setCurrentCategory(urlCategory);
    } else {
      // Automatic drop and reset to default template on normal page shifts or main loads
      setKeyword('');
      setCurrentCategory('All');
    }
  }, [searchParams, pathname]);

  // Amazon-Style Dynamic Width Calculator Matrix
  useEffect(() => {
    if (textMeasurementRef.current) {
      const calculatedWidth = textMeasurementRef.current.offsetWidth + 44;
      setDropdownWidth(Math.min(Math.max(calculatedWidth, 65), 240));
    }
  }, [currentCategory]);

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
    if (onFocusChange) onFocusChange(false);

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
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        if (onFocusChange) onFocusChange(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onFocusChange]);

  return (
    <div className="relative flex-1 max-w-sm" ref={suggestionRef}>

      <span
        ref={textMeasurementRef}
        className="absolute invisible h-0 w-auto text-xs sm:text-sm font-semibold whitespace-pre px-1"
        aria-hidden="true"
      >
        {currentCategory}
      </span>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearchSubmit(keyword, currentCategory);
        }}
        className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-gray-100 shadow-sm transition-all duration-200 focus-within:ring-2 focus-within:ring-orange-400 focus-within:border-transparent focus-within:shadow-md"
      >
        <select
          style={{ width: `${dropdownWidth}px` }}
          className="text-gray-700 text-xs sm:text-sm pl-3 pr-8 outline-none h-10 border-r border-gray-300 bg-gray-200 cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%234A5568%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:9px_9px] bg-[position:right_12px_center] bg-no-repeat transition-all duration-150 hover:bg-gray-300 font-semibold whitespace-nowrap overflow-hidden"
          value={currentCategory}
          onFocus={() => {
            if (onFocusChange) onFocusChange(true);
          }}
          onChange={(e) => {
            const nextCat = e.target.value;
            // 1. Instantly shift internal category state value
            setCurrentCategory(nextCat);

            if (searchInputRef.current) {
              searchInputRef.current.focus();
            }
          }}
        >
          {SEARCH_CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-white text-black font-normal">{cat}</option>
          ))}
        </select>

        <div className='w-full flex items-center bg-white'>
          <input
            ref={searchInputRef}
            type="text"
            autoComplete="off"
            id="product-search"
            value={keyword}
            onFocus={() => {
              if (keyword.length > 0) setShowSuggestions(true);
              if (onFocusChange) onFocusChange(true);
            }}
            onChange={(e) => {
              setKeyword(e.target.value);
              setShowSuggestions(true);
            }}
            className="px-4 w-full text-black outline-none h-10 text-sm py-2 bg-white"
            placeholder="Search NexusMart..."
          />
          <button
            type="submit"
            className="p-2 text-blue-600 hover:bg-gray-200 h-10 transition-colors shrink-0 bg-white"
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
                if (onFocusChange) onFocusChange(false);
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

export default function SearchBox({ onFocusChange }: SearchInputProps) {
  return (
    <Suspense fallback={<div className="h-10 w-64 bg-gray-800 animate-pulse rounded-xl"></div>}>
      <SearchInput onFocusChange={onFocusChange} />
    </Suspense>
  );
}