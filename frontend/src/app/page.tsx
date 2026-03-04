"use client";
import { useEffect, useState, Suspense } from 'react';
import API from '@/services/api';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import ProductSkeleton from '@/components/ProductSkeleton';
import { QUICK_FILTERS } from '@/constants/categoryData';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState(searchParams.get('sort') || '');

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const pageNumber = searchParams.get('pageNumber') || '1';

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/all?keyword=${keyword}&category=${category}&pageNumber=${pageNumber}&sort=${sort}`)
        setProducts(data.products);
        setPages(data.pages);
        setPage(data.page);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [keyword, category, pageNumber, sort]);

  return (
    <main className="container mx-auto p-4 min-h-screen">
      <div className="flex gap-3 overflow-x-auto pb-8 scrollbar-hide no-scrollbar">
        {QUICK_FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              const url = cat === "All" ? '/' : `/?category=${cat}`;
              router.push(url);
            }}
            className={`px-6 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap ${category === cat || (cat === "All" && !category)
              ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30"
              : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold mb-8 text-white tracking-tight">
            {keyword ? `Search results for "${keyword}"` : category ? `${category} Products` : 'Latest Products'}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Sort by:</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                router.push(`/?sort=${e.target.value}${keyword ? `&keyword=${keyword}` : ''}${category ? `&category=${category}` : ''}`);
              }}
              className="bg-gray-900 border border-gray-800 text-white text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="lowest">Price: Low to High</option>
              <option value="highest">Price: High to Low</option>
              <option value="toprated">Avg. Customer Review</option>
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-gray-900/50 rounded-3xl border border-dashed border-gray-800">
                <div className="text-6xl mb-4 opacity-50">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-300">No Products Found</h3>
                <p className="text-gray-500 mt-2">We couldn't find what you're looking for.</p>
                <button
                  onClick={() => router.push('/')}
                  className="mt-6 bg-gray-800 px-6 py-2 rounded-full text-blue-400 hover:bg-gray-700 transition"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          <div className="mt-12">
            <Pagination pages={pages} page={page} />
          </div>
        </>
      )}
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-white text-center p-10">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}