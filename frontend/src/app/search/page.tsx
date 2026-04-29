import API from '@/services/api';
import ProductCard from '@/components/ProductCard';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ category?: string; keyword?: string }> }) {
  const params = await searchParams;
  const keyword = params.keyword || '';
  const category = searchParams.category;
  const { data } = await API.get(`/products/all?category=${category}`);

  let products = [];
  try {
    const { data } = await API.get(`/products/all?keyword=${keyword}&category=${category}`);
    products = data.products;
  } catch (error) {
    console.error("Search Fetch Error:", error);
  }

  return (
    <main className="min-h-screen bg-[#EAEDED] py-6">
      <div className="max-w-[1500px] mx-auto px-4">
        <div className="bg-white p-4 mb-4 shadow-sm">
          <h1 className="text-lg font-medium text-[#0F1111]">
            {products.length} results for <span className="text-[#C7511F] font-bold">"{category || keyword}"</span>
          </h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.length > 0 ? (
            products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white shadow-sm rounded-md">
              <p className="text-xl font-semibold text-gray-600">No products found!</p>
              <p className="text-gray-400">Try checking a different category or spelling.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}