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
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-white">Latest Products</h1>
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
     
   
      <Pagination pages={pages} page={page} />
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