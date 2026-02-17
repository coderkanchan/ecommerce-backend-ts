"use client";
import { useDispatch } from 'react-redux';
import { addToCart } from '@/redux/slices/cartSlice';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import API from '@/services/api';

export default function ProductDetails() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
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
    dispatch(addToCart({
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
        <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-contain" />
      </div>
      <div className="flex-1 space-y-4">
        <h1 className="text-4xl font-bold text-white">{product.name}</h1>
        <p className="text-2xl text-blue-400 font-bold">${product.price}</p>
        <p className="text-gray-400 leading-relaxed">{product.description}</p>
        <button
          onClick={handleAddToCart}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700">
          Add to Cart
        </button>

        <button
          onClick={handleBuyNow}
          className="w-full bg-orange-500 text-white py-4 rounded-full font-bold hover:bg-orange-600 transition shadow-lg"
        >
          Buy Now ⚡
        </button>
      </div>
    </div>
  );
}