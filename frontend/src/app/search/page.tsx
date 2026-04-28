import API from '@/services/api';
import ProductCard from '@/components/ProductCard';

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ category?: string; keyword?: string }> }) {
  const params = await searchParams;
  const category = params.category || '';
  const keyword = params.keyword || '';

  let products = [];
  try {
    const { data } = await API.get(`/products/all?keyword=${keyword}&category=${category}`);
    products = data.products;
  } catch (error) {
    console.error("Search Fetch Error:", error);
  }

  return (
    <div className="max-w-[1500px] mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">
        {category ? `Results for "${category}"` : "Search Results"}
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center py-10">No products found in this category.</p>
        )}
      </div>
    </div>
  );
}