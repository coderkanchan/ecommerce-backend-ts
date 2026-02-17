
"use client";
import { useEffect, useState } from 'react';
import API from '@/services/api';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await API.get('/products/all');
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  if (loading) return <div className="p-10 text-center text-white">Loading Products...</div>;

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-white">New Arrivals</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (

          <Link href={`/product/${product._id}`} key={product._id} className="group border border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition bg-gray-900">
            <div className="h-64 overflow-hidden bg-white">
              <img
                src={product.imageUrl && product.imageUrl.startsWith('http')
                  ? product.imageUrl
                  : `http://localhost:5000${product.imageUrl}
                  `}
                alt={product.name}
                className="w-full h-full object-contain p-4 group-hover:scale-105 transition duration-300"
                onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/300?text=No+Image+Found" }}
              />
            </div>

            <div className="p-4">
              <h2 className="font-semibold text-lg text-white truncate">{product.name}</h2>
              <p className="text-blue-400 font-bold text-xl mt-2">${product.price}</p>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                View Details
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}