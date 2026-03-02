"use client";
import { useEffect, useState, Suspense } from 'react';
import API from '@/services/api';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

function HomeContent() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const pageNumber = searchParams.get('pageNumber') || '1';

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/all?keyword=${keyword}&category=${category}&pageNumber=${pageNumber}`
        );
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
  }, [keyword, category, pageNumber]);

  if (loading) return <div className="p-10 text-center text-white font-mono animate-pulse">Loading Products...</div>;

  return (
    <main className="container mx-auto p-4 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-white tracking-tight">
        {keyword ? `Search results for "${keyword}"` : 'Latest Products'}
      </h1>

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