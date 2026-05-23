import API from '@/services/api';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { CATEGORY_TREE } from '@/constants/categoryData';

// Explicit structural typing for Next.js 14+ / 15 server params
interface SearchPageProps {
  searchParams: Promise<{
    category?: string;
    subCategory?: string;
    keyword?: string;
    sort?: string;
    pageNumber?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  // Extract state constraints cleanly
  const keyword = params.keyword || '';
  const category = params.category || '';
  const subCategory = params.subCategory || '';
  const sort = params.sort || '';
  const pageNumber = params.pageNumber || '1';

  let products = [];
  let isSuggestionMode = false;

  // Build the granular backend analytical query pipeline
  let apiUrl = `/products/all?pageNumber=${pageNumber}`;
  if (keyword) apiUrl += `&keyword=${encodeURIComponent(keyword)}`;
  if (category && category !== 'All') apiUrl += `&category=${encodeURIComponent(category)}`;
  if (subCategory) apiUrl += `&subCategory=${encodeURIComponent(subCategory)}`;
  if (sort) apiUrl += `&sort=${sort}`;

  try {
    const { data } = await API.get(apiUrl);
    products = data.products;

    // Smart Suggestion Core Mechanism: If zero matches occur, fetch top global collection
    if (products.length === 0) {
      isSuggestionMode = true;
      const { data: fallbackData } = await API.get(`/products/all?pageSize=10`);
      products = fallbackData.products;
    }
  } catch (error) {
    console.error("Advanced Search Pipeline Stream Resolution Failure:", error);
  }

  // Active taxonomy logic mapping for sidebar components
  const activeSubCategories = category && CATEGORY_TREE[category] ? CATEGORY_TREE[category] : [];

  return (
    <main className="min-h-screen bg-[#F7F8FA] py-8 text-black">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-6">

        {/* Top Header Grid Area */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <nav className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <span className="text-gray-800 font-medium">Search Results</span>
            </nav>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              {isSuggestionMode ? (
                <span>
                  No direct hits for <span className="text-red-500">"{subCategory || category || keyword}"</span>. Discovered Recommendations:
                </span>
              ) : (
                <span>
                  Explore <span className="text-blue-600">{(subCategory || category || keyword) ? `"${subCategory || category || keyword}"` : "All Products"}</span>
                </span>
              )}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">{isSuggestionMode ? "Global catalog fallback applied" : `Found ${products.length} matching inventory entities`}</p>
          </div>

          {/* Quick Sort Dropdown Pipeline Interface */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sort By:</span>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 outline-none font-medium cursor-pointer"
              defaultValue={sort}
            // Runtime redirection via query updating simulation layer
            // Simple native link or immediate form submission substitute
            >
              <option value="">Featured / Newest</option>
              <option value="lowest">Price: Low to High</option>
              <option value="highest">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          <aside className="w-full lg:w-64 shrink-0 bg-white border border-gray-200 rounded-xl p-5 shadow-sm h-fit">
            <div className="mb-6">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Filter Modules</h2>
              <div className="h-[1px] bg-gray-100 w-full mb-4"></div>

              <h3 className="text-sm font-bold text-gray-800 mb-2">Primary Domains</h3>
              <ul className="space-y-1.5">
                <li>
                  <Link
                    href="/search"
                    className={`text-sm block py-1 px-2 rounded-md transition-colors ${!category ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    All Directories
                  </Link>
                </li>
                {Object.keys(CATEGORY_TREE).map((cat) => (
                  <li key={cat}>
                    <Link
                      href={`/search?category=${encodeURIComponent(cat)}`}
                      className={`text-sm block py-1 px-2 rounded-md transition-colors ${category === cat ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {activeSubCategories.length > 0 && (
              <div className="animate-fadeIn">
                <div className="h-[1px] bg-gray-100 w-full my-4"></div>
                <h3 className="text-sm font-bold text-gray-800 mb-2">Sub-Taxonomies</h3>
                <ul className="space-y-1.5">
                  {activeSubCategories.map((sub) => (
                    <li key={sub}>
                      <Link
                        href={`/search?category=${encodeURIComponent(category)}&subCategory=${encodeURIComponent(sub)}`}
                        className={`text-sm block py-1 px-2 rounded-md transition-colors ${subCategory === sub ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        {sub}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>

          <div className="flex-1">
            {products.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-24 bg-white border border-gray-200 rounded-xl shadow-sm">
                <div className="p-4 bg-gray-50 rounded-full text-gray-400 mb-3">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 12H4M12 20V4"></path></svg>
                </div>
                <p className="text-lg font-bold text-gray-800">No Inventory Nodes Resolved</p>
                <p className="text-sm text-gray-400 mt-1 max-w-xs text-center">We couldn't find any listings corresponding to your requested taxonomy query vectors.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((product: any) => (
                  <div key={product._id} className="transition-transform duration-300 hover:-translate-y-1">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}