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

async function getProductsData(searchParams: any) {
  const keyword = searchParams.keyword || '';
  const category = searchParams.category || '';
  const pageNumber = searchParams.pageNumber || '1';

  try {
    const { data } = await API.get(`/products/all?keyword=${keyword}&category=${category}&pageNumber=${pageNumber}`);
    return data;
  } catch (error) {
    console.error("Fetch Error:", error);
    return { products: [], pages: 1, page: 1 };
  }
}

async function ProductGrid({ searchParams }: { searchParams: any }) {
  const data = await getProductsData(searchParams);
  const keyword = searchParams.keyword;
  const category = searchParams.category;

  return (
    <>
      <h1 className="text-3xl font-bold mb-8 text-white tracking-tight">
        {keyword ? `Search results for "${keyword}"` : category ? `${category} Products` : 'Latest Products'}
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
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
}

function SkeletonLoader() {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="grid grid-cols-4 min-w-[1000px] gap-6">
        {[...Array(8)].map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export default async function Home(props: { searchParams: Promise<any> }) {

  const searchParams = await props.searchParams;

  const category = searchParams.category || '';

  const suspenseKey = JSON.stringify(searchParams);

  return (
    <main className="container mx-auto p-4 min-h-screen">
      <CategoryFilters activeCategory={category} />

      <Suspense key={suspenseKey} fallback={<SkeletonLoader />}>
        <ProductGrid searchParams={searchParams} />
      </Suspense>
    </main>
  );
}