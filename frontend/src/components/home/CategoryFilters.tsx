// "use client";
// import { useRouter } from 'next/navigation';
// import { QUICK_FILTERS } from '@/constants/categoryData';

// export default function CategoryFilters({ activeCategory }: { activeCategory?: string }) {
//   const router = useRouter();

//   return (
//     <div className="relative w-full bg-gray-800">
//       <div className="flex gap-4 overflow-x-auto px-2 py-1.5 no-scrollbar scroll-smooth">
//         {QUICK_FILTERS.map((cat) => {
//           const isActive = activeCategory === cat || (cat === "All" && !activeCategory);

//           return (
//             <button
//               key={cat}
//               onClick={() => {
//                 const params = new URLSearchParams();
//                 if (cat !== "All") {
//                   params.set('category', cat);
//                 }
//                 router.push(`/?${params.toString()}`);
//               }}
//               className={`
//                 flex items-center gap-2 px-1 py-0.5 text-xs sm:text-sm lg:text-base 
//                 transition-all duration-100 whitespace-nowrap group cursor-pointer
//                 ${isActive ? "font-semibold scale-105 bg-gray-600 rounded-sm" : "font-medium hover:text-gray-400 "}`}
//             >
//               {cat}
//             </button>
//           );
//         })}
//       </div>

//       <div className="absolute right-0 top-0 h-full w-20 bg-linear-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
//     </div>
//   );
// }



"use client";
import { useRouter, useSearchParams } from 'next/navigation';
import { QUICK_FILTERS } from '@/constants/categoryData';

export default function CategoryFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || "All";

  return (
    <div className="relative w-full bg-[#232F3E] text-white border-t border-gray-700/30">
      <div className="flex gap-6 overflow-x-auto px-4 py-2.5 no-scrollbar scroll-smooth text-xs sm:text-sm font-medium">
        {QUICK_FILTERS.map((cat) => {
          const isActive = activeCategory === cat;

          return (
            <button
              key={cat}
              onClick={() => {
                if (cat === "All") {
                  router.push('/search');
                } else {
                  router.push(`/search?category=${encodeURIComponent(cat)}`);
                }
              }}
              className={`transition-all duration-150 whitespace-nowrap tracking-wide hover:text-orange-400 cursor-pointer ${isActive ? "text-orange-400 font-bold border-b-2 border-orange-400" : "text-gray-200"
                }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}