"use client";
import { useRouter } from 'next/navigation';
import { QUICK_FILTERS } from '@/constants/categoryData';

export default function CategoryFilters({ activeCategory }: { activeCategory: string }) {
  const router = useRouter();

  return (
    <div className="flex gap-3 overflow-x-auto pb-8 no-scrollbar">
      {QUICK_FILTERS.map((cat) => (
        <button
          key={cat}
          onClick={() => {
            const url = cat === "All" ? '/' : `/?category=${cat}`;
            router.push(url);
          }}
          className={`px-6 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${activeCategory === cat || (cat === "All" && !activeCategory)
              ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30"
              : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}