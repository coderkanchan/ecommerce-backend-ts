"use client";
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc = product.imageUrl && product.imageUrl.startsWith('http')
    ? product.imageUrl
    : `${process.env.NEXT_PUBLIC_API_URL}${product.imageUrl}`;

  return (
    <>
      <div className="w-full max-w-[320px] mx-auto">
        <Link
          href={`/product/${product._id}`}
          className="group border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all bg-[#111] flex flex-col h-full"
        >
          <div className="relative aspect-square overflow-hidden bg-gray-400">
            <Image
              src={imageSrc || "/placeholder.png"} 
              alt={product.name}
              fill
              className="object-contain p-3 group-hover:scale-105 transition duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            />
          </div>

          <div className="p-3 sm:p-4 flex flex-col grow">
            <h2 className="font-bold text-xs sm:text-sm md:text-base text-gray-100 truncate line-clamp-1">
              {product.name}
            </h2>
            <p className="text-blue-500 font-black text-sm sm:text-lg mt-1">
              ${product.price}
            </p>

            <button className="w-full mt-auto bg-blue-600 text-white py-1.5 sm:py-2 rounded-xl text-[10px] sm:text-sm font-bold hover:bg-blue-700 transition active:scale-95">
              View Details
            </button>
          </div>
        </Link>
      </div>
    </>
  );
}