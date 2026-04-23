"use client";
import { useRouter } from 'next/navigation';
import { QUICK_FILTERS } from '@/constants/categoryData';
import { LayoutGrid, Laptop, Shirt, Home, Smartphone, Zap } from 'lucide-react';

const ICON_MAP: { [key: string]: any } = {
  All: LayoutGrid,
  Electronics: Zap,
  Fashion: Shirt,
  Home: Home,
  Mobile: Smartphone,
  Laptops: Laptop,
};

export default function CategoryFilters({ activeCategory }: { activeCategory?: string }) {
  const router = useRouter();

  return (
    <div className="relative w-full mb-10">
      <div className="flex gap-4 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth">
        {QUICK_FILTERS.map((cat) => {
          const Icon = ICON_MAP[cat] || LayoutGrid;
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
                flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold 
                transition-all duration-300 whitespace-nowrap group
                ${isActive
                  ? "bg-blue-600 border-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105"
                  : "bg-[#111] border-gray-800 text-gray-400 hover:border-gray-600 hover:text-gray-200"
                }
              `}
            >
              <Icon
                size={18}
                className={`transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-gray-500"}`}
              />
              {cat}
            </button>
          );
        })}
      </div>

      <div className="absolute right-0 top-0 h-full w-20 bg-linear-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
    </div>
  );
}