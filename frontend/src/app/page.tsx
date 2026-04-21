import { Suspense } from 'react';
import API from '@/services/api';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import ProductSkeleton from '@/components/ProductSkeleton';
import CategoryFilters from '@/components/home/CategoryFilters';

export const metadata = {
  title: 'NexusMart | Shop Latest Products',
  description: 'Explore the best deals on NexusMart.',
};

async function ProductGrid({ searchParams }: { searchParams: any }) {
  const keyword = searchParams.keyword || '';
  const category = searchParams.category || '';
  const pageNumber = searchParams.pageNumber || '1';

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(
      `${baseUrl}/api/products/all?keyword=${keyword}&category=${category}&pageNumber=${pageNumber}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) throw new Error('Failed to fetch');
    const data = await res.json();

    return (
      <>
        <h1 className="text-3xl font-bold mb-8 text-white tracking-tight">
          {keyword ? `Search results for "${keyword}"` : category ? `${category} Products` : 'Latest Products'}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.products.length > 0 ? (
            data.products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-gray-900/50 rounded-3xl border border-dashed border-gray-800 text-white">
              No Products Found
            </div>
          )}
        </div>

        <div className="mt-12">
          <Pagination pages={data.pages} page={data.page} />
        </div>
      </>
    );
  } catch (error) {
    console.error("Fetch error:", error);
    return <div className="text-white">Error loading products. Check if Backend is running at 5000.</div>;
  }
}
function SkeletonLoader() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <ProductSkeleton key={index} />
      ))}
    </div>
  );
}

export default async function Home({ searchParams }: { searchParams: any }) {
  return (
    <main className="container mx-auto p-4 min-h-screen">
      <CategoryFilters activeCategory={searchParams.category} />

      <Suspense fallback={<SkeletonLoader />}>
        <ProductGrid searchParams={searchParams} />
      </Suspense>
    </main>
  );
}