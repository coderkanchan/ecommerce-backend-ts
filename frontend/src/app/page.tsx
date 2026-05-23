import { Suspense } from 'react';
import API from '@/services/api';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import CategoryFilters from '@/components/home/CategoryFilters';
import HomeCarousel from '@/components/HomeCarousel';
import { HOME_CARDS } from '@/constants/homeData';
import Category4GridCard from '@/components/home/Category4GridCard';

export const metadata = {
  title: 'NexusMart | Premium Developer & Electronics Ecosystem',
  description: 'Explore enterprise tier hardware nodes and development assets.',
};

async function FeaturedProductsGrid() {
  try {
    const response = await API.get('/products/all?pageNumber=1');
    const products = response.data.products?.slice(0, 8) || [];

    return (
      <div className="w-full max-w-7xl mx-auto px-4 mt-12">
        <h2 className="text-xl sm:text-2xl font-black mb-6 text-black uppercase tracking-tight">Trending Collections</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    return <p className="text-gray-500 text-center py-6">Ecosystem compilation latency detected.</p>;
  }
}

export default async function Home() {
  return (
    <main className="w-full bg-[#EAEDED] min-h-screen pb-16 overflow-x-hidden text-black">
      <CategoryFilters />

      <div className="relative w-full">
        <HomeCarousel />
        <div className="absolute bottom-0 left-0 w-full h-32 md:h-64 bg-gradient-to-t from-[#EAEDED] via-[#EAEDED]/70 to-transparent z-10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-20 -mt-24 md:-mt-52 lg:-mt-64">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {HOME_CARDS.map((card) => (
            <div key={card.id} className="h-full">
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

        <Suspense fallback={<div className="text-center text-gray-500 py-12">Compiling System Nodes...</div>}>
          <FeaturedProductsGrid />
        </Suspense>
      </div>
    </main>
  );
}