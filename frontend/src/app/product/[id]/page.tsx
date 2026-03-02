"use client";
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slices/cartSlice';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { buyNowRequest } from '@/redux/slices/cartSlice';
import Image from 'next/image';
import API from '@/services/api';

export default function ProductDetails() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await API.get(`products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    if (id) getProduct();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      qty: 1
    }));
  };

  const handleBuyNow = () => {
    dispatch(buyNowRequest({
      _id: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      qty: Number(qty)
    }));
    router.push('/shipping');
  };

  if (!product) return <div className="p-10 text-center">Loading details...</div>;

  return (
    <div className="max-w-6xl mx-auto p-8 flex flex-col md:flex-row gap-8">

      <div className="flex-1 bg-white rounded-xl p-4">
        <div
          //className="relative w-full h-[300px] md:h-[450px] block overflow-hidden"
          className="relative w-full h-96 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      <div className="flex-1 space-y-4">

        <h1 className="text-4xl font-bold text-white">{product.name}</h1>

        <p className="text-2xl text-blue-400 font-bold">${product.price}</p>

        <p className="text-gray-400 leading-relaxed">{product.description}</p>

        <div className='flex items-center justify-between'>

          <button
            onClick={handleAddToCart}
            className="bg-blue-600 py-3 px-8 text-white  rounded-lg font-bold hover:bg-blue-700 cursor-pointer">
            Add to Cart
          </button>

          <button
            onClick={handleBuyNow}

          >
            Buy Now
          </button>

        </div>
      </div>
    </div>
  );
}