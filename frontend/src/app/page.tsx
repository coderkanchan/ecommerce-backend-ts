
"use client";
import { useEffect, useState } from 'react';
import API from '@/services/api';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/Pagination';
import { useParams } from 'next/navigation';

export default function Home() {
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const pageNumber = params.pageNumber || 1;

  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await API.get('/products/all');
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
  }, [pageNumber]);

  if (loading) return <div className="p-10 text-center text-white">Loading Products...</div>;

  return (
    // <div className="max-w-7xl mx-auto p-8">
    //   <h1 className="text-3xl font-bold mb-8 text-white">New Arrivals</h1>

    //   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    //     {products.map((product: any) => (

    //       <Link href={`/product/${product._id}`} key={product._id} className="group border border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition bg-gray-900">
    //         <div className="h-64 overflow-hidden bg-white">
    //           <img
    //             src={product.imageUrl && product.imageUrl.startsWith('http')
    //               ? product.imageUrl
    //               : `http://localhost:5000${product.imageUrl}
    //               `}
    //             alt={product.name}
    //             className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-300"
    //             onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/300?text=No+Image+Found" }}
    //           />
    //         </div>

    //         <div className="p-4">
    //           <h2 className="font-semibold text-lg text-white truncate">{product.name}</h2>
    //           <p className="text-blue-400 font-bold text-xl mt-2">${product.price}</p>
    //           <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
    //             View Details
    //           </button>
    //         </div>
    //       </Link>
    //     ))}
    //   </div>

    //   <Pagination pages={pages} page={page} isAdmin={true} />
    // </div>
    
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Latest Products</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64 font-mono text-blue-500 animate-pulse text-xl">
          &lt; Loading Products /&gt;
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <Pagination pages={pages} page={page} />
        </>
      )}
    </main>
  );
}