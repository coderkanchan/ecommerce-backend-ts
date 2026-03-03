// "use client";
// import { useState, useEffect, useRef, Suspense } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { Search } from 'lucide-react';

// function SearchInput() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
//   const currentCategory = searchParams.get('category') || 'All';
//   const categories = ["Electronics", "Fashion", "Home", "Books", "Toys", "Beauty"];

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       if (keyword.trim()) {
//         router.push(`/?keyword=${keyword}${currentCategory !== 'All' ? `&category=${currentCategory}` : ''}`);
//       } else if (keyword === "") {
//         router.push(currentCategory !== 'All' ? `/?category=${currentCategory}` : '/');
//       }
//     }, 500);

//     return () => clearTimeout(delayDebounceFn);
//   }, [keyword, currentCategory, router]);

//   const submitHandler = (e: React.FormEvent) => {
//     e.preventDefault(); 
//   };

//   return (
//     <form onSubmit={submitHandler} className="flex-1 max-w-lg flex items-center border border-blue-500 rounded-xl overflow-hidden bg-white shadow-sm">
//       <select
//         className="bg-gray-100 text-gray-700 text-sm px-2 outline-none cursor-pointer hover:bg-gray-200 h-10 border-r border-blue-500"
//         value={currentCategory}
//         onChange={(e) => {
//           const val = e.target.value;
//           setKeyword(''); 
//           router.push(val === 'All' ? '/' : `/?category=${val}`);
//         }}
//       >
//         <option value="All">All </option>
//         {categories.map((cat) => (
//           <option key={cat} value={cat}>{cat}</option>
//         ))}
//       </select>

//       <div className='w-full flex items-center'>
//         <input
//           type="text"
//           value={keyword}
//           onChange={(e) => setKeyword(e.target.value)}
//           className="px-4 w-full text-black outline-none h-10 text-sm py-2"
//           placeholder="Search products..."
//         />
//         <div className="p-2 text-blue-600">
//           <Search size={20} />
//         </div>
//       </div>
//     </form>
//   );
// }

// export default function SearchBox() {
//   return (
//     <Suspense fallback={<div className="h-10 w-64 bg-gray-800 animate-pulse rounded-xl"></div>}>
//       <SearchInput />
//     </Suspense>
//   );
// }



"use client";
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, MapPin, Clock } from 'lucide-react';
import API from '@/services/api';

const SEARCH_CATEGORIES = [
  "All", "Electronics", "Fashion", "Home", "Books", "Toys",
  "Beauty", "Automotive", "Grocery", "Health", "Sports"
];

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
      } else if (keyword === "") {
        if (searchParams.get('keyword')) router.push(currentCategory !== 'All' ? `/?category=${currentCategory}` : '/');
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, currentCategory, router, searchParams]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (keyword.length > 1) {
        try {
          const { data } = await API.get(`/products/all?keyword=${keyword}&limit=6`);
          setSuggestions(data.products);
          setShowSuggestions(true);
        } catch (err) {
          console.log("Suggestions error:", err);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };
    fetchSuggestions();
  }, [keyword]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
  };

  return (
    <div className="relative flex-1 max-w-lg" ref={suggestionRef}>
      <form
        onSubmit={submitHandler}
        className="flex items-center border border-blue-500 rounded-xl overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-400 transition-all"
      >
        <select
          className="bg-gray-100 text-gray-700 text-xs sm:text-sm px-2 outline-none cursor-pointer hover:bg-gray-200 h-10 border-r border-blue-500"
          value={currentCategory}
          onChange={(e) => {
            const val = e.target.value;
            router.push(val === 'All' ? '/' : `/?category=${val}`);
          }}
        >
          {SEARCH_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <div className='w-full flex items-center relative'>
          <input
            type="text"
            value={keyword}
            onFocus={() => keyword.length > 1 && setShowSuggestions(true)}
            onChange={(e) => setKeyword(e.target.value)}
            className="px-4 w-full text-black outline-none h-10 text-sm py-2"
            placeholder="Search for products, brands and more..."
          />
          <button type="submit" className="p-2 text-blue-600 hover:scale-110 transition">
            <Search size={20} />
          </button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white border border-gray-200 shadow-2xl rounded-b-xl z-[100] mt-1 overflow-hidden">
          {suggestions.map((product: any) => (
            <div
              key={product._id}
              onClick={() => {
                setKeyword(product.name);
                setShowSuggestions(false);
                router.push(`/product/${product._id}`);
              }}
              className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between group transition-colors"
            >
              <div className="flex items-center gap-3">
                <Search size={16} className="text-gray-400 group-hover:text-blue-500" />
                <span className="text-gray-800 font-medium text-sm">{product.name}</span>
              </div>
              <span className="text-[10px] text-gray-400 italic">in {product.category}</span>
            </div>
          ))}
          <div className="bg-gray-50 px-4 py-2 text-[10px] text-gray-400 flex items-center gap-2">
            <Clock size={12} /> Trending Searches in NexusMart
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