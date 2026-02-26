"use client";
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const currentCategory = searchParams.get('category') || 'All';
  const categories = ["Electronics", "Fashion", "Home", "Books", "Toys", "Beauty"];

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (keyword.trim()) {
      router.push(`/?keyword=${keyword}${currentCategory !== 'All' ? `&category=${currentCategory}` : ''}`);
    } else {
      router.push(currentCategory !== 'All' ? `/?category=${currentCategory}` : '/');
    }
  };

  return (
    <form onSubmit={submitHandler} className="flex-1 max-w-lg flex items-center border border-blue-500 rounded-xl overflow-hidden group">
      <select
        className="bg-gray-400 text-gray-700 text-lg py-4  outline-none cursor-pointer hover:bg-gray-200 h-10"
        value={currentCategory}
        onChange={(e) => {
          const val = e.target.value;
          router.push(val === 'All' ? '/' : `/?category=${val}`);
        }}
      >
        <option value="All">All</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <div className='w-full flex items-center justify-between'>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className=" py-4 w-full text-black outline-none h-10"
          placeholder="Search NexusMart..."
        />

        <button type="submit" className="bg-blue-600 p-4  text-white hover:bg-blue-700 transition">
          <Search size={30} />
        </button>
      </div>
    </form>
  );
}

export default function SearchBox() {
  return (
    <Suspense fallback={<div className="h-10 w-64 bg-gray-800 animate-pulse rounded-xl"></div>}>
      <SearchInput />
    </Suspense>
  );
}