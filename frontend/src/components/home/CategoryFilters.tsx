"use client";
import { useRouter } from 'next/navigation';
import { QUICK_FILTERS } from '@/constants/categoryData';

export default function CategoryFilters({ activeCategory }: { activeCategory?: string }) {
  const router = useRouter();

  return (
    <div className="relative w-full bg-gray-700">
      <div className="flex gap-3 overflow-x-auto px-2 py-1.5 no-scrollbar scroll-smooth">
        {QUICK_FILTERS.map((cat) => {
          const isActive = activeCategory === cat || (cat === "All" && !activeCategory);

          return (
            <button
              key={cat}
              onClick={() => {
                const params = new URLSearchParams();
                if (cat !== "All") {
                  params.set('category', cat);
                }
                router.push(`/?${params.toString()}`);
              }}
              className={`
                flex items-center gap-2 px-1 py-0.5 text-sm 
                transition-all duration-100 whitespace-nowrap group 
                ${isActive ? "font-semibold scale-105 bg-gray-600 rounded-sm" : "font-medium hover:text-gray-400 "}`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="absolute right-0 top-0 h-full w-20 bg-linear-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
    </div>
  );
}