import { Suspense } from 'react';
import API from '@/services/api';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import ProductSkeleton from '@/components/ProductSkeleton';
import CategoryFilters from '@/components/home/CategoryFilters';
import HomeCarousel from '@/components/HomeCarousel';
import { HOME_CARDS } from '@/constants/homeData';
import Category4GridCard from '@/components/home/Category4GridCard';

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

  return (
    <div className="w-full flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-[1500px] px-2">

        <h1 className="text-2xl font-bold mb-6 text-white">Latest Products</h1>

        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
          {data.products && data.products.length > 0 ? (
            data.products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-white bg-gray-900/50 rounded-2xl">
              No Products Found
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 w-full max-w-[1500px] px-6">
        <Pagination pages={data.pages} page={data.page} />
      </div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-250 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <ProductSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export default async function Home({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const params = await searchParams;
  const category = params.category;
  const suspenseKey = JSON.stringify(params);

  return (
    <main className="w-full bg-[#EAEDED] min-h-screen pb-10 lg:min-w-[1000px] overflow-x-hidden">
      <CategoryFilters activeCategory={category || ""} />

      <div className="relative w-full">
        <HomeCarousel />
        <div className="absolute bottom-0 left-0 w-full h-[150px] md:h-[250px] bg-gradient-to-t from-[#EAEDED] via-[#EAEDED]/60 to-transparent z-10" />
      </div>

      <div className="lg:min-w-[1000px] max-w-[1500px] mx-auto px-4 relative z-20 -mt-32 md:-mt-60 lg:-mt-72">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {HOME_CARDS.map((card) => (
            <div key={card.id}>
              <Category4GridCard
                data={{
                  title: card.title,
                  items: card.items,
                  footerLink: { text: card.footerLabel, url: card.footerLink }
                }}
              />
            </div>
          ))}
        </div>

        <Suspense key={suspenseKey} fallback={<SkeletonLoader />}>
          <ProductGrid searchParams={params} />
        </Suspense>
      </div>
    </main>
  );
}