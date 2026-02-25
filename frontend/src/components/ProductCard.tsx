"use client";
import Link from 'next/link';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product._id}`}
      className="group border border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition bg-gray-900"
    >
      <div className="h-64 overflow-hidden bg-white">
        <img
          src={product.imageUrl && product.imageUrl.startsWith('http')
            ? product.imageUrl
            : `http://localhost:5000${product.imageUrl}`}
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
  );
}